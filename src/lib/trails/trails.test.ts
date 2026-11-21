import { describe, it, expect } from 'vitest';
import { TRAILS, profileFor, segmentsFor, gpxFor, gpxFilename, trailId } from './trails';

describe('owner-supplied Bjorli routes', () => {
  it('contains exactly the eight supplied routes and lengths', () => {
    expect(TRAILS.map(t => [t.name, t.lengthKm])).toEqual([['Bakkeløypa',5.44],['Brøstdalsløypa',14.67],['Einbuløypa',11.51],['Fjelløypa',8.52],['Lysløypa',2.16],['Morkenløypa',7.79],['Nystuguberget',6.95],['Rånåkollen rundt',13.68]]);
  });
  it('keeps supplied elevation totals rather than recalculating them', () => {
    expect(TRAILS.map(t => [t.ascent,t.descent,t.ascentReverse,t.descentReverse])).toEqual([[67,69,65,67],[236,235,230,229],[315,314,318,318],[596,37,37,595],[40,41,42,40],[122,122,123,123],[184,183,180,180],[250,250,246,247]]);
  });
  it('reverses points and distances without mutating source', () => {
    for (const t of TRAILS) {
      const before = JSON.stringify(t.points);
      const reverse = profileFor(t,true);
      expect(reverse[0].slice(0,3)).toEqual(t.points.at(-1)?.slice(0,3));
      expect(reverse[0][3]).toBe(0);
      expect(reverse.at(-1)?.[3]).toBe(t.points.at(-1)?.[3]);
      expect(JSON.stringify(t.points)).toBe(before);
      expect(profileFor({...t,points:reverse},true)).toEqual(t.points);
    }
  });
  it('preserves the Fjelløypa gap in both chart and GPX directions', () => {
    const t = TRAILS.find(t => t.name === 'Fjelløypa');
    if (!t) throw new Error('Missing Fjelløypa');
    for (const reverse of [false,true]) {
      expect(segmentsFor(profileFor(t,reverse))).toHaveLength(2);
      expect(gpxFor(t,reverse).match(/<trkseg>/g)).toHaveLength(2);
      expect(gpxFor(t,reverse).match(/<trkpt /g)).toHaveLength(484);
    }
  });
  it('uses the supplied points and elevation in every GPX', () => {
    for (const t of TRAILS) {
      expect(gpxFor(t).match(/<trkpt /g)).toHaveLength(t.points.length);
      const p = t.points[0];
      expect(gpxFor(t)).toContain(`lat="${p[0].toFixed(6)}" lon="${p[1].toFixed(6)}"><ele>${p[2].toFixed(1)}</ele>`);
    }
  });
  it('keeps stable deep links and distinct reverse downloads', () => {
    expect(trailId('Fjelløypa')).toBe('loype-fjelloypa');
    expect(gpxFilename(TRAILS[3])).toBe('bjorli-fjelloypa.gpx');
    expect(gpxFilename(TRAILS[3],true)).toBe('bjorli-fjelloypa-motsatt.gpx');
  });
});
