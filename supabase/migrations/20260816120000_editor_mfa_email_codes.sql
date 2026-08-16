-- Email code as an alternative second factor for admin/moderator.
--
-- NOT APPLIED BY A GIT MERGE. This file is version control only; the
-- statements are run manually in the Lovable Cloud SQL Editor.
--
-- Depends on:
--   * public.editor_mfa_verifications (method 'email' is already allowed)
--   * extensions.hmac / extensions.gen_random_bytes  (pgcrypto lives in the
--     `extensions` schema, so every call MUST be schema-qualified — these
--     functions run with an empty search_path and a bare hmac() would fail
--     at runtime, not at review time)
--   * a Vault secret named `editor_mfa_email_pepper`
--
-- Nothing here changes existing RLS enforcement.

-- ---------------------------------------------------------------------------
-- 1. Code storage. Only the keyed HMAC is kept — never the code itself.
-- ---------------------------------------------------------------------------
create table public.editor_mfa_email_codes (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null,
  session_id  uuid        not null,
  code_hmac   bytea       not null,
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null,
  attempts    smallint    not null default 0,
  consumed_at timestamptz,

  constraint editor_mfa_email_codes_hmac_len   check (octet_length(code_hmac) = 32),
  constraint editor_mfa_email_codes_expiry     check (expires_at > created_at),
  constraint editor_mfa_email_codes_max_ttl    check (expires_at <= created_at + interval '15 minutes'),
  constraint editor_mfa_email_codes_attempts   check (attempts >= 0 and attempts <= 6)
);

-- At most one live code per session. Reissue consumes the previous row in the
-- same transaction, so this is a safety net rather than the mechanism.
create unique index editor_mfa_email_codes_active_uq
  on public.editor_mfa_email_codes (user_id, session_id)
  where consumed_at is null;

-- Supports the per-user cooldown and hourly cap lookups.
create index editor_mfa_email_codes_user_created_idx
  on public.editor_mfa_email_codes (user_id, created_at desc);

alter table public.editor_mfa_email_codes enable row level security;
revoke all on public.editor_mfa_email_codes from anon, authenticated, public;

comment on table public.editor_mfa_email_codes is
  'Short-lived email second-factor codes. Stores only hmac(code, pepper) — no plaintext and no reversible copy. Written exclusively by SECURITY DEFINER functions.';

-- ---------------------------------------------------------------------------
-- 2. Pepper accessor. Granted to nobody: only the definer-rights functions
--    below can reach it, and they run as the owner.
-- ---------------------------------------------------------------------------
create or replace function public.editor_mfa_pepper()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select decrypted_secret
  from vault.decrypted_secrets
  where name = 'editor_mfa_email_pepper'
$$;

