import { describe, expect, it } from 'vitest';
import { LOCALES } from '@/i18n/locales/types';
import { alpineStats, alpineMapStats, difficultyDistribution, RESORT_FACTS as f, SKIAPPEN_AREA_URL } from './resortFacts';
import { getSkiCenterData } from './cms/skiCenterData';

describe('owner-confirmed resort specifications, 21 November 2026', () => {
  it('base station is 575 m above sea level', () => expect(f.baseAltitude).toBe(575));
  it('resort summit station is 1225 m above sea level', () => expect(f.summitAltitude).toBe(1225));
  it('vertical difference is 650 m', () => {
    expect(f.vertical).toBe(650);
    expect(f.summitAltitude - f.baseAltitude).toBe(650);
  });
  it('longest descent is 5 km', () => expect(f.longestRunKm).toBe(5));
  it('there are 11 alpine runs', () => expect(f.runs).toBe(11));
  it('alpine piste length is 20 km', () => expect(f.alpineKm).toBe(20));
  it('six lifts consist of one six-seat chairlift and five surface lifts', () => {
    expect(f.lifts).toBe(6); expect(f.chairlifts).toBe(1); expect(f.chairSeats).toBe(6); expect(f.surfaceLifts).toBe(5);
    expect(f.chairlifts + f.surfaceLifts).toBe(f.lifts);
  });
  it('two beginner lifts are part of the six-lift total, not added to it', () => {
    expect(f.beginnerLifts).toBe(2);
    for (const locale of LOCALES) expect(alpineStats(locale)[0]?.value).toBe('6');
  });
  it('difficulty percentages by length are 47/9/25/19 on all languages', () => {
    for (const locale of LOCALES) expect(difficultyDistribution(locale).map(d => d.percent)).toEqual([47, 9, 25, 19]);
  });
  it('floodlit alpine slope length is 1.8 km', () => expect(f.floodlitKm).toBe(1.8));
  it('conditional snowmaking coverage is 8 km', () => expect(f.snowmakingKm).toBe(8));
  it('usual opening days threshold is more than 150, not a calendar interval', () => expect(f.usualOpeningDaysMoreThan).toBe(150));
  it('detailed Nordic network is 81 km', () => expect(f.nordicKm).toBe(81));
  it('Nordic marketing threshold is more than 80 km', () => expect(f.nordicMarketingKmMoreThan).toBe(80));
  it('floodlit Nordic trail lights stay on until 22.00', () => expect(f.lightsUntil).toBe('22.00'));
  it('Vipps number is exactly 508426', () => expect(f.vipps).toBe('508426'));
  it('bank account is exactly 1503.19.64269', () => expect(f.bankAccount).toBe('1503.19.64269'));
  it('all three maps use the supplied area URL', () => expect(SKIAPPEN_AREA_URL).toBe('https://skiappen.no/?lat=62.25418&lng=8.25897&zoom=11'));
  it('ski-center adapter and map summaries use the shared totals on all six languages', () => {
    for (const locale of LOCALES) {
      expect(getSkiCenterData(locale).stats).toEqual(alpineStats(locale));
      expect(alpineMapStats(locale).map(s => s?.value)).toEqual(['11', '20 km', '6', '650 m', '5 km']);
    }
  });
});