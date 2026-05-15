import { useLanguage } from '@/i18n/LanguageContext';
import ActivitiesListingTemplate from '@/components/listing/ActivitiesListingTemplate';
import { toListingItem } from '@/components/listing/listingHelpers';
import { getActivities, useCms } from '@/lib/cms';
import { images } from '@/lib/images';

// /aktiviteter is the destination of summer-card hrefs (Fiske, Natur og
// utsikt, Familieaktiviteter). To comply with the strict editorial rule
// "no winter imagery on summer content paths" we use the green summer
// landscape as the page hero. Winter activities continue to be served
// from /vinter and the dedicated ski-center pages, which keep their
// own winter heroes.
const heroImg = images.heroSummer.src;

const Activities = () => {
  const { d, locale } = useLanguage();
  const activities = useCms(() => getActivities({ language: locale }), [locale]) ?? [];
  const summerActivities = activities.filter((a) => a.season === 'summer');
  const items = summerActivities.map((a) => toListingItem(a, heroImg));
  return (
    <ActivitiesListingTemplate
      title={d.listing.pageActivitiesTitle}
      intro={d.listing.pageActivitiesIntro}
      heroImage={heroImg}
      basePath="/aktiviteter"
      entries={summerActivities}
      items={items}
    />
  );
};

export default Activities;
