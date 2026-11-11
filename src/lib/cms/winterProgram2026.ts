/**
 * Bjorli Spisestedene – winter programme 2026/27.
 *
 * Source: the three programme posters supplied by the owner (Nov 2026).
 * Only titles and dates from the posters are published here. Times, prices,
 * venues and tickets are NOT on the posters and are deliberately left out.
 *
 * Publication: everything in this module stays hidden (status
 * `unpublished`) until WINTER_PROGRAM_PUBLISHED is switched on, so the news
 * story and the calendar entries go live together in one release.
 *
 * Four programme items already exist as editor-approved submissions in the
 * event calendar (7, 14 and 20 November approved; 28 November pending). They
 * are linked, not duplicated – see EXISTING_SUBMISSION_SLUGS.
 */
import type { CmsEvent, CmsImage, CmsNews } from './types';
import posterSeason from '@/assets/photos/arrangementer/bjorli-vinter-arrangementer-spisestedene-2026-2027.jpg';
import posterNovDec from '@/assets/photos/arrangementer/bjorli-vinter-arrangementer-november-desember-2026.jpg';
import posterJanApr from '@/assets/photos/arrangementer/bjorli-vinter-arrangementer-januar-april-2027.jpg';
import spisestedeneLogo from '@/assets/logos/bjorli-mat-og-drikke-spisestedene-logo.jpg';

/** Single switch for the combined release. Keep false until approved. */
export const WINTER_PROGRAM_PUBLISHED = false;
/** Set only after the editor approves the existing submission; never bypass moderation. */
export const PRAY_FOR_SNOW_APPROVED = false;

export const SPISESTEDENE_INSTAGRAM_URL = 'https://www.instagram.com/bjorli_spisestedene/';
export const SPISESTEDENE_INSTAGRAM_HANDLE = '@bjorli_spisestedene';
export const SPISESTEDENE_ORGANIZER = 'Bjorli Spisestedene';

export const SPISESTEDENE_LOGO: CmsImage = {
  url: spisestedeneLogo,
  alt: 'Logo for Bjorli Spisestedene',
  width: 1254,
  height: 1254,
  fit: 'contain',
};

export const POSTER_SEASON: CmsImage = {
  url: posterSeason,
  alt: 'Plakat: Dette skjer i vinter – arrangementer 2026/27 hos Bjorli Spisestedene',
  width: 1080,
  height: 1440,
  fit: 'contain',
};
export const POSTER_NOV_DEC: CmsImage = {
  url: posterNovDec,
  alt: 'Programplakat for november og desember 2026',
  width: 1080,
  height: 1440,
  fit: 'contain',
};
export const POSTER_JAN_APR: CmsImage = {
  url: posterJanApr,
  alt: 'Programplakat for januar til april 2027',
  width: 1080,
  height: 1440,
  fit: 'contain',
};

export const WINTER_NEWS_SLUG = 'dette-skjer-i-vinter-hos-bjorli-spisestedene-2026-2027';

/** Slugs of the matching approved/pending submissions (title slug + id prefix). */
export const EXISTING_SUBMISSION_SLUGS = {
  '2026-11-07': 'novemberfest-pa-bjorli-e1bf59da',
  '2026-11-14': 'skredkveld-bjorli-skisenter-7239f108',
  '2026-11-20': 'quiz-pa-bjorli-fjellkafe-dd06d16d',
  '2026-11-28': 'pray-for-snow-party-med-dj-preben-m-31600e68',
} as const;

export interface ProgramItem {
  date: string; // YYYY-MM-DD, Europe/Oslo calendar date
  title: string;
  /** Category keys from src/lib/eventCategories.ts, in display order. */
  categories: string[];
  intro: string;
  /** Existing calendar entry – linked instead of creating a duplicate. */
  existingSlug?: string;
}

