create table public.site_rebuild_state (
  id boolean primary key default true check (id),
  pending boolean not null default false,
  requested_at timestamptz,
  last_triggered_at timestamptz,
  last_status text,
  last_error text,
  failed_attempts integer not null default 0,
  updated_at timestamptz not null default now()
);
grant all on public.site_rebuild_state to service_role;
alter table public.site_rebuild_state enable row level security;
insert into public.site_rebuild_state (id) values (true);