import { useLanguage } from '@/i18n/LanguageContext';
import ActivitiesListingTemplate from '@/components/listing/ActivitiesListingTemplate';
import { toListingItem } from '@/components/listing/listingHelpers';
import { getActivities, useCms } from '@/lib/cms';
import heroImg from '@/assets/hero-winter.jpg';

const Activities = () => {
  const { d, locale } = useLanguage();
  const activities = useCms(() => getActivities({ language: locale }), [locale]) ?? [];
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