revoke all on function public.editor_mfa_pepper() from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 3. Issuance. service_role ONLY — the browser must never reach this, because
--    it returns the plaintext code. Identity arrives as parameters that the
--    Edge Function derived from a JWT it validated immediately beforehand.
--    Anything holding service_role could already do this, so no new privilege.
-- ---------------------------------------------------------------------------
create or replace function public.issue_editor_email_code_for_delivery(
  _user_id    uuid,
  _session_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email  text;
  v_last   timestamptz;
  v_recent integer;
  v_rand   integer;
  v_code   text;
begin
  -- Editor roles only, re-checked here so a mis-wired caller cannot widen it.
  if not (
    public.has_role(_user_id, 'admin'::public.app_role)
    or public.has_role(_user_id, 'moderator'::public.app_role)
  ) then
    return jsonb_build_object('error', 'forbidden');
  end if;

  select u.email into v_email from auth.users u where u.id = _user_id;
  if v_email is null then
    return jsonb_build_object('error', 'forbidden');
  end if;

  -- Authoritative per-user limits. These live here, not in the Edge Function,
  -- because Postgres receives no trustworthy client IP and the database is the
  -- only place a limit cannot be sidestepped.
  select max(c.created_at) into v_last
  from public.editor_mfa_email_codes c
  where c.user_id = _user_id;

  if v_last is not null and v_last > now() - interval '60 seconds' then
    return jsonb_build_object(
      'error', 'cooldown',
      'retry_after', ceil(extract(epoch from (v_last + interval '60 seconds' - now())))
    );
  end if;

  select count(*) into v_recent
  from public.editor_mfa_email_codes c
  where c.user_id = _user_id and c.created_at > now() - interval '1 hour';

  if v_recent >= 5 then
    return jsonb_build_object('error', 'rate_limited');
  end if;

  -- Supersede the previous live code in the same transaction as the insert, so
  -- a resend can never fail on the unique index and two codes can never be
  -- valid at once.
  update public.editor_mfa_email_codes c
     set consumed_at = now()
   where c.user_id = _user_id
     and c.session_id = _session_id
     and c.consumed_at is null;

  -- Rejection sampling: 2^24 = 16,777,216, so values >= 16,000,000 are
  -- discarded to keep the modulo uniform across all 10^6 codes.
  loop
    select (get_byte(b, 0)::integer << 16)
         | (get_byte(b, 1)::integer << 8)
         | get_byte(b, 2)::integer
      into v_rand
      from (select extensions.gen_random_bytes(3) as b) s;
    exit when v_rand < 16000000;
  end loop;
  v_code := lpad((v_rand % 1000000)::text, 6, '0');

  insert into public.editor_mfa_email_codes (user_id, session_id, code_hmac, expires_at)
  values (
    _user_id,
    _session_id,
    extensions.hmac(v_code, public.editor_mfa_pepper(), 'sha256'),
    now() + interval '5 minutes'
  );

  -- Plaintext is returned exactly once, to the Edge Function, and is never
  -- persisted in any form.
  return jsonb_build_object('code', v_code, 'email', v_email, 'cooldown_seconds', 60);
end;
$$;

revoke all on function public.issue_editor_email_code_for_delivery(uuid, uuid)
  from public, anon, authenticated;
grant execute on function public.issue_editor_email_code_for_delivery(uuid, uuid)
  to service_role;

comment on function public.issue_editor_email_code_for_delivery(uuid, uuid) is
  'Issues a 6-digit email second-factor code and returns it ONCE to the caller. service_role only — the browser must never hold EXECUTE, or it could read its own code and the factor would prove nothing.';

-- ---------------------------------------------------------------------------
-- 4. Verification. Called by the signed-in editor; identity is derived
--    internally and never accepted as a parameter.
-- ---------------------------------------------------------------------------
create or replace function public.verify_editor_email_code(_code text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_sid text := auth.jwt() ->> 'session_id';
  v_row public.editor_mfa_email_codes%rowtype;
begin
  if v_uid is null or v_sid is null then
    return false;
  end if;

  select * into v_row
  from public.editor_mfa_email_codes c
  where c.user_id = v_uid
    and c.session_id::text = v_sid
    and c.consumed_at is null
  for update;

  if not found then
    return false;
  end if;

  -- Count the attempt before comparing, so an abandoned request still burns a try.
  update public.editor_mfa_email_codes c
     set attempts = c.attempts + 1
   where c.id = v_row.id;

  if v_row.attempts + 1 > 5 then
    update public.editor_mfa_email_codes c set consumed_at = now() where c.id = v_row.id;
    return false;
  end if;

  if v_row.expires_at <= now() then
    return false;
  end if;

  if v_row.code_hmac <> extensions.hmac(_code, public.editor_mfa_pepper(), 'sha256') then
    return false;
  end if;

  -- Consume on success: a code is single-use, so it cannot be replayed.
  update public.editor_mfa_email_codes c set consumed_at = now() where c.id = v_row.id;

  -- One live step-up per session.
  update public.editor_mfa_verifications v
     set revoked_at = now()
   where v.user_id = v_uid
     and v.session_id::text = v_sid
     and v.revoked_at is null;

  insert into public.editor_mfa_verifications (user_id, session_id, method, verified_at, expires_at)
  values (v_uid, v_sid::uuid, 'email', now(), now() + interval '12 hours');

  return true;
end;
$$;

revoke all on function public.verify_editor_email_code(text) from public, anon;
grant execute on function public.verify_editor_email_code(text) to authenticated;

comment on function public.verify_editor_email_code(text) is
  'Verifies an emailed second-factor code for the CURRENT Auth session and records a step-up in editor_mfa_verifications. Derives auth.uid() and session_id internally; the code is the only parameter.';
