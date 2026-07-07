## R-07 live verification plan

No code changes. Goal: produce actual console output proving the `bjorli-v2` cache never absorbs Supabase / `/admin` / signed-URL responses, while still caching public assets.

### Steps

1. **Check auth injection.** Read `LOVABLE_BROWSER_AUTH_STATUS`. Must be `injected`; otherwise stop and ask you to re-sign in.
2. **Playwright script** at `/tmp/browser/r07/verify.py`:
   - Launch Chromium headless, viewport 1280×1800.
   - Restore Supabase session: set `sb-*-auth-token` in `localStorage` at `http://localhost:8080`, plus `@supabase/ssr` cookies if present.
   - Navigate `/` and wait for the service worker to control the page (`navigator.serviceWorker.ready`, then poll until `controller` is set — trigger a reload if needed, since network-first only populates on the second load).
   - Reload `/` once more so `/`, `/index.html`, hashed `/assets/*`, and `/manifest.json` get fetched-through and cached.
   - Navigate `/admin/innsendinger`. Wait for the list to render. Click into 2–3 submissions in turn so their Supabase REST GETs + signed storage thumbnail URLs fire.
   - Sign out via the admin UI.
   - In the page context, run:
     ```js
     const names = await caches.keys();
     const c = await caches.open('bjorli-v2');
     const urls = (await c.keys()).map(r => r.url);
     const leaks = urls.filter(u =>
       /supabase\.co|\/admin|[?&](token|sig|signature|X-Amz-|Expires|se)=/i.test(u)
     );
     const publicHits = {
       root: urls.some(u => new URL(u).pathname === '/'),
       indexHtml: urls.some(u => u.endsWith('/index.html')),
       manifest: urls.some(u => u.endsWith('/manifest.json')),
       hashedAssets: urls.filter(u => /\/assets\/.+\.[a-f0-9]{6,}\./.test(u)),
     };
     return { names, urlCount: urls.length, urls, leaks, publicHits };
     ```
   - Print the full JSON to stdout, redirected to `/tmp/browser/r07/out.json`.
3. **Report to you verbatim:**
   - `caches.keys()` result.
   - Leak-filter output (must be `[]`).
   - Public-asset presence booleans + the matched hashed-asset URLs.
   - The full `urls` list so you can eyeball it.
   - Screenshots at each major step (post-login admin list, post-submission-open, post-signout) under `/tmp/browser/r07/screenshots/`.
4. **If leaks > 0** or public assets are missing: stop, show the offending URLs, and diagnose (likely `isCacheableRequest` or `isCacheableResponse` gap) — no fix applied in this pass, since you asked to pause after R-07.

### Risks / assumptions

- Assumes `LOVABLE_BROWSER_AUTH_STATUS=injected` and the signed-in user has admin role for `/admin/innsendinger`. If not, verification cannot complete and I'll say so instead of faking output.
- Service worker registration in dev: Vite may serve `sw.js` but the new v2 must be active. Script will force `registration.update()` + `skipWaiting`/`clients.claim` (already in sw.js) and confirm `caches.keys()` shows only `['bjorli-v2']` before proceeding.
- No files in the repo are modified.