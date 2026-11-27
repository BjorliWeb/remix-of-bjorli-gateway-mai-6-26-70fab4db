import { describe, expect, it } from 'vitest';
import { LOCALES } from '@/i18n/locales/types';
import { getOpeningHoursData } from './openingHoursData';

describe('/apningstider page data', () => {
  it.each(LOCALES)('%s: Heiskroa line is replaced by Bjorli Fjellkafe; shop line kept', (l) => {
    const d = getOpeningHoursData(l, '2026-11-27');
    expect(d.hours.join(' ')).not.toMatch(/Heiskroa/);
    expect(d.hours.join(' ')).toMatch(/Intersport/);
    expect(d.fjellkafe.title).toBe('Bjorli Fjellkafe');
  });

  it('in November: shows the owner-confirmed November hours', () => {
    const d = getOpeningHoursData('no', '2026-11-27');
    expect(d.fjellkafe.subtitle).toBe('Åpningstider i november 2026');
    expect(d.fjellkafe.rows).toEqual([
      { label: 'Fredag', text: 'kl. 16.00–00.00' },
      { label: 'Lørdag', text: 'kl. 10.00–02.00 (natt til søndag)' },
      { label: 'Søndag', text: 'kl. 10.00–17.00' },
    ]);
  });

  it('from December: November hours disappear, the lift-hours text remains', () => {
    const d = getOpeningHoursData('no', '2026-12-01');
    expect(d.fjellkafe.rows).toEqual([]);
    expect(d.fjellkafe.subtitle).toBeUndefined();
    expect(d.fjellkafe.text).toMatch(/hele heisens åpningstid/);
  });
});
