import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense, type ComponentType } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { LanguageProvider } from "@/i18n/LanguageContext";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
// After a new deploy, a tab still running the previous bundle asks for page
// chunks whose hashed names no longer exist. Reload once to pick up the new
// build instead of showing a blank page; a second failure is surfaced.
const RELOAD_FLAG = 'bjorli:chunk-reload';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lazyPage = <T extends ComponentType<any>>(load: () => Promise<{ default: T }>) =>
  lazy(() =>
    load()
      .then((mod) => {
        try { sessionStorage.removeItem(RELOAD_FLAG); } catch { /* storage blocked */ }
        return mod;
      })
      .catch((err) => {
        let alreadyReloaded = true;
        try {
          alreadyReloaded = sessionStorage.getItem(RELOAD_FLAG) === '1';
          if (!alreadyReloaded) sessionStorage.setItem(RELOAD_FLAG, '1');
        } catch { /* storage blocked: don't risk a reload loop */ }
        if (!alreadyReloaded) {
          window.location.reload();
          return new Promise<{ default: T }>(() => {});
        }
        throw err;
      }),
  );

// Route-level code splitting: the homepages (winter Index, summer Sommer)
// stay in the main bundle so "/" paints without an extra round trip. Every
// other page — including admin, the event form and the chart-heavy pages —
// loads as its own chunk only when a visitor opens it.
const SkiCenter = lazyPage(() => import("./pages/SkiCenter"));
const Accommodation = lazyPage(() => import("./pages/Accommodation"));
const OpeningHours = lazyPage(() => import("./pages/OpeningHours"));
const SkiSchool = lazyPage(() => import("./pages/SkiSchool"));
const SkiRental = lazyPage(() => import("./pages/SkiRental"));
const FoodDrink = lazyPage(() => import("./pages/FoodDrink"));
const Handel = lazyPage(() => import("./pages/Handel"));
// PracticalInfo page is intentionally not imported — the /praktisk-info
// route is unpublished. The component file is kept for possible future
// reuse.
const Parkering = lazyPage(() => import("./pages/Parkering"));
const Contact = lazyPage(() => import("./pages/Contact"));
const Personvern = lazyPage(() => import("./pages/Personvern"));
const Salgsbetingelser = lazyPage(() => import("./pages/Salgsbetingelser"));
import SEOHead from "./components/SEOHead";
import LegacyLivecamsRedirect from "./components/LegacyLivecamsRedirect";
const NotFound = lazyPage(() => import("./pages/NotFound"));
const Tips = lazyPage(() => import("./pages/Tips"));
const Events = lazyPage(() => import("./pages/Events"));
const EventsArchive = lazyPage(() => import("./pages/EventsArchive"));
const News = lazyPage(() => import("./pages/News"));
const Activities = lazyPage(() => import("./pages/Activities"));
const GettingHere = lazyPage(() => import("./pages/GettingHere"));
import Sommer from "./pages/Sommer";
const ContentDetailPage = lazyPage(() => import("./pages/ContentDetailPage"));
const Heiskort = lazyPage(() => import("./pages/Heiskort"));
const Langrenn = lazyPage(() => import("./pages/Langrenn"));
const Fotturer = lazyPage(() => import("./pages/Fotturer"));
const Sykling = lazyPage(() => import("./pages/Sykling"));
const KorteTurer = lazyPage(() => import("./pages/KorteTurer"));
const KlatringRomsdalen = lazyPage(() => import("./pages/KlatringRomsdalen"));
const Tafjordfjella = lazyPage(() => import("./pages/Tafjordfjella"));
const Familie = lazyPage(() => import("./pages/Familie"));
const Fiske = lazyPage(() => import("./pages/Fiske"));
const Gardsbesok = lazyPage(() => import("./pages/Gardsbesok"));
const GoldenTrain = lazyPage(() => import("./pages/GoldenTrain"));
const Romsdalsgondolen = lazyPage(() => import("./pages/Romsdalsgondolen"));
const Sagelva = lazyPage(() => import("./pages/Sagelva"));
const Vinter = lazyPage(() => import("./pages/Vinter"));
const Live = lazyPage(() => import("./pages/Live"));
const Loypekart = lazyPage(() => import("./pages/Loypekart"));
const WeatherWebcams = lazyPage(() => import("./pages/WeatherWebcams"));
const SkiHolidayNorway = lazyPage(() => import("./pages/SkiHolidayNorway"));
const ImageInventory = lazyPage(() => import("./pages/ImageInventory"));
const HeroCompare = lazyPage(() => import("./pages/HeroCompare"));
const SubmitEvent = lazyPage(() => import("./pages/SubmitEvent"));
const AdminLogin = lazyPage(() => import("./pages/AdminLogin"));
const AdminResetPassword = lazyPage(() => import("./pages/AdminResetPassword"));
const AdminEventSubmissions = lazyPage(() => import("./pages/AdminEventSubmissions"));
const AdminMfa = lazyPage(() => import("./pages/AdminMfa"));
import { ROUTE_SLUGS, type CanonicalRoute } from "@/i18n/routes";
import { LOCALES } from "@/i18n/translations";
import { SKI_HOLIDAY_LOCALES, SKI_HOLIDAY_PAGES } from "@/lib/seo/skiHolidayNorwaySeo";
import { eventsArchiveRoutePath } from "@/lib/events/archive";
import { DEFAULT_SEASON } from "@/lib/season";
import ContentPlaceholder from "@/components/ContentPlaceholder";

