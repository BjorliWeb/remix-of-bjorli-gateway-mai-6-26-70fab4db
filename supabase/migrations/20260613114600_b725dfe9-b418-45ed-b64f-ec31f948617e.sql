drop policy if exists "Anyone can submit contact form" on public.contact_messages;

create policy "Anyone can submit contact form"
on public.contact_messages
for insert
to public
with check (
  char_length(name) between 1 and 200
  and char_length(email) between 3 and 320
  and char_length(message) between 1 and 5000
);