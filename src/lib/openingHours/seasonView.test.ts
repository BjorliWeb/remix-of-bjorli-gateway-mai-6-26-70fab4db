import { describe, expect, it } from 'vitest';
import { LOCALES, type Locale } from '@/i18n/locales/types';
import { SOCIAL_LINKS, buildSections, fjellkafeNovemberActive, fjellkafeNovemberRows, openingHoursCopy } from './seasonView';

const ORDER = ['early', 'christmas', 'regular', 'winterBreak', 'easter', 'closing', 'evening', 'mini', 'disclaimer'];
const all = (l: Locale, today = '2026-11-26') => buildSections(l, today);
const text = (l: Locale, today?: string) =>
  all(l, today).flatMap((s) => [s.title, ...s.rows.map((r) => (r.label ? `${r.label}: ${r.text}` : r.text)), ...s.notes]).join('\n');
/** Every clock time in the text, normalised to HH:MM, in order. */
const times = (l: Locale) => (text(l).match(/\b\d{2}[.:]\d{2}\b/g) ?? []).map((t) => t.replace('.', ':'));

describe('six languages, one set of facts', () => {
  it.each(LOCALES)('%s has all nine sections in the required order', (l) => {
    expect(all(l).map((s) => s.id)).toEqual(ORDER);
  });

  it('every language shows exactly the same clock times in the same order', () => {
    const no = times('no');
    expect(no.length).toBeGreaterThan(15);
    for (const l of LOCALES) expect(times(l)).toEqual(no);
  });

  it.each(LOCALES)('%s keeps brand names untranslated', (l) => {
    const t = text(l);
    for (const name of ['Mini-maNeuver', 'T-kroken', 'Jibben Lever Tour']) expect(t).toContain(name);
  });

  it('Norwegian wording uses the confirmed facts', () => {
    const t = text('no');
    expect(t).toContain('Mini-maNeuver-bakken åpnet lørdag 21. november og søndag 22. november 2026, kl. 10.00–16.00.');
    expect(t).toContain('Heis 1 (T-kroken) er åpen hver dag fra torsdag 26. november til og med søndag 13. desember 2026, kl. 10.00–16.00.');
    expect(t).toContain('Søndag 6. desember 2026 er Bjorli vertskap for Jibben Lever Tour.');
    expect(t).toContain('Åpent hver dag fra 16. desember 2026 til og med 3. januar 2027, kl. 10.00–16.00.');
    expect(t).toContain('Torsdag 24. desember: kl. 10.00–14.00');
    expect(t).toContain('Fredag 25. desember: kl. 12.00–16.00');
    expect(t).toContain('Fredag 1. januar 2027: kl. 12.00–16.00');
    expect(t).toContain('Kveldskjøring 25. desember og 1. januar 2027: kl. 17.00–20.00.');
    expect(t).toContain('Onsdag–søndag: kl. 10.00–16.00');
    expect(t).toContain('Uke 2–6, 9–11 og 13–15 i 2027');
    expect(t).toContain('Åpent hver dag fra 13. februar til og med 28. februar 2027, kl. 10.00–16.00.');
    expect(t).toContain('Åpent hver dag fra 17. mars til og med 29. mars 2027, kl. 10.00–17.00.');
    expect(t).toContain('Avslutningshelgen er fra fredag 16. april til og med søndag 18. april 2027.');
    expect(t).toContain('Fredager kl. 17.00–20.00, fra 25. desember 2026 til og med 19. mars 2027.');
    expect(t).toContain('Ved behov prepareres bakkene mellom kl. 16.00 og 17.00.');
    expect(t).toContain('Kveldskjøring krever egen billett.');
    expect(t).toContain('Gratis for barn fra 0 til og med 6 år.');
  });

  it('Monday and Tuesday are never presented as ordinary opening days', () => {
    const reg = all('no').find((s) => s.id === 'regular')!;
    const monTue = reg.rows.find((r) => r.label === 'Mandag og tirsdag')!;
    expect(monTue.text).toMatch(/Ingen ordinær åpning/);
    expect(monTue.text).not.toMatch(/\d{2}\.\d{2}/);
  });

  it('closing weekend states no clock times', () => {
    for (const l of LOCALES) {
      const closing = all(l).find((s) => s.id === 'closing')!;
      expect([...closing.rows.map((r) => r.text), ...closing.notes].join(' ')).not.toMatch(/\d{2}[.:]\d{2}/);
    }
  });

  it('no invented prices', () => {
    for (const l of LOCALES) expect(text(l)).not.toMatch(/(?<!\p{L})kr(?!\p{L})|NOK|€|\d+\s?,-/u);
  });

  it('only already verified social links; no TikTok URL is invented', () => {
    expect(SOCIAL_LINKS.map((s) => s.href)).toEqual([
      'https://www.instagram.com/bjorliskisenter/',
      'https://www.facebook.com/bjorliskisenter',
    ]);
    for (const l of LOCALES) {
      for (const s of all(l)) for (const link of s.links ?? []) expect(link.href).not.toMatch(/tiktok/i);
    }
  });

  it('disclaimer links to bjorli.no and fnugg.no', () => {
    const d = all('no').find((s) => s.id === 'disclaimer')!;
    expect(d.links?.map((x) => x.href)).toEqual(['https://bjorli.no', 'https://fnugg.no']);
  });
});

describe('past periods never look upcoming', () => {
  it('on 26 Nov 2026 nothing is past', () => {
    expect(all('no', '2026-11-26').filter((s) => s.past)).toEqual([]);
  });
  it('after 13 Dec the early season is marked past; after 3 Jan Christmas too', () => {
    expect(all('no', '2026-12-14').filter((s) => s.past).map((s) => s.id)).toEqual(['early']);
    expect(all('no', '2027-01-04').filter((s) => s.past).map((s) => s.id)).toEqual(['early', 'christmas']);
  });
  it('after the season every dated section is past; Mini-maNeuver and the disclaimer stay', () => {
    const live = all('no', '2027-05-01').filter((s) => !s.past).map((s) => s.id);
    expect(live).toEqual(['mini', 'disclaimer']);
  });
});

describe('Bjorli Fjellkafe', () => {
  it('November rows with times past midnight (Norwegian)', () => {
    expect(fjellkafeNovemberRows('no')).toEqual([
      { label: 'Fredag', text: 'kl. 16.00–00.00' },
      { label: 'Lørdag', text: 'kl. 10.00–02.00 (natt til søndag)' },
      { label: 'Søndag', text: 'kl. 10.00–17.00' },
    ]);
  });
  it('November rows are shown only until 30 November 2026', () => {
    expect(fjellkafeNovemberActive('2026-11-30')).toBe(true);
    expect(fjellkafeNovemberActive('2026-12-01')).toBe(false);
  });
  it.each(LOCALES)('%s says the café is staffed and open during lift hours, and that Loungen opens in December 2026', (l) => {
    const c = openingHoursCopy(l);
    expect(c.fjellkafe).toMatch(/Bjorli Fjellkafe/);
    expect(c.loungen).toMatch(/2026/);
    expect(c.loungen).not.toMatch(/\d{1,2}\.\s|\d{2}[.:]\d{2}/); // no invented date or time
  });
});
