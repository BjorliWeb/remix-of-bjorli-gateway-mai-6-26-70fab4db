# CLAUDE.md

## Project

You are working on the Bjorli.no repository.

Repository:
https://github.com/BjorliWeb/remix-of-bjorli-gateway-mai-6-26-70fab4db

Bjorli.no is a year-round destination website for Bjorli, Norway. It supports Bjorli Skisenter and the wider destination: skiing, summer activities, hiking, cycling, fishing, weather/webcam, accommodation, food, shopping, events, local partners, and future ticket/booking flows.

The current stack is:
- React
- Vite
- React Router
- Tailwind
- shadcn-style components
- Supabase for selected backend/admin functionality
- GA4
- Cloudflare Pages

The site is currently built from a Lovable-generated codebase, so changes should be small, safe, and easy to review.

---

## Security rules

You are only allowed to work inside this repository.

Do not inspect, read, search, modify, or summarize anything outside the current repo folder.

Do not access:
- parent directories
- home directory
- Desktop
- Documents
- Downloads
- iCloud
- Dropbox
- OneDrive
- Google Drive
- browser profiles
- SSH keys
- keychains
- credentials
- cookies
- tokens
- environment variables
- private files from other projects
- work-related files from Cisco or any other employer

Do not print secrets.

Do not print `.env` contents.

Do not modify:
- Supabase RLS
- Supabase functions
- authentication logic
- Cloudflare settings
- DNS
- GitHub settings
- repo permissions
- GitHub Actions secrets
- environment variables
- service worker
- redirects
- analytics
unless the user explicitly asks for that exact area.

Do not run destructive commands.

Do not delete files unless the user explicitly approves the exact file path.

Do not install dependencies unless the user explicitly approves it.

Do not use `bypassPermissions`.

Do not merge to `main`.

Do not force push.

Work through branch and pull request only.

Before committing, always show:
- `git status`
- `git diff --stat`
- `git diff --name-only`

---

## Git workflow

Always use this workflow for implementation tasks:

1. Confirm current repo path.
2. Confirm current branch.
3. Confirm git remote.
4. Pull latest `main`.
5. Create a new branch from `main`.
6. Make the smallest safe changes.
7. Run relevant checks.
8. Show `git status`.
9. Show `git diff --stat`.
10. Show `git diff --name-only`.
11. Ask before committing if the diff touches anything unexpected.
12. Commit only approved changes.
13. Push the branch.
14. Create a pull request if possible.
15. Never merge the pull request.

Branch names should be specific, for example:

```text
fix/pr1-og-images-social-metadata
fix/pr2-prerender-seo-links
fix/legacy-redirect-map
fix/ga4-event-cleanup
```

---

## Product direction

Bjorli.no should feel like a modern year-round destination website, not only a winter ski resort website.

The site should make Bjorli feel:
- active
- local
- useful
- trustworthy
- premium
- easy to understand
- relevant in both summer and winter

Important content areas:
- Bjorli Skisenter
- summer activities
- winter skiing
- hiking
- cycling
- fishing
- accommodation
- food and drink
- shopping
- weather and webcam
- events / what’s happening
- practical information
- partner links

The homepage should help visitors quickly decide what to do next.

Weather/webcam pages should guide visitors toward useful next actions such as activities, accommodation, ski passes, conditions, and events.

---

## Writing and localization rules

Norwegian is the primary language.

Changes that affect public content should be considered across all relevant language versions.

Use this localization instruction when rewriting translated content:

> Rewrite the content to sound genuinely human. Remove robotic phrasing, overly polished language, and predictable AI patterns. Add natural sentence variation, conversational flow, and subtle personality while preserving the original message.

Copy should be:
- concrete
- local
- human
- useful
- search-friendly
- AI/LLM-friendly

Avoid:
- generic destination copy
- robotic phrasing
- empty adjectives
- over-polished AI language
- vague claims
- making Bjorli sound boring
- overusing the Norwegian word “rolig”

Prefer specific place-based wording:
- Romsdalen
- Dovrefjell
- Reinheimen
- E136
- Raumabanen
- Lesjaskogsvatnet
- ski resort
- webcam
- weather
- hiking
- cycling
- fishing
- cabin / accommodation
- family activities

