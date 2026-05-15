import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { LanguageProvider } from "@/i18n/LanguageContext";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import SkiCenter from "./pages/SkiCenter";
import Accommodation from "./pages/Accommodation";
import OpeningHours from "./pages/OpeningHours";
import SkiSchool from "./pages/SkiSchool";
import SkiRental from "./pages/SkiRental";
import FoodDrink from "./pages/FoodDrink";
import PracticalInfo from "./pages/PracticalInfo";
import Contact from "./pages/Contact";
import SEOHead from "./components/SEOHead";
import NotFound from "./pages/NotFound";
import Tips from "./pages/Tips";
import Events from "./pages/Events";
import News from "./pages/News";
import Activities from "./pages/Activities";
import GettingHere from "./pages/GettingHere";
import Sommer from "./pages/Sommer";
import ContentDetailPage from "./pages/ContentDetailPage";
import Heiskort from "./pages/Heiskort";
import Langrenn from "./pages/Langrenn";
import Fotturer from "./pages/Fotturer";
import Sykling from "./pages/Sykling";
import KorteTurer from "./pages/KorteTurer";
import Familie from "./pages/Familie";
import Fiske from "./pages/Fiske";
import Gardsbesok from "./pages/Gardsbesok";
import GoldenTrain from "./pages/GoldenTrain";
import Romsdalsgondolen from "./pages/Romsdalsgondolen";
import Sagelva from "./pages/Sagelva";
import Vinter from "./pages/Vinter";
import Live from "./pages/Live";
import Loypekart from "./pages/Loypekart";
import WeatherWebcams from "./pages/WeatherWebcams";
import SkiHolidayNorway from "./pages/SkiHolidayNorway";
import ImageInventory from "./pages/ImageInventory";
import HeroCompare from "./pages/HeroCompare";
import { ROUTE_SLUGS, type CanonicalRoute } from "@/i18n/routes";
import { LOCALES } from "@/i18n/translations";

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

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/sommer" element={<Sommer />} />
    <Route path="/skisenter" element={<SkiCenter />} />
    <Route path="/bjorli-skisenter" element={<SkiCenter />} />
    <Route path="/overnatting" element={<Accommodation />} />
    <Route path="/apningstider" element={<OpeningHours />} />
    {/* New combined "Vær og webkamera" page (canonical NO route).
        /livecams is kept as a legacy alias rendering the same component
        until a true 301 can be configured at the hosting layer. */}
    <Route path="/vaer-og-webkamera" element={<WeatherWebcams />} />
    <Route path="/livecams" element={<WeatherWebcams />} />
    <Route path="/skiskole" element={<SkiSchool />} />
    <Route path="/skiutleie" element={<SkiRental />} />
    <Route path="/mat-og-drikke" element={<FoodDrink />} />
    <Route path="/praktisk-info" element={<PracticalInfo />} />
    <Route path="/reisen-hit" element={<GettingHere />} />
    <Route path="/tips" element={<Tips />} />
    <Route path="/tips/:slug" element={<ContentDetailPage kind="tips" />} />
    <Route path="/arrangementer" element={<Events />} />
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
    <Route path="/vinter" element={<Vinter />} />
    <Route path="/live" element={<Live />} />
    <Route path="/loypekart" element={<Loypekart />} />
    {/* English-only international SEO landing page. No NO/DE/NL/DA/SV alias. */}
    <Route path="/ski-holiday-norway" element={<SkiHolidayNorway />} />
    {/* Internal review-only page. Not linked from navigation, not in sitemap. */}
    <Route path="/image-inventory" element={<ImageInventory />} />
    {/* Internal hero image comparison. Not linked, not in sitemap, not in SEO. */}
    <Route path="/hero-compare" element={<HeroCompare />} />
    {/* Localized aliases — same components, translated slugs. */}
    {aliasRoute('sommer', <Sommer />)}
    {aliasRoute('skisenter', <SkiCenter />)}
    {aliasRoute('overnatting', <Accommodation />)}
    {aliasRoute('apningstider', <OpeningHours />)}
    {aliasRoute('skiskole', <SkiSchool />)}
    {aliasRoute('skiutleie', <SkiRental />)}
    {aliasRoute('mat-og-drikke', <FoodDrink />)}
    {aliasRoute('praktisk-info', <PracticalInfo />)}
    {aliasRoute('reisen-hit', <GettingHere />)}
    {aliasRoute('vaer-og-webkamera', <WeatherWebcams />)}
    {aliasRoute('livecams', <WeatherWebcams />)}
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
            <Routes>
              {/* Norwegian = root, no prefix */}
              <Route path="/*" element={<AppRoutes />} />
              {/* All other locales reuse the same route tree under their prefix */}
              {LOCALIZED_PATHS.map((p) => (
                <Route key={p} path={`${p}/*`} element={<AppRoutes />} />
              ))}
            </Routes>
          </Layout>
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
