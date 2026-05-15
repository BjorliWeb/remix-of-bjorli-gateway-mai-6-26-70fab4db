import { useLanguage } from '@/i18n/LanguageContext';
import ActivitiesListingTemplate from '@/components/listing/ActivitiesListingTemplate';
import { toListingItem } from '@/components/listing/listingHelpers';
import { getActivities, useCms } from '@/lib/cms';
import { images } from '@/lib/images';
import { isSummerRoute } from '@/lib/season';

// /aktiviteter is reachable from both winter and summer crosslinks, but
// the summer activity grid (Fiske, Natur og utsikt) explicitly routes
// users here. To honour the editorial rule "no winter imagery on summer
// content paths" we pick the hero by the current route's season.
const useHeroImage = () => {
  if (typeof window === 'undefined') return images.heroSummer.src;
  return isSummerRoute(window.location.pathname)
    ? images.heroSummer.src
    : images.skiCenter.src;
};

const Activities = () => {
  const { d, locale } = useLanguage();
  const activities = useCms(() => getActivities({ language: locale }), [locale]) ?? [];
  const heroImg = useHeroImage();
  const items = activities.map((a) => toListingItem(a, heroImg));
  return (
    <ActivitiesListingTemplate
      title={d.listing.pageActivitiesTitle}
      intro={d.listing.pageActivitiesIntro}
      heroImage={heroImg}
      basePath="/aktiviteter"
      entries={activities}
      items={items}
    />
  );
};

export default Activities;
