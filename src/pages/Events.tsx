import { useLanguage } from '@/i18n/LanguageContext';
import EventsListingTemplate from '@/components/listing/EventsListingTemplate';
import { toListingItem } from '@/components/listing/listingHelpers';
import { getEvents, useCms } from '@/lib/cms';
import heroImg from '@/assets/hero-winter.jpg';

const Events = () => {
  const { d, locale } = useLanguage();
  const events = useCms(() => getEvents({ language: locale }), [locale]) ?? [];
  const items = events.map((e) => toListingItem(e, heroImg));
  return (
    <EventsListingTemplate
      title={d.listing.pageEventsTitle}
      intro={d.listing.pageEventsIntro}
      heroImage={heroImg}
      basePath="/arrangementer"
      items={items}
    />
  );
};

export default Events;