const queryClient = new QueryClient();

const LOCALIZED_PATHS = ["/en", "/de", "/nl", "/da", "/sv"];

/**
 * Build the set of localized aliases for a given canonical route.
 * The same React component is rendered for every translated slug so deep
 * links like /en/ski-passes, /de/skipass, /nl/skipassen etc. all resolve.
 * Norwegian (no) is the canonical and is already registered explicitly
 * in <AppRoutes> below — we skip it here to avoid duplicate routes.
 */
const localizedAliases = (canonical: CanonicalRoute): string[] => {
  const seen = new Set<string>();
  const out: string[] = [];
  LOCALES.forEach((loc) => {
    if (loc === 'no') return;
    const slug = ROUTE_SLUGS[canonical][loc];
    if (!slug) return;
    if (seen.has(slug)) return;
    seen.add(slug);
    out.push('/' + slug);
  });
  return out;
};

const aliasRoute = (canonical: CanonicalRoute, element: JSX.Element) =>
  localizedAliases(canonical).map((p) => (
    <Route key={`${canonical}-${p}`} path={p} element={element} />
  ));

// Root "/" renders the season-default homepage. Flip DEFAULT_SEASON in
// src/lib/season.ts to swap which component is mounted at "/".
const HomeRoute = DEFAULT_SEASON === 'summer' ? <Sommer /> : <Index />;

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={HomeRoute} />
    <Route path="/sommer" element={<Sommer />} />
    <Route path="/skisenter" element={<SkiCenter />} />
    <Route path="/bjorli-skisenter" element={<SkiCenter />} />
    <Route path="/overnatting" element={<Accommodation />} />
    <Route path="/apningstider" element={<OpeningHours />} />
    {/* New combined "Vær og webkamera" page (canonical NO route).
        /livecams is kept as a legacy alias rendering the same component
        until a true 301 can be configured at the hosting layer. */}
    <Route path="/vaer-og-webkamera" element={<WeatherWebcams />} />
    {/* Legacy /livecams URL — client-side 301-equivalent redirect to the
        canonical page. Production hosting also serves a real 301 via
        public/_redirects so direct hits never render the SPA shell
        (and therefore never reach JS — see LegacyLivecamsRedirect for the
        GA4 tracking caveat). */}
    <Route path="/livecams" element={<LegacyLivecamsRedirect />} />
    <Route path="/skiskole" element={<SkiSchool />} />
    <Route path="/skiutleie" element={<SkiRental />} />
    <Route path="/mat-og-drikke" element={<FoodDrink />} />
    <Route path="/handel" element={<Handel />} />
    {/* /praktisk-info is unpublished — route falls through to NotFound.
        Page component is intentionally kept in the codebase for possible
        future reuse, but is no longer linked from navigation, footer,
        sitemap or llms feeds. */}
    <Route path="/parkering" element={<Parkering />} />
    {/* Legacy alias for the previous English URL. */}
    <Route path="/parking" element={<Parkering />} />
    {/* Norwegian privacy policy + English alias (same component). */}
    <Route path="/personvern" element={<Personvern />} />
    <Route path="/privacy" element={<Personvern />} />
    {/* Sales terms — separate legal page (shared slug in every locale). */}
    <Route path="/salgsbetingelser" element={<Salgsbetingelser />} />
    <Route path="/reisen-hit" element={<GettingHere />} />
    <Route path="/tips" element={<Tips />} />
    <Route path="/tips/:slug" element={<ContentDetailPage kind="tips" />} />
    <Route path="/arrangementer" element={<Events />} />
    {/* Legacy/empty page removed — 301 to /sommer (CF _redirects handles direct hits;
        this Navigate covers client-side navigation). Must be declared before the
        generic :slug route so it wins the match. */}
    <Route path="/arrangementer/sommeraktiviteter" element={<Navigate to="/sommer/" replace />} />
    {/* Event archive — must be declared before the generic :slug route. */}
    {LOCALES.map((loc) => (
      <Route
        key={`events-archive-${loc}`}
        path={eventsArchiveRoutePath(loc)}
        element={<EventsArchive />}
      />
    ))}
    <Route path="/arrangementer/:slug" element={<ContentDetailPage kind="events" />} />
    <Route path="/nyheter" element={<News />} />
    <Route path="/nyheter/:slug" element={<ContentDetailPage kind="news" />} />
    <Route path="/aktiviteter" element={<Activities />} />
    <Route path="/aktiviteter/:slug" element={<ContentDetailPage kind="activities" />} />
    <Route path="/kontakt" element={<Contact />} />
    <Route path="/heiskort" element={<Heiskort />} />
    <Route path="/langrenn" element={<Langrenn />} />
    <Route path="/fotturer" element={<Fotturer />} />
    <Route path="/sykling" element={<Sykling />} />
    <Route path="/familie" element={<Familie />} />
    <Route path="/fiske" element={<Fiske />} />
    <Route path="/gardsbesok" element={<Gardsbesok />} />
    <Route path="/golden-train" element={<GoldenTrain />} />
    <Route path="/romsdalsgondolen" element={<Romsdalsgondolen />} />
    <Route path="/sagelva" element={<Sagelva />} />
    <Route path="/sommer/korte-turer" element={<KorteTurer />} />
    <Route path="/sommer/klatring-og-buldring-romsdalen" element={<KlatringRomsdalen />} />
    <Route path="/sommer/tafjordfjella" element={<Tafjordfjella />} />
    {/* Localized aliases for the nested /sommer/korte-turer page.
        We only need to register variants where the parent slug differs
        from the Norwegian "sommer" — de/da reuse "sommer" so the
        canonical route above already handles them. The child slug
        ("korte-turer") is intentionally kept as a legacy alias for
        every locale until proper translated child slugs are added. */}
    {Array.from(new Set(
      LOCALES.filter((l) => l !== 'no').map((l) => ROUTE_SLUGS.sommer[l])
    ))
      .filter((s) => s && s !== 'sommer')
      .map((s) => (
        <Route key={`korte-${s}`} path={`/${s}/korte-turer`} element={<KorteTurer />} />
      ))}
    {Array.from(new Set(
      LOCALES.filter((l) => l !== 'no').map((l) => ROUTE_SLUGS.sommer[l])
    ))
      .filter((s) => s && s !== 'sommer')
      .map((s) => (
        <Route
          key={`klatring-${s}`}
          path={`/${s}/klatring-og-buldring-romsdalen`}
          element={<KlatringRomsdalen />}
        />
      ))}
    {/* Localized aliases for /sommer/tafjordfjella. Same component;
        only the parent /sommer slug is translated. Child slug
        "tafjordfjella" stays as-is (proper noun). */}
    {Array.from(new Set(
      LOCALES.filter((l) => l !== 'no').map((l) => ROUTE_SLUGS.sommer[l])
    ))
      .filter((s) => s && s !== 'sommer')
      .map((s) => (
        <Route
          key={`tafjordfjella-${s}`}
          path={`/${s}/tafjordfjella`}
          element={<Tafjordfjella />}
        />
      ))}
    <Route path="/vinter" element={<Vinter />} />
    <Route path="/live" element={<Live />} />
    <Route path="/loypekart" element={<Loypekart />} />
    {/* Ski-holiday landing for visitors from abroad: EN/DE/SV/DA/NL, each
        with its own slug (src/lib/seo/skiHolidayNorwaySeo.ts). No NO version. */}
    {SKI_HOLIDAY_LOCALES.map((l) => (
      <Route key={`ski-holiday-${l}`} path={`/${SKI_HOLIDAY_PAGES[l].slug}`} element={<SkiHolidayNorway />} />
    ))}
    {/* Internal review-only page. Not linked from navigation, not in sitemap. */}
    <Route path="/image-inventory" element={<ImageInventory />} />
    {/* Internal hero image comparison. Not linked, not in sitemap, not in SEO. */}
    <Route path="/hero-compare" element={<HeroCompare />} />
    {/* Public submit-event flow — v1 scope: Norwegian + English only.
        Do NOT register DE/NL/DA/SV submit routes for v1.
        Both routes write into the same event_submissions table; the
        `language` column records the source locale for editors. */}
    <Route path="/meld-inn-arrangement" element={<SubmitEvent lang="no" />} />
    {/* /en/* is mounted under the localized outer Route, which strips the
        /en prefix — so this inner path must be the bare "/submit-event". */}
    <Route path="/submit-event" element={<SubmitEvent lang="en" />} />
    {/* Editor admin (protected inside the component) */}
    <Route path="/admin/login" element={<AdminLogin />} />
    {/* Password recovery landing — no editor authorization, no editor content */}
    <Route path="/admin/reset-password" element={<AdminResetPassword />} />
    {/* Two-step verification — reached only after a password sign-in */}
    <Route path="/admin/mfa" element={<AdminMfa />} />
    <Route path="/admin/innsendinger" element={<AdminEventSubmissions />} />
    {/* Localized aliases — same components, translated slugs. */}
    {aliasRoute('sommer', <Sommer />)}
    {aliasRoute('skisenter', <SkiCenter />)}
    {aliasRoute('overnatting', <Accommodation />)}
    {aliasRoute('apningstider', <OpeningHours />)}
    {aliasRoute('skiskole', <SkiSchool />)}
    {aliasRoute('skiutleie', <SkiRental />)}
    {aliasRoute('mat-og-drikke', <FoodDrink />)}
    {/* Localized /praktisk-info aliases unpublished — see comment above. */}
    {aliasRoute('reisen-hit', <GettingHere />)}
    {aliasRoute('vaer-og-webkamera', <WeatherWebcams />)}
    {/* Localized /livecams aliases also redirect to the canonical page. */}
    {aliasRoute('livecams', <LegacyLivecamsRedirect />)}
    {aliasRoute('tips', <Tips />)}
    {localizedAliases('tips').map((p) => (
      <Route key={`tips-detail-${p}`} path={`${p}/:slug`} element={<ContentDetailPage kind="tips" />} />
    ))}
    {aliasRoute('arrangementer', <Events />)}
    {localizedAliases('arrangementer').map((p) => (
      <Route key={`events-detail-${p}`} path={`${p}/:slug`} element={<ContentDetailPage kind="events" />} />
    ))}
    {aliasRoute('nyheter', <News />)}
    {localizedAliases('nyheter').map((p) => (
      <Route key={`news-detail-${p}`} path={`${p}/:slug`} element={<ContentDetailPage kind="news" />} />
    ))}
    {aliasRoute('aktiviteter', <Activities />)}
    {localizedAliases('aktiviteter').map((p) => (
      <Route key={`activities-detail-${p}`} path={`${p}/:slug`} element={<ContentDetailPage kind="activities" />} />
    ))}
    {aliasRoute('kontakt', <Contact />)}
    {aliasRoute('heiskort', <Heiskort />)}
    {aliasRoute('langrenn', <Langrenn />)}
    {aliasRoute('fotturer', <Fotturer />)}
    {aliasRoute('sykling', <Sykling />)}
    {aliasRoute('fiske', <Fiske />)}
    {aliasRoute('gardsbesok', <Gardsbesok />)}
    {aliasRoute('golden-train', <GoldenTrain />)}
    {aliasRoute('romsdalsgondolen', <Romsdalsgondolen />)}
    {aliasRoute('sagelva', <Sagelva />)}
    {aliasRoute('familie', <Familie />)}
    {aliasRoute('vinter', <Vinter />)}
    {aliasRoute('loypekart', <Loypekart />)}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <LanguageProvider>
          <Layout>
            <SEOHead />
            {/* Fallback holds the viewport and hides the footer while a page
                chunk loads, so the footer never jumps (layout shift). */}
            <Suspense fallback={<ContentPlaceholder />}>
            <Routes>
              {/* Norwegian = root, no prefix */}
              <Route path="/*" element={<AppRoutes />} />
              {/* All other locales reuse the same route tree under their prefix */}
              {LOCALIZED_PATHS.map((p) => (
                <Route key={p} path={`${p}/*`} element={<AppRoutes />} />
              ))}
            </Routes>
            </Suspense>
          </Layout>
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
