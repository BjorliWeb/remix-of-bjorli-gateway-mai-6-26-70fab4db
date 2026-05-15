/**
 * Multilingual route registry.
 *
 * Norwegian slugs are the canonical form (matching the React Router routes
 * defined in src/App.tsx). For every other locale, this file maps the same
 * canonical route to a localized slug — so we can show user-friendly URLs
 * like /en/ski-passes, /de/skipass, /nl/skipassen, /sv/liftkort, etc.
 *
 * The routes themselves are still served by the same React components; we
 * register localized aliases in App.tsx that point to the same page.
 *
 * Why a registry (and not per-page hardcoded slugs):
 *   - Hreflang generation needs to know every translation of a path.
 *   - The language selector needs to swap /heiskort ↔ /en/ski-passes.
 *   - Future WordPress integration will populate this from translation
 *     groups (WPML / Polylang / custom field).
 *
 * NOTE: Norwegian = root (no prefix). x-default points at English per the
 *       international tourism strategy.
 */
import type { Locale } from './locales/types';

/**
 * Canonical route keys. The string is the Norwegian slug (without leading
 * slash) and matches the routes registered in src/App.tsx.
 * `home` is special: it represents `/`.
 */
export type CanonicalRoute =
  | 'home'
  | 'vinter'
  | 'sommer'
  | 'skisenter'
  | 'heiskort'
  | 'apningstider'
  | 'livecams'
  | 'overnatting'
  | 'aktiviteter'
  | 'arrangementer'
  | 'tips'
  | 'reisen-hit'
  | 'praktisk-info'
  | 'kontakt'
  | 'nyheter'
  | 'skiskole'
  | 'skiutleie'
  | 'mat-og-drikke'
  | 'langrenn'
  | 'fotturer'
  | 'sykling'
  | 'fiske'
  | 'familie'
  | 'live'
  | 'loypekart'
  | 'vaer-og-webkamera';

/**
 * Slug per locale. The Norwegian column is the canonical slug.
 * Slugs MUST be lowercase, kebab-case, ASCII-safe (no umlauts in URLs).
 *
 * ASCII slug policy (intentional, stakeholder-overridable):
 *   We currently use ASCII transliterations for German/Danish/Swedish slugs:
 *     - DE: `oeffnungszeiten` (not `öffnungszeiten`)
 *     - DA: `aabningstider`   (not `åbningstider`)
 *     - SV: `oppettider`      (not `öppettider`)
 *     - SV: `langdakning`     (not `långdåkning`)
 *     - DE: `aktivitaeten`    (not `aktivitäten`)
 *   Rationale: maximum URL portability, no encoding surprises in analytics,
 *   shareable in plain text without %-escapes, safer for older mail clients.
 *   Tradeoff: slightly less native-looking in the address bar.
 *
 *   To switch to native special characters later, edit only this file —
 *   the React Router aliases in `App.tsx` and the language switcher both
 *   read from this registry, so a one-row change propagates everywhere.
 *   Decision deferred to stakeholder before WordPress launch.
 */