export const PROGRAM_NOV_DEC: ProgramItem[] = [
  { date: '2026-11-07', title: 'Novemberfest (åpningsfest)', categories: ['arrangement'], intro: 'Novemberfest – åpningsfesten for vintersesongen hos Bjorli Spisestedene.', existingSlug: EXISTING_SUBMISSION_SLUGS['2026-11-07'] },
  { date: '2026-11-14', title: 'Snøskredkveld med DNT', categories: ['kurs'], intro: 'Snøskredkveld med DNT i Bjorli Skisenter.', existingSlug: EXISTING_SUBMISSION_SLUGS['2026-11-14'] },
  { date: '2026-11-20', title: 'Quiz med Ronny Haug', categories: ['quiz'], intro: 'Quiz med Ronny Haug hos Bjorli Spisestedene.', existingSlug: EXISTING_SUBMISSION_SLUGS['2026-11-20'] },
  { date: '2026-11-28', title: 'Pray for Snow-fest med bål og DJ Preben', categories: ['arrangement'], intro: 'Pray for Snow-fest med bål og DJ Preben.', existingSlug: EXISTING_SUBMISSION_SLUGS['2026-11-28'] },
  { date: '2026-12-11', title: 'Quiz med Ronny Haug', categories: ['quiz'], intro: 'Ny runde quiz med Ronny Haug hos Bjorli Spisestedene.' },
  { date: '2026-12-12', title: 'Akustisk konsert med Lene Herskedal og Tommy Hattrem', categories: ['konsert'], intro: 'Akustisk konsert med Lene Herskedal og Tommy Hattrem hos Bjorli Spisestedene.' },
  { date: '2026-12-31', title: 'Nyttårsaften med treretters middag og afterski med DJ Snorre', categories: ['after-ski', 'mat-drikke'], intro: 'Feir nyttårsaften med treretters middag og afterski med DJ Snorre.' },
];

export const PROGRAM_JAN_APR: ProgramItem[] = [
  { date: '2027-01-23', title: 'Afterski med DJ Siggy', categories: ['after-ski'], intro: 'Afterski med DJ Siggy etter skidagen.' },
  { date: '2027-01-29', title: 'Quiz med Ronny Haug', categories: ['quiz'], intro: 'Quiz med Ronny Haug hos Bjorli Spisestedene.' },
  { date: '2027-02-13', title: 'Love & Peace-afterski med DJ Siggy', categories: ['after-ski'], intro: 'Love & Peace-afterski med DJ Siggy.' },
  { date: '2027-02-27', title: 'Afterski med DJ Siggy', categories: ['after-ski'], intro: 'Afterski med DJ Siggy etter skidagen.' },
  { date: '2027-03-13', title: 'Afterski med DJ Siggy', categories: ['after-ski'], intro: 'Afterski med DJ Siggy etter skidagen.' },
  { date: '2027-03-27', title: 'Afterski med DJ Siggy', categories: ['after-ski'], intro: 'Afterski med DJ Siggy etter skidagen.' },
  { date: '2027-04-03', title: 'Afterski med DJ Siggy', categories: ['after-ski'], intro: 'Afterski med DJ Siggy i påskeuka.' },
  { date: '2027-04-18', title: 'Sesongavslutning med afterski og DJ Siggy', categories: ['after-ski'], intro: 'Sesongavslutning med afterski og DJ Siggy.' },
];

export const PROGRAM_ALL: ProgramItem[] = [...PROGRAM_NOV_DEC, ...PROGRAM_JAN_APR];