---

## SEO and AI/LLM rules

Keep the site friendly for:
- Google
- social sharing previews
- AI/LLM crawlers
- visitors without JavaScript
- screen readers
- mobile users

Important files and areas to inspect before SEO changes:
- `src/lib/seo/routeSeo.ts`
- `scripts/prerender.ts`
- `scripts/build-sitemap.ts`
- `public/_redirects`
- `public/robots.txt`
- `public/llms.txt`
- `public/llms-full.txt`
- `index.html`
- `src/i18n/routes.ts`

Do not break:
- canonical tags
- hreflang
- localized routes
- sitemap generation
- prerender coverage
- Cloudflare preview noindex behavior

Crawler-visible HTML matters. Important metadata and page summaries should be available in prerendered HTML, not only client-side React.

---

## Analytics rules

GA4 is installed.

Do not change analytics unless the task is explicitly about analytics.

Preferred event style:
- lowercase
- snake_case
- one event per real action
- no duplicate event names for the same action

Known event cleanup principle:
- Use `language_change`
- Do not reintroduce `change_language`

Useful event parameters where relevant:
- `page_path`
- `page_title`
- `language`
- `from_language`
- `to_language`
- `link_url`
- `link_text`
- `partner_name`
- `destination_section`
- `cta_location`

Do not send personal data to GA4.

Do not break consent handling.

---

## Supabase and backend safety

Supabase is used for selected backend/admin functionality.

Do not modify Supabase, RLS, auth, edge functions, storage, or admin gating unless the user explicitly asks.

Never expose:
- service role keys
- database passwords
- JWT secrets
- API secrets
- private environment variables

If a task touches Supabase security, stop and explain the risk before editing.

---

## Current known priorities

Work should generally follow this order unless the user says otherwise:

1. Social metadata and `og:image` / `twitter:image`
2. Richer prerendered HTML for SEO and AI/LLM visibility
3. Expanded crawlable navigation and internal links
4. Unique lead text separate from title and meta description
5. Copy pass to reduce “rolig” and generic language
6. Legacy redirect map
7. `llms.txt` cleanup
8. GA4 event cleanup
9. Service worker decision
10. Broader UX and content improvements

Do not jump to later items while working on an earlier approved PR.

---

## Implementation style

Keep changes small.

Avoid broad refactors.

Preserve existing design language.

Preserve existing routing.

Preserve existing localization structure.

Preserve existing analytics unless explicitly changing analytics.

Preserve existing Supabase/security behavior.

Do not add dependencies unless the user explicitly approves.

Do not invent filenames, routes, images, partner names, or business facts.

If a file or asset does not exist, say so.

If there is uncertainty, state it clearly.

---

## Before editing

For every implementation task, first provide:

1. Files you plan to inspect.
2. Files you expect to change.
3. The smallest safe implementation plan.
4. Risks or assumptions.
5. Confirmation that the work stays inside the approved scope.

Then wait for approval if the change is non-trivial.

---

## After editing

Always provide:

1. Files changed.
2. What changed in each file.
3. What checks were run.
4. Result of the checks.
5. `git status`
6. `git diff --stat`
7. Manual test checklist.
8. Any assumptions or remaining risks.

For public website changes, include what to test in:
- Cloudflare Preview
- View Source
- browser desktop
- browser mobile
- relevant social preview tools
- GA4 DebugView if analytics changed

---

## Pull request rules

PRs should be small and focused.

Each PR should have:
- clear title
- short summary
- changed files
- test checklist
- risk notes
- rollback note if relevant

Do not combine unrelated areas in one PR.

Examples:
- PR-1: social metadata and OG images
- PR-2: prerender leads, nav, internal links
- PR-3: redirects and llms.txt
- PR-4: service worker decision
- PR-5: GA4 cleanup

---

## First response when starting a session

When starting a new Claude Code session in this repo, first respond with:

1. Current repo path
2. Current git branch
3. Current git remote
4. Whether there are uncommitted changes
5. Confirmation that you will not inspect anything outside this repo
6. Ask for the task

Do not begin editing before the task is given.
