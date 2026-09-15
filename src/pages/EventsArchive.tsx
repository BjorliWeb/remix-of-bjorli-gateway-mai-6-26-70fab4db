import { useLanguage } from '@/i18n/LanguageContext';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';
import PageHero from '@/components/PageHero';
import Breadcrumbs from '@/components/listing/Breadcrumbs';
import { EventCard } from '@/components/listing/cards';
import { toListingItem } from '@/components/listing/listingHelpers';
import { getArchivedEvents, useCms } from '@/lib/cms';
import heroImg from '@/assets/hero-winter.jpg';

/**
 * Public archive of finished events.
 *
 * Kept online so old links and shared posts still resolve, but held out of
 * the sitemap and marked `noindex, follow` — this is reference material,
 * not something search engines should surface as current.
 */
const EventsArchive = () => {
  const { d, locale } = useLanguage();
  const lp = useLocalizedPath();
  const events = useCms(() => getArchivedEvents({ language: locale }), [locale]) ?? [];
  const items = events.map((e) => toListingItem(e, heroImg));

  const title = d.listing.eventsArchiveTitle ?? 'Tidligere arrangementer';
  const intro = d.listing.eventsArchiveIntro ?? '';
  const endedLabel = d.listing.eventEndedLabel ?? 'Avsluttet';

  // Title, description and `noindex, follow` for this route are handled
  // centrally in SEOHead (see EVENTS_ARCHIVE_SEO).
  return (
    <div>
      <PageHero title={title} subtitle={intro} image={heroImg} />
      <Breadcrumbs
        items={[
          { label: d.listing.breadcrumbHome, to: lp('/') },
          { label: d.listing.pageEventsTitle, to: lp('/arrangementer') },
          { label: title },
        ]}
      />

      <section className="container mx-auto px-4 pt-8">
        <p className="max-w-3xl text-base text-muted-foreground md:text-lg">{intro}</p>
      </section>

      <section className="px-4 py-12 md:py-16">
        <div className="container mx-auto">
          {items.length === 0 ? (
            <p className="text-muted-foreground">
              {d.listing.eventsArchiveEmpty ?? 'Ingen arrangementer i arkivet ennå.'}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, i) => (
                <div key={item.slug} className="relative">
                  <span className="absolute right-3 top-3 z-10 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-muted-foreground ring-1 ring-border">
                    {endedLabel}
                  </span>
                  <EventCard item={item} to={lp(`/arrangementer/${item.slug}`)} index={i} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default EventsArchive;
