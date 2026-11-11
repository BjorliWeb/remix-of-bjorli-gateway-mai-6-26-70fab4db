import { describe, expect, it } from 'vitest';
import { PARKING_RULES } from './practicalRules';
import { getSkiSchoolData } from './skiSchoolData';

describe('owner-confirmed practical rules', () => {
  it('retains P1 price of NOK 95', () => expect(PARKING_RULES.p1PriceNok).toBe(95));
  it('retains P2 price of NOK 115', () => expect(PARKING_RULES.p2PriceNok).toBe(115));
  it('retains annual parking price of NOK 900', () => expect(PARKING_RULES.annualPriceNok).toBe(900));
  it('makes both car parks free after 16:00', () => expect(PARKING_RULES.freeAfterHour).toBe(16));
  it('supports EasyPark in addition to Parkly', () => expect(PARKING_RULES.paymentProviders).toEqual(['Parkly', 'EasyPark']));
  it.each(['no', 'en', 'de', 'nl', 'da', 'sv'] as const)('directs %s ski school requests to the resort', (locale) => {
    expect(getSkiSchoolData(locale).contactEmail).toBe('skisenter@bjorli.no');
  });
});