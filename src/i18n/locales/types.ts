export type Locale = 'no' | 'en' | 'de' | 'nl' | 'da' | 'sv';

export const LOCALES: Locale[] = ['no', 'en', 'de', 'nl', 'da', 'sv'];

/**
 * Display + technical metadata for each supported locale.
 * - `htmlLang` is used for the <html lang> attribute (BCP 47 short form).
 * - `ogLocale` is the Facebook OpenGraph locale code (xx_YY) used for og:locale
 *   and og:locale:alternate. Norwegian Bokmål is `nb_NO`.
 */
export const LOCALE_LABELS: Record<
  Locale,
  { name: string; flag: string; short: string; htmlLang: string; ogLocale: string }
> = {
  no: { name: 'Norsk',      flag: '🇳🇴', short: 'NO', htmlLang: 'no', ogLocale: 'nb_NO' },
  en: { name: 'English',    flag: '🇬🇧', short: 'EN', htmlLang: 'en', ogLocale: 'en_GB' },
  de: { name: 'Deutsch',    flag: '🇩🇪', short: 'DE', htmlLang: 'de', ogLocale: 'de_DE' },
  nl: { name: 'Nederlands', flag: '🇳🇱', short: 'NL', htmlLang: 'nl', ogLocale: 'nl_NL' },
  da: { name: 'Dansk',      flag: '🇩🇰', short: 'DA', htmlLang: 'da', ogLocale: 'da_DK' },
  sv: { name: 'Svenska',    flag: '🇸🇪', short: 'SV', htmlLang: 'sv', ogLocale: 'sv_SE' },
};

/** Locale -> URL prefix. Norwegian is at the root (no prefix). */
export const LOCALE_PREFIX: Record<Locale, string> = {
  no: '',
  en: '/en',
  de: '/de',
  nl: '/nl',
  da: '/da',
  sv: '/sv',
};

export interface Dictionary {
  meta: {
    siteName: string;
    tagline: string;
    winterTagline: string;
  };
  nav: {
    winter: string;
    summer: string;
    skiCenter: string;
    accommodation: string;
    activities: string;
    whatsOn: string;
    tips: string;
    gettingHere: string;
    practicalInfo: string;
    /** Combined weather + webcams page (replaces standalone "Livecams"). */
    weatherWebcams: string;
    buyLiftPass: string;
    findStay: string;
    seeActivities: string;
    menu: string;
    close: string;
    language: string;
  };
  hero: {
    title: string;
    subtitle: string;
    intro: string;
    ctaSkiCenter: string;
    ctaLiftPass: string;
    ctaStay: string;
    /** Optional uppercase eyebrow above the hero headline. */
    eyebrow?: string;
    /** Optional secondary CTA label, e.g. "Se åpningstider og føre". */
    ctaOpening?: string;
  };
  status: {
    liftsOpen: string;
    slopes: string;
    snowDepth: string;
    temperature: string;
    openToday: string;
    livecams: string;
    seeMore: string;
    /** Optional section heading shown above the live status cards. */
    heading?: string;
    /** Optional helper line shown below the live status cards. */
    caption?: string;
  };
  alert: {
    label: string;
    sample: string;
    sampleCta: string;
  };
  intro: {
    title: string;
    body: string;
  };
  planning: {
    title: string;
    subtitle: string;
    items: { title: string; desc: string }[];
  };
  skiCenter: {
    eyebrow: string;
    title: string;
    body: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  accommodation: {
    eyebrow: string;
    title: string;
    body: string;
    cta: string;
    /** Optional secondary CTA label. */
    ctaSecondary?: string;
    /** Optional small sub-cards rendered under the accommodation feature. */
    subcards?: { title: string; desc?: string }[];
  };
  tips: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cta: string;
    items: { category: string; title: string; intro: string }[];
  };
  events: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cta: string;
    items: { category: string; date: string; title: string; intro: string }[];
  };
  beyondAlpine: {
    eyebrow: string;
    title: string;
    body: string;
    items: { title: string; desc: string }[];
  };
  gettingHere: {
    eyebrow: string;
    title: string;
    body: string;
    cta: string;
    seeMap: string;
    cities: { city: string; km: string }[];
    enturNote: string;
    /**
     * International flight access positioning. Optional — only DA / NL / EN
     * are populated today. Renders on the Getting Here page. Use careful
     * language ("in relevant periods", "check current airline schedules").
     */
    flightAccess?: {
      eyebrow: string;
      title: string;
      body: string;
      note: string;
    };
  };
  summerTeaser: {
    eyebrow: string;
    title: string;
    body: string;
    cta: string;
  };
  news: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cta: string;
    items: { category: string; date: string; title: string; intro: string }[];
  };
  faq: {
    eyebrow: string;
    title: string;
    items: { q: string; a: string }[];
  };
  footer: {
    aboutTitle: string;
    aboutBody: string;
    winterTitle: string;
    summerTitle: string;
    planTitle: string;
    contactTitle: string;
    address: string;
    rights: string;
    company: string;
    privacy: string;
    cookies: string;
    winterLinks: { label: string; href: string }[];
    summerLinks: { label: string; href: string }[];
    planLinks: { label: string; href: string }[];
  };
  common: {
    readMore: string;
    seeAll: string;
    learnMore: string;
  };
  listing: {
    backHome: string;
    breadcrumbHome: string;
    notFound: string;
    relatedTitle: string;
    publishedOn: string;
    pageTipsTitle: string;
    pageTipsIntro: string;
    pageEventsTitle: string;
    pageEventsIntro: string;
    pageNewsTitle: string;
    pageNewsIntro: string;
    pageActivitiesTitle: string;
    pageActivitiesIntro: string;
    pageGettingHereTitle: string;
    pageGettingHereIntro: string;
    /* Optional UI for the listing/detail templates. Falls back to NO/EN. */
    filterAll?: string;
    filterCategory?: string;
    filterSeason?: string;
    filterDate?: string;
    filterReset?: string;
    seasonWinter?: string;
    seasonSummer?: string;
    seasonAllYear?: string;
    viewCalendar?: string;
    viewList?: string;
    loadMore?: string;
    featured?: string;
    seoPlaceholderTitle?: string;
    seoPlaceholderBody?: string;
    sectionWinter?: string;
    sectionSummer?: string;
    sectionFamily?: string;
  };
  summer: {
    badge: string;
    title: string;
    subtitle: string;
    intro: string;
    ctaExplore: string;
    ctaActivities: string;
    ctaStay: string;
    /** Optional secondary plan-trip CTA. */
    ctaPlan?: string;
    /** Optional uppercase eyebrow for the summer hero. */
    eyebrow?: string;
    activitiesTitle: string;
    activitiesSubtitle: string;
    activities: { title: string; desc: string }[];
    winterTeaserTitle: string;
    winterTeaserBody: string;
    winterTeaserCta: string;
    /** Optional "Bjorli as basecamp" content block (summer page). */
    basecamp?: {
      eyebrow: string;
      title: string;
      body: string;
      items: { title: string; desc: string }[];
      ctaActivities: string;
      ctaPlan: string;
    };
  };
  /** Optional "Why Bjorli?" benefit section, used on both winter and summer. */
  whyBjorli?: {
    eyebrow: string;
    title: string;
    items: { title: string; desc: string; icon?: string }[];
  };
}