// Bjorli service worker
// R-07 hardening: strict cache scope. Only same-origin public GET responses are cached.
// Never cache: cross-origin (incl. Supabase), /admin routes, any URL carrying signed-URL
// parameters (token, sig, signature, X-Amz-*, Expires, se), authenticated requests
// (Authorization header), non-basic/opaque responses, or responses marked private/no-store.
const CACHE_NAME = 'bjorli-v2';
const PRECACHE_URLS = ['/', '/index.html', '/manifest.json'];

// Query-parameter denylist: presence of ANY of these keys marks the URL as
// authenticated/signed and disqualifies it from the cache. Case-insensitive.
const SIGNED_PARAM_RE = /(^|[?&])(token|sig|signature|expires|se|x-amz-[a-z0-9-]+)=/i;

function isCacheableRequest(request) {
  if (request.method !== 'GET') return false;
  // Only same-origin. Blocks *.supabase.co, storage, edge functions, third parties.
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return false;
  // Admin surface is never cached. Substring, case-insensitive: also excludes
  // dev-server module URLs like /src/pages/AdminLogin.tsx.
  if (/\/admin/i.test(url.pathname)) return false;
  // Signed / tokenized URLs are never cached.
  if (SIGNED_PARAM_RE.test(url.search)) return false;
  // Requests carrying credentials must not be cached.
  if (request.headers.get('authorization')) return false;
  return true;
}

function isCacheableResponse(response) {
  if (!response) return false;
  // Opaque / error / redirect responses: skip.
  if (response.type !== 'basic') return false;
  if (!response.ok) return false;
  const cc = (response.headers.get('cache-control') || '').toLowerCase();
  if (cc.includes('private') || cc.includes('no-store')) return false;
  const vary = (response.headers.get('vary') || '').toLowerCase();
  if (vary.includes('authorization') || vary.includes('cookie')) return false;
  return true;
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  if (!isCacheableRequest(request)) {
    // Pass-through: never touch the cache for this request, in either direction.
    event.respondWith(fetch(request));
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (isCacheableResponse(response)) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
