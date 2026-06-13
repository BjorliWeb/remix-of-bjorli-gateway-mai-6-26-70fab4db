
drop policy if exists "Anyone can submit an event" on public.event_submissions;
create policy "Anyone can submit an event"
on public.event_submissions
for insert
to public
with check (
  status = 'pending'::event_submission_status
  and editor_notes is null
  and ai_quality_notes is null
  and ai_polished_summary is null
  and ai_polished_description is null
  and ai_seo_title is null
  and ai_seo_meta is null
  and reviewed_by is null
  and reviewed_at is null
  and english_draft_title is null
  and english_draft_summary is null
  and english_draft_description is null
  and english_approved = false
  and english_approved_at is null
);