export const ROUTE_SLUGS: Record<CanonicalRoute, Record<Locale, string>> = {
  home:           { no: '',                  en: '',                    de: '',                    nl: '',                    da: '',                    sv: '' },
  vinter:         { no: 'vinter',            en: 'winter',              de: 'winter',              nl: 'winter',              da: 'vinter',              sv: 'vinter' },
  sommer:         { no: 'sommer',            en: 'summer',              de: 'sommer',              nl: 'zomer',               da: 'sommer',              sv: 'sommar' },
  skisenter:      { no: 'bjorli-skisenter',  en: 'bjorli-ski-resort',   de: 'bjorli-skigebiet',    nl: 'bjorli-skigebied',    da: 'bjorli-skisenter',    sv: 'bjorli-skidcenter' },
  heiskort:       { no: 'heiskort',          en: 'ski-passes',          de: 'skipass',             nl: 'skipassen',           da: 'liftkort',            sv: 'liftkort' },
  apningstider:   { no: 'apningstider',      en: 'opening-hours',       de: 'oeffnungszeiten',     nl: 'openingstijden',      da: 'aabningstider',       sv: 'oppettider' },
  livecams:       { no: 'livecams',          en: 'livecams',            de: 'livecams',            nl: 'livecams',            da: 'livecams',            sv: 'livecams' },
  overnatting:    { no: 'overnatting',       en: 'accommodation',       de: 'unterkunft',          nl: 'accommodatie',        da: 'overnatning',         sv: 'boende' },
  aktiviteter:    { no: 'aktiviteter',       en: 'activities',          de: 'aktivitaeten',        nl: 'activiteiten',        da: 'aktiviteter',         sv: 'aktiviteter' },
  arrangementer:  { no: 'arrangementer',     en: 'events',              de: 'veranstaltungen',     nl: 'evenementen',         da: 'arrangementer',       sv: 'evenemang' },
  tips:           { no: 'tips',              en: 'tips',                de: 'tipps',               nl: 'tips',                da: 'tips',                sv: 'tips' },
  'reisen-hit':   { no: 'reisen-hit',        en: 'getting-here',        de: 'anreise',             nl: 'reizen-naar-bjorli',  da: 'rejsen-hertil',       sv: 'resa-hit' },
  'praktisk-info':{ no: 'praktisk-info',     en: 'practical-information', de: 'praktische-informationen', nl: 'praktische-informatie', da: 'praktisk-info', sv: 'praktisk-information' },
  kontakt:        { no: 'kontakt',           en: 'contact',             de: 'kontakt',             nl: 'contact',             da: 'kontakt',             sv: 'kontakt' },
  nyheter:        { no: 'nyheter',           en: 'news',                de: 'neuigkeiten',         nl: 'nieuws',              da: 'nyheder',             sv: 'nyheter' },
  skiskole:       { no: 'skiskole',          en: 'ski-school',          de: 'skischule',           nl: 'skischool',           da: 'skiskole',            sv: 'skidskola' },
  skiutleie:      { no: 'skiutleie',         en: 'ski-rental',          de: 'skiverleih',          nl: 'skiverhuur',          da: 'skiudlejning',        sv: 'skiduthyrning' },
  'mat-og-drikke':{ no: 'mat-og-drikke',     en: 'food-and-drink',      de: 'essen-und-trinken',   nl: 'eten-en-drinken',     da: 'mad-og-drikke',       sv: 'mat-och-dryck' },
  langrenn:       { no: 'langrenn',          en: 'cross-country-skiing',de: 'langlauf',            nl: 'langlaufen',          da: 'langrend',            sv: 'langdakning' },
  fotturer:       { no: 'fotturer',          en: 'hiking',              de: 'wandern',             nl: 'wandelen',            da: 'vandring',            sv: 'vandring' },
  sykling:        { no: 'sykling',           en: 'cycling',             de: 'radfahren',           nl: 'fietsen',             da: 'cykling',             sv: 'cykling' },
  fiske:          { no: 'fiske',             en: 'fishing',             de: 'angeln',              nl: 'vissen',              da: 'fiskeri',             sv: 'fiske' },
  familie:        { no: 'familie',           en: 'family',              de: 'familie',             nl: 'familie',             da: 'familie',             sv: 'familj' },
  live:           { no: 'live',              en: 'live',                de: 'live',                nl: 'live',                da: 'live',                sv: 'live' },
  loypekart:      { no: 'loypekart',         en: 'trail-map',           de: 'loipenplan',          nl: 'pistekaart',          da: 'loipekort',           sv: 'spårkarta' },
  // Combined weather + webcams page (replaces standalone "Livecams").
  // ASCII slug policy applies (see header note): `vaer-`, not `vær-`.
  // Legacy /livecams route is kept as an alias in App.tsx (no router-level
  // 301 here — when WordPress goes live, configure a true 301 from
  // /livecams* → /vaer-og-webkamera* at the hosting layer).
  'vaer-og-webkamera': {
    no: 'vaer-og-webkamera',
    en: 'weather-and-webcams',
    de: 'wetter-und-webcams',
    nl: 'weer-en-webcams',
    da: 'vejr-og-webcams',
    sv: 'vader-och-webbkameror',
  },
};