const slugBase = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/æ/g, 'ae').replace(/ø/g, 'o').replace(/å/g, 'a')
    .replace(/&/g, ' og ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** Date suffix keeps recurring titles (quiz, afterski) on unique URLs. */
export const programEventSlug = (it: ProgramItem): string =>
  it.existingSlug ?? `${slugBase(it.title)}-${it.date}`;

const instagramLine = `Følg [${SPISESTEDENE_INSTAGRAM_HANDLE}](${SPISESTEDENE_INSTAGRAM_URL}) på Instagram for de siste nyhetene om mat, drikke og arrangementer i Bjorli Skisenter.`;

const status = (published: boolean): 'published' | 'unpublished' => (published ? 'published' : 'unpublished');

/** Editorial calendar entries for the programme items not yet in the calendar. */
export const buildWinterProgramEvents = (published = WINTER_PROGRAM_PUBLISHED): CmsEvent[] =>
  PROGRAM_ALL.filter((it) => !it.existingSlug).map((it) => {
    const poster = it.date < '2027-01-01' ? POSTER_NOV_DEC : POSTER_JAN_APR;
    return {
      id: `spisestedene-${it.date}-${slugBase(it.title)}`,
      slug: programEventSlug(it),
      language: 'no',
      title: it.title,
      intro: it.intro,
      body: [
        it.intro,
        `Arrangør: ${SPISESTEDENE_ORGANIZER} i Bjorli Skisenter. Tidspunkt kommer.`,
        `Se hele vinterprogrammet i [Dette skjer i vinter hos Bjorli Spisestedene](/nyheter/${WINTER_NEWS_SLUG}/).`,
        instagramLine,
      ].join('\n\n'),
      heroImage: poster,
      category: it.categories[0],
      categories: it.categories,
      season: 'winter',
      publishedAt: it.date,
      updatedAt: it.date,
      startsAt: it.date,
      endsAt: it.date,
      organizer: SPISESTEDENE_ORGANIZER,
      timeText: 'Tidspunkt kommer',
      seoTitle: `${it.title} – Bjorli Skisenter`,
      seoDescription: `${it.intro} Dato: ${formatNo(it.date)}. Tidspunkt kommer.`,
      status: status(published),
    };
  });

const MONTHS_NO = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember'];
const WEEKDAYS_NO = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'];

/** Calendar date only – computed in UTC from the ISO date so it never shifts. */
export const formatNo = (iso: string): string => {
  const [y, m, d] = iso.split('-').map(Number);
  const wd = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return `${WEEKDAYS_NO[wd]} ${d}. ${MONTHS_NO[m - 1]}`;
};

/**
 * Items dated before the article's publication date carry the "Tidligere i
 * sesongen" marker. Fixed to the publication date (not "now") so the first
 * HTML and the hydrated page always render the same text; the calendar
 * itself moves finished events to the archive on its own.
 */
export const WINTER_NEWS_PUBLISHED_AT = '2026-11-11';

const programLine = (it: ProgramItem, today: string): string => {
  const past = it.date < today ? ' – Tidligere i sesongen' : '';
  if (it.date === '2026-11-28' && !PRAY_FOR_SNOW_APPROVED) {
    return `${capitalize(formatNo(it.date))}: ${it.title}${past}`;
  }
  return `${capitalize(formatNo(it.date))}: [${it.title}](/arrangementer/${programEventSlug(it)}/)${past}`;
};
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const buildWinterProgramNews = (published = WINTER_PROGRAM_PUBLISHED): CmsNews & { status: 'published' | 'unpublished' } => {
  const today = WINTER_NEWS_PUBLISHED_AT;
  return {
    id: 'news-no-spisestedene-vinter-2026-2027',
    slug: WINTER_NEWS_SLUG,
    language: 'no',
    title: 'Dette skjer i vinter hos Bjorli Spisestedene',
    intro: 'Quiz, akustisk konsert, temafester og afterski. Bjorli Spisestedene har satt sammen et variert program for vinteren 2026/27 i Bjorli Skisenter.',
    body: [
      'Vinterprogrammet byr på flere anledninger til å møtes før og etter en dag på ski. Her finner du oversikten over arrangementene fra november til april.',
      'Se [kalenderen](/arrangementer/) for tidspunkter og øvrige opplysninger som allerede er bekreftet. Tidspunkt for de nye oppføringene kommer. Følg også med på Instagram.',
      '## November og desember 2026',
      '![Programplakat for november og desember 2026](poster-nov-des)',
      ...PROGRAM_NOV_DEC.map((it) => programLine(it, today)),
      '## Januar til april 2027',
      '![Programplakat for januar til april 2027](poster-jan-apr)',
      ...PROGRAM_JAN_APR.map((it) => programLine(it, today)),
      '## Følg Bjorli Spisestedene',
      `Følg [${SPISESTEDENE_INSTAGRAM_HANDLE}](${SPISESTEDENE_INSTAGRAM_URL}) på Instagram for de siste nyhetene og oppdateringer om arrangementene.`,
      '[Les mer om spisestedene i Bjorli Skisenter.](/mat-og-drikke/)',
    ].join('\n\n'),
    bodyImages: { 'poster-nov-des': POSTER_NOV_DEC, 'poster-jan-apr': POSTER_JAN_APR },
    heroImage: POSTER_SEASON,
    ogImage: { url: 'https://bjorli.no/og/spisestedene-vinter-2026-2027.jpg', width: 1200, height: 630, alt: POSTER_SEASON.alt },
    category: 'Arrangementer',
    season: 'winter',
    publishedAt: WINTER_NEWS_PUBLISHED_AT,
    updatedAt: WINTER_NEWS_PUBLISHED_AT,
    seoTitle: 'Dette skjer i vinter hos Bjorli Spisestedene 2026/27',
    seoDescription: 'Quiz, konsert, temafester og afterski i Bjorli Skisenter vinteren 2026/27. Se hele programmet fra Bjorli Spisestedene.',
    status: status(published),
  };
};
