import { useParams } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import ContentDetailTemplate, {
  type DetailKind,
} from '@/components/listing/ContentDetailTemplate';
import EventOrganizerBlock from '@/components/listing/EventOrganizerBlock';
import { toListingItem } from '@/components/listing/listingHelpers';
import {
  getActivities,
  getArchivedEvents,
  getEvents,
  getNews,
  getTips,
  useCms,
  type CmsEntryBase,
  type CmsEvent,
} from '@/lib/cms';
import { isEventArchived } from '@/lib/events/archive';
import heroImg from '@/assets/hero-winter.jpg';

type Kind = 'tips' | 'events' | 'news' | 'activities';

interface Props {
  kind: Kind;
}

const KIND_CONFIG: Record<
  Kind,
  {
    basePath: string;
    titleKey: 'pageTipsTitle' | 'pageEventsTitle' | 'pageNewsTitle' | 'pageActivitiesTitle';
    detailKind: DetailKind;
  }
> = {
  tips: { basePath: '/tips', titleKey: 'pageTipsTitle', detailKind: 'tip' },
  events: { basePath: '/arrangementer', titleKey: 'pageEventsTitle', detailKind: 'event' },
  news: { basePath: '/nyheter', titleKey: 'pageNewsTitle', detailKind: 'news' },
  activities: { basePath: '/aktiviteter', titleKey: 'pageActivitiesTitle', detailKind: 'activity' },
};

const ContentDetailPage = ({ kind }: Props) => {
  const { d, locale } = useLanguage();
  const { slug } = useParams();
  const cfg = KIND_CONFIG[kind];

  const loadedEntries = useCms<CmsEntryBase[]>(() => {
    const q = { language: locale };
    if (kind === 'tips') return getTips(q);
    if (kind === 'events') {
      // Archived events keep their URL — resolve both streams here.
      return Promise.all([getEvents(q), getArchivedEvents(q)]).then(([cur, arc]) => [
        ...cur,
        ...arc,
      ]);
    }
    if (kind === 'news') return getNews(q);
    return getActivities(q);
  }, [locale, kind]);
  const entries = loadedEntries ?? [];

  const items = entries.map((e) => toListingItem(e, heroImg));
  const item = items.find((it) => it.slug === slug) ?? null;
  const fullEntry = entries.find((e) => e.slug === slug);
  // Finished events stay online but are marked, and never suggested as related.
  const archivedSlugs = new Set(
    kind === 'events'
      ? entries.filter((e) => isEventArchived(e as CmsEvent)).map((e) => e.slug)
      : [],
  );
  const isArchived = slug ? archivedSlugs.has(slug) : false;
  const related = items
    .filter((it) => it.slug !== slug && !archivedSlugs.has(it.slug))
    .slice(0, 3);
  const listingTitle = d.listing[cfg.titleKey];

  // FAQ placeholder — only surfaced for tips/activities by default.
  const faq = (kind === 'tips' || kind === 'activities')
    ? d.faq.items.slice(0, 3)
    : undefined;

  // Events and news can carry an editorial CTA (booking / purchase flow).
  const eventCta = kind === 'events' || kind === 'news'
    ? (fullEntry as { ctaLabel?: string; ctaHref?: string } | undefined)
    : undefined;

  // Submissions get an organiser block instead of the external CTA button.
  const submissionEvent =
    kind === 'events' && (fullEntry as CmsEvent | undefined)?.isSubmission
      ? (fullEntry as CmsEvent)
      : null;

  // An unresolved CMS request is not evidence that the requested page is missing.
  if (loadedEntries === undefined) {
    return (
      <div className="container mx-auto px-4 py-24 text-center" aria-busy="true">
        <h1 className="font-display text-3xl font-bold mb-4">{listingTitle}</h1>
        <div className="mx-auto h-4 w-48 rounded bg-muted motion-safe:animate-pulse" aria-hidden="true" />
      </div>
    );
  }

  return (
    <ContentDetailTemplate
      kind={cfg.detailKind}
      item={item}
      basePath={cfg.basePath}
      listingTitle={listingTitle}
      related={related}
      body={fullEntry?.body ?? item?.intro}
      faq={faq}
      ctaLabel={submissionEvent ? undefined : eventCta?.ctaLabel}
      ctaHref={submissionEvent ? undefined : eventCta?.ctaHref}
      extraContent={submissionEvent ? <EventOrganizerBlock event={submissionEvent} /> : undefined}
      statusLabel={isArchived ? (d.listing.eventEndedLabel ?? 'Avsluttet') : undefined}
      bodyImages={fullEntry?.bodyImages}
    />
  );
};

export default ContentDetailPage;
