import { describe, expect, it } from 'vitest';
import {
  EM_DASH,
  formatPrecipitation,
  formatTemperature,
  formatWind,
  formatWindDirection,
  formatWindWithDirection,
  formatHour,
  formatWeekday,
  currentHour,
  EMPTY_FORECAST,
  type WeatherHour,
} from './googleWeather';

const hour = (over: Partial<WeatherHour> = {}): WeatherHour => ({
  startTime: '2026-01-01T12:00:00Z',
  temperatureC: null,
  speedMs: null,
  gustMs: null,
  precipitationMm: null,
  precipitationProbability: null,
  condition: null,
  ...over,
});

describe('googleWeather formatting', () => {
  it('never renders missing values as 0', () => {
    expect(formatTemperature(null)).toBe(`${EM_DASH}°C`);
    expect(formatWind(null, null)).toBe(`${EM_DASH} m/s`);
    expect(formatPrecipitation(null)).toBe(`${EM_DASH} mm`);
  });

  it('formats real values', () => {
    expect(formatTemperature(-3.4)).toBe('-3°C');
    expect(formatWind(4.2, 9.6)).toBe('4 (10) m/s');
    expect(formatWind(4.2, null)).toBe('4 m/s');
    expect(formatPrecipitation(0.4)).toBe('0.4 mm');
    expect(formatPrecipitation(3.2)).toBe('3 mm');
  });

  it('formats time in Europe/Oslo', () => {
    // 12:00Z on 1 Jan = 13:00 in Oslo (CET, UTC+1).
    expect(formatHour('2026-01-01T12:00:00Z', 'no')).toContain('13');
    expect(formatWeekday('2026-01-01T12:00:00Z', 'no')).not.toBe(EM_DASH);
    expect(formatHour(null, 'no')).toBe(EM_DASH);
  });

  it('picks the first still-relevant hour', () => {
    const past = hour({ startTime: new Date(Date.now() - 86_400_000).toISOString() });
    const future = hour({ startTime: new Date(Date.now() + 3_600_000).toISOString() });
    expect(currentHour({ ...EMPTY_FORECAST, hours: [past, future] })).toBe(future);
    expect(currentHour(EMPTY_FORECAST)).toBeNull();
  });
});

describe('formatWindDirection', () => {
  it('treats 0 degrees as valid northerly wind', () => {
    expect(formatWindDirection(null, 0, 'no')).toBe('N');
  });
  it('localises the compass abbreviation', () => {
    expect(formatWindDirection(null, 315, 'no')).toBe('NV');
    expect(formatWindDirection(null, 315, 'en')).toBe('NW');
    expect(formatWindDirection(null, 90, 'nl')).toBe('O');
    expect(formatWindDirection(null, 135, 'nl')).toBe('ZO');
    expect(formatWindDirection(null, 225, 'de')).toBe('SW');
    expect(formatWindDirection(null, 90, 'sv')).toBe('O');
  });
  it('falls back to the Google cardinal enum', () => {
    expect(formatWindDirection('NORTH_WEST', null, 'no')).toBe(EM_DASH);
    expect(formatWindDirection('NORTHWEST', null, 'no')).toBe('NV');
    expect(formatWindDirection('SOUTH_SOUTHEAST', null, 'en')).toBe('SE');
  });
  it('renders missing direction as an em dash', () => {
    expect(formatWindDirection(null, null, 'no')).toBe(EM_DASH);
    expect(formatWindDirection('UNSPECIFIED', undefined, 'no')).toBe(EM_DASH);
  });
});

describe('formatWindWithDirection', () => {
  it('combines speed, gust and direction', () => {
    expect(formatWindWithDirection(3, 7, null, 315, 'no')).toBe('3 (7) m/s fra NV');
    expect(formatWindWithDirection(3, null, null, 0, 'en')).toBe('3 m/s from N');
    expect(formatWindWithDirection(3, null, null, null, 'sv')).toBe(`3 m/s från ${EM_DASH}`);
  });
});
