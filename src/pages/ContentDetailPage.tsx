import { useParams } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import ContentDetailTemplate, {
  type DetailKind,
} from '@/components/listing/ContentDetailTemplate';
import EventOrganizerBlock from '@/components/listing/EventOrganizerBlock';
import { toListingItem } from '@/components/listing/listingHelpers';
import {
  getActivities,
  getEvents,
  getNews,
  getTips,
  useCms,
  type CmsEntryBase,
  type CmsEvent,
} from '@/lib/cms';
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

  const entries = useCms<CmsEntryBase[]>(() => {
    const q = { language: locale };
    if (kind === 'tips') return getTips(q);
    if (kind === 'events') return getEvents(q);
    if (kind === 'news') return getNews(q);
    return getActivities(q);
  }, [locale, kind]) ?? [];

  const items = entries.map((e) => toListingItem(e, heroImg));
  const item = items.find((it) => it.slug === slug) ?? null;
  const fullEntry = entries.find((e) => e.slug === slug);
  const related = items.filter((it) => it.slug !== slug).slice(0, 3);
  const listingTitle = d.listing[cfg.titleKey];

  // FAQ placeholder — only surfaced for tips/activities by default.
  const faq = (kind === 'tips' || kind === 'activities')
    ? d.faq.items.slice(0, 3)
    : undefined;

  const eventCta = kind === 'events'
    ? (fullEntry as { ctaLabel?: string; ctaHref?: string } | undefined)
    : undefined;

  // Submissions get an organiser block instead of the external CTA button.
  const submissionEvent =
    kind === 'events' && (fullEntry as CmsEvent | undefined)?.isSubmission
      ? (fullEntry as CmsEvent)
      : null;

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
    />
  );
};

export default ContentDetailPage;