/** Reverse lookup: localized slug -> canonical key. Built once at module load. */
const SLUG_TO_CANONICAL: Record<Locale, Record<string, CanonicalRoute>> = {
  no: {}, en: {}, de: {}, nl: {}, da: {}, sv: {},
};
(Object.keys(ROUTE_SLUGS) as CanonicalRoute[]).forEach((key) => {
  const row = ROUTE_SLUGS[key];
  (Object.keys(row) as Locale[]).forEach((loc) => {
    const slug = row[loc];
    if (slug) SLUG_TO_CANONICAL[loc][slug] = key;
  });
});

/** Get the canonical (Norwegian) slug for a localized first-segment slug. */
export const canonicalForSlug = (locale: Locale, slug: string): CanonicalRoute | null => {
  if (!slug) return 'home';
  return SLUG_TO_CANONICAL[locale][slug] ?? null;
};

/** Get the localized slug for a canonical key + target locale. */
export const slugForCanonical = (canonical: CanonicalRoute, locale: Locale): string =>
  ROUTE_SLUGS[canonical][locale] ?? ROUTE_SLUGS[canonical].no;

/**
 * Translate a full pathname from one locale to another while preserving
 * deep segments (e.g. detail slugs, query-like trailing parts). The first
 * segment is treated as the localized page slug; remaining segments are
 * passed through unchanged.
 *
 * Examples:
 *   translatePath('/heiskort', 'no', 'en')          -> '/ski-passes'
 *   translatePath('/en/ski-passes', 'en', 'de')     -> '/skipass' (canonical, no prefix)
 *   translatePath('/nyheter/abc', 'no', 'de')       -> '/neuigkeiten/abc'
 *   translatePath('/', 'no', 'en')                  -> '/'
 *
 * Returned path is locale-agnostic (no /en, /de prefix). Callers should
 * apply the prefix via useLocalizedPath / LOCALE_PREFIX.
 */
export const translatePath = (pathname: string, from: Locale, to: Locale): string => {
  // Strip any locale prefix already present.
  const segs = pathname.split('/').filter(Boolean);
  const firstSegLocales: Locale[] = ['en', 'de', 'nl', 'da', 'sv'];
  if (segs[0] && (firstSegLocales as string[]).includes(segs[0])) {
    segs.shift();
  }
  if (segs.length === 0) return '/';
  const [first, ...rest] = segs;
  const canonical = canonicalForSlug(from, first);
  if (!canonical) {
    // Unknown route — fall back to home of target locale.
    return '/';
  }
  if (canonical === 'home') return '/';
  const translated = slugForCanonical(canonical, to);
  const tail = rest.length ? '/' + rest.join('/') : '';
  return '/' + translated + tail;
};

/**
 * Resolve any incoming pathname to its canonical (Norwegian) form,
 * stripping the locale prefix and translating the first segment.
 * Used by SEOHead/CMS lookups so all locales hit the same content key.
 */
export const toCanonicalPath = (pathname: string): { locale: Locale; canonical: string } => {
  const segs = pathname.split('/').filter(Boolean);
  const firstSegLocales: Locale[] = ['en', 'de', 'nl', 'da', 'sv'];
  let locale: Locale = 'no';
  if (segs[0] && (firstSegLocales as string[]).includes(segs[0])) {
    locale = segs.shift() as Locale;
  }
  if (segs.length === 0) return { locale, canonical: '/' };
  const [first, ...rest] = segs;
  const canonical = canonicalForSlug(locale, first);
  if (!canonical || canonical === 'home') return { locale, canonical: '/' };
  const tail = rest.length ? '/' + rest.join('/') : '';
  return { locale, canonical: '/' + ROUTE_SLUGS[canonical].no + tail };
};