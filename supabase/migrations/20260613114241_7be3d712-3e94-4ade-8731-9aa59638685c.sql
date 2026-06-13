
alter table public.event_submissions
  add column if not exists upload_token uuid not null default gen_random_uuid();

create index if not exists event_submissions_upload_token_idx
  on public.event_submissions (upload_token);

drop policy if exists "Public can upload to event-submissions uploads folder" on storage.objects;

create policy "Public can upload to linked event submission folder"
on storage.objects
for insert
to public
with check (
  bucket_id = 'event-submissions'
  and (storage.foldername(name))[1] = 'uploads'
  and exists (
    select 1
    from public.event_submissions s
    where s.upload_token::text = (storage.foldername(name))[2]
      and s.created_at > now() - interval '1 hour'
  )
);
