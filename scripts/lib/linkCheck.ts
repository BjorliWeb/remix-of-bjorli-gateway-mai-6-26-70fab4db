/**
 * Pure helpers for the post-prerender internal-link check and for the
 * app-shell / 404 handling. No filesystem access here so Vitest can cover
 * them directly; scripts/prerender.ts wires them to dist/.
 */
import { normalizeInternalPath, CANONICAL_ORIGIN } from '../../src/lib/url/normalizeInternalPath';

/**
 * Application routes that must stay directly reachable even though they
 * are not prerendered or listed in the sitemap (editor login, password
 * reset, MFA, admin, public submit forms, internal review pages). Each
 * gets a noindex app-shell index.html so Cloudflare Pages serves it with
 * HTTP 200 while every other unknown URL falls through to 404.html.
 * Keep in sync with the non-public <Route>s in src/App.tsx.
 */
export const APP_SHELL_ROUTES: readonly string[] = [
  '/admin/login/',
  '/admin/reset-password/',
  '/admin/mfa/',
  '/admin/innsendinger/',
  '/meld-inn-arrangement/',
  '/en/submit-event/',
  '/image-inventory/',
  '/hero-compare/',
];

/** Parse public/_redirects into exact sources + wildcard prefixes. */
export const parseRedirectSources = (text: string): { exact: Set<string>; prefixes: string[] } => {
  const exact = new Set<string>();
  const prefixes: string[] = [];
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const [src] = line.split(/\s+/);
    if (!src?.startsWith('/')) continue;
    if (src.endsWith('/*')) prefixes.push(src.slice(0, -1));
    else exact.add(safeDecode(src));
  }
  return { exact, prefixes };
};

export const safeDecode = (s: string): string => {
  try { return decodeURIComponent(s); } catch { return s; }
};

export type LinkKind = 'internal' | 'external' | 'other';

/** Classify an href and, for internal links, return the decoded pathname. */
export const classifyHref = (href: string): { kind: LinkKind; path?: string; raw: string } => {
  const h = href.trim();
  if (!h || h.startsWith('#')) return { kind: 'other', raw: h };
  if (/^(mailto|tel|sms|javascript|data):/i.test(h)) return { kind: 'other', raw: h };
  let pathPart: string | null = null;
  if (h.startsWith('/') && !h.startsWith('//')) pathPart = h;
  else {
    const m = /^https?:\/\/([^/?#]+)([^]*)$/i.exec(h.startsWith('//') ? 'https:' + h : h);
    if (!m) return { kind: 'other', raw: h };
    const host = m[1].toLowerCase();
    const canonicalHost = new URL(CANONICAL_ORIGIN).host;
    if (host !== canonicalHost && host !== 'www.' + canonicalHost) return { kind: 'external', raw: h };
    pathPart = m[2] || '/';
  }
  const pathname = (pathPart.split(/[?#]/)[0] || '/');
  return { kind: 'internal', path: safeDecode(pathname), raw: h };
};

export interface LinkProblem { page: string; href: string; reason: string }

/**
 * Validate internal links. `exists(path)` must report whether a decoded
 * pathname resolves to a generated page, static file or app-shell route.
 */
export const findLinkProblems = (
  pages: { page: string; html: string }[],
  exists: (decodedPath: string) => boolean,
  redirects: { exact: Set<string>; prefixes: string[] },
): LinkProblem[] => {
  const problems: LinkProblem[] = [];
  const re = /<(?:a|link)\b[^>]*?\shref="([^"]*)"/gi;
  for (const { page, html } of pages) {
    for (const m of html.matchAll(re)) {
      const href = m[1].replace(/&amp;/g, '&');
      const c = classifyHref(href);
      if (c.kind !== 'internal' || !c.path) continue;
      const p = c.path;
      if (redirects.exact.has(p) || redirects.prefixes.some((x) => p.startsWith(x))) {
        problems.push({ page, href, reason: 'points to a redirect source, not the canonical target' });
        continue;
      }
      if (normalizeInternalPath(p) !== p) {
        problems.push({ page, href, reason: 'missing trailing slash (non-canonical form)' });
        continue;
      }
      if (!exists(p)) problems.push({ page, href, reason: 'no generated page, static file or app route' });
    }
  }
  return problems;
};

/** Small, self-contained 404 document (noindex) with useful links. */
export const notFoundHtml = (opts: { scripts: string; preloads: string; links: { label: string; href: string }[] }): string => `<!doctype html>
<html lang="nb">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Siden finnes ikke | Bjorli</title>
    <meta name="robots" content="noindex, follow" />
    <meta name="description" content="Siden du leter etter finnes ikke på bjorli.no." />
    ${opts.preloads}
  </head>
  <body>
    <div id="root"><main data-prerender="404" style="min-height:100vh;padding:3rem 1.25rem;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#0a2540;background:#f7f6f2">
      <h1 style="font-size:2rem;margin:0 0 0.5rem">Siden finnes ikke</h1>
      <p style="margin:0 0 0.25rem" lang="en">Page not found · Seite nicht gefunden · Pagina niet gevonden · Siden blev ikke fundet · Sidan hittades inte</p>
      <p style="margin:1rem 0">Prøv en av disse sidene:</p>
      <ul style="line-height:1.8;padding-left:1.25rem">
        ${opts.links.map((l) => `<li><a href="${l.href}">${l.label}</a></li>`).join('\n        ')}
      </ul>
    </main></div>
    ${opts.scripts}
  </body>
</html>
`;

/** Noindex shell for app-only routes (editor login etc.). */
export const appShellHtml = (opts: { scripts: string; preloads: string }): string => `<!doctype html>
<html lang="nb">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bjorli</title>
    <meta name="robots" content="noindex, nofollow" />
    ${opts.preloads}
  </head>
  <body>
    <div id="root"></div>
    ${opts.scripts}
  </body>
</html>
`;
