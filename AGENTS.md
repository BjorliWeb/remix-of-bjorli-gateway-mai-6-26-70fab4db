- Webcam 6 is served from the backend (`webcam6-refresh` every 5 min via pg_cron + read-only `webcam6-image`), never the webcam.io widget — only a deterministically approved left-lens frame may be published.
- Internal links are built only via `localizeHref` (shared by React and prerender) and validated at build time — one route map prevents wrong-language URLs.
- `dist/404.html` + noindex app shells (`APP_SHELL_ROUTES`) replace the SPA fallback — unknown URLs must return HTTP 404 on Cloudflare Pages.
- Admin-approved events share one publication rule with editorial events at build time (prerender + sitemap) and request rebuilds via a backend-held deploy hook — the static site must never drift from the live event list.
- Rebuild requests are queued durably in `site_rebuild_state` (pending flag + atomic 60 s claim) — throttled or failed hook calls must never drop an editor change.
- Editorial bodies use the shared `src/lib/content/richText.ts` markup (`## ` H2, `[text](/path/)`) rendered by both React and prerender — first HTML and hydrated view must stay identical.
- Edits of event_submissions are guarded by the `event_submissions_guard_edit` trigger (protected identity/submitter/consent columns, image paths limited to own folders, English approval reset on source-text change) — the database, not the UI, must enforce what an edit may change.
- Homepage transition spacing is scoped through the home-only `homepage-spacing` wrapper; adjacent sections share a single gap budget without changing reused seasonal pages or nested card layouts.

- Homepage practical shortcuts live in Node-safe `src/lib/practicalShortcuts.ts`, shared by React and prerender — first HTML must match the hydrated hero.

- Season pass guide (`src/lib/seasonPassGuide.ts`) is shown only when locale is no, GUIDE_ENABLED is true and every step validates — content alone must never publish it.
