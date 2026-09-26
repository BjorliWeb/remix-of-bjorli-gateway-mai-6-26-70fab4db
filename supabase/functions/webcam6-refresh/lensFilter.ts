// Deterministic lens classifier for the Reolink Duo on webcam.io P4dKmP.
// Left lens = chair-lift roof top-left + lift mast near centre (approved).
// Right lens = open valley view (never published).
// Pure functions on decoded RGBA pixels so the same code runs in Deno and in local tests.

export const GRID_W = 32;
export const GRID_H = 18;

export interface LensFeatures {
  descriptor: number[];
  roofRatio: number; // roof-box luminance / sky-box luminance (low = dark roof present)
  mastContrast: number; // mast column darkness vs neighbours (high = mast present)
  meanLuma: number;
}

export interface LensDecision {
  approved: boolean;
  reason: string;
  scoreLeft: number;
  scoreRight: number;
  roofRatio: number;
  mastContrast: number;
}

export const THRESHOLDS = {
  minScoreLeft: 0.55,
  minMargin: 0.25,
  maxRoofRatio: 0.7,
  minMastContrast: 0.04,
  minMeanLuma: 25, // too dark = no reliable structure
};

const luma = (d: Uint8Array | Uint8ClampedArray, i: number) =>
  0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];

/** Box-average the image into a gw x gh luminance grid. */
export function lumaGrid(data: Uint8Array | Uint8ClampedArray, w: number, h: number, gw: number, gh: number) {
  const sums = new Float64Array(gw * gh);
  const counts = new Float64Array(gw * gh);
  const step = Math.max(1, Math.floor(Math.min(w / gw, h / gh) / 4));
  for (let y = 0; y < h; y += step) {
    const gy = Math.min(gh - 1, Math.floor((y * gh) / h));
    for (let x = 0; x < w; x += step) {
      const gx = Math.min(gw - 1, Math.floor((x * gw) / w));
      const k = gy * gw + gx;
      sums[k] += luma(data, (y * w + x) * 4);
      counts[k] += 1;
    }
  }
  return Array.from(sums, (s, k) => (counts[k] ? s / counts[k] : 0));
}

function boxMean(grid: number[], gw: number, gh: number, x0: number, x1: number, y0: number, y1: number) {
  let s = 0;
  let n = 0;
  for (let y = Math.floor(y0 * gh); y < Math.ceil(y1 * gh); y++) {
    for (let x = Math.floor(x0 * gw); x < Math.ceil(x1 * gw); x++) {
      s += grid[y * gw + x];
      n++;
    }
  }
  return n ? s / n : 0;
}

export function extractFeatures(data: Uint8Array | Uint8ClampedArray, w: number, h: number): LensFeatures {
  // Structure descriptor: gradient magnitude on a coarse grid, normalised so
  // overall brightness/contrast (sun, fog, dusk) matters little.
  const g = lumaGrid(data, w, h, GRID_W + 1, GRID_H + 1);
  const gw = GRID_W + 1;
  const desc: number[] = [];
  for (let y = 0; y < GRID_H; y++) {
    for (let x = 0; x < GRID_W; x++) {
      const c = g[y * gw + x];
      desc.push(Math.hypot(g[y * gw + x + 1] - c, g[(y + 1) * gw + x] - c));
    }
  }
  const mean = desc.reduce((a, b) => a + b, 0) / desc.length;
  let norm = 0;
  for (let i = 0; i < desc.length; i++) {
    desc[i] -= mean;
    norm += desc[i] * desc[i];
  }
  norm = Math.sqrt(norm) || 1;
  for (let i = 0; i < desc.length; i++) desc[i] /= norm;

  // Region checks on a finer grid.
  const fw = 64;
  const fh = 36;
  const f = lumaGrid(data, w, h, fw, fh);
  const roof = boxMean(f, fw, fh, 0.03, 0.28, 0.03, 0.14);
  const sky = boxMean(f, fw, fh, 0.55, 0.85, 0.03, 0.14);
  const mast = boxMean(f, fw, fh, 0.62, 0.67, 0.35, 0.6);
  const sides = (boxMean(f, fw, fh, 0.55, 0.6, 0.35, 0.6) + boxMean(f, fw, fh, 0.7, 0.75, 0.35, 0.6)) / 2;
  const meanLuma = f.reduce((a, b) => a + b, 0) / f.length;

  return {
    descriptor: desc,
    roofRatio: sky > 1 ? roof / sky : 1,
    mastContrast: sides > 1 ? (sides - mast) / sides : 0,
    meanLuma,
  };
}

const dot = (a: number[], b: number[]) => {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
};

export function buildTemplate(descriptors: number[][]): number[] {
  const t = new Array(descriptors[0].length).fill(0);
  for (const d of descriptors) for (let i = 0; i < d.length; i++) t[i] += d[i];
  const n = Math.sqrt(dot(t, t)) || 1;
  return t.map((v) => v / n);
}

export function classify(
  feat: LensFeatures,
  leftTemplate: number[],
  rightTemplate: number[],
  th = THRESHOLDS,
): LensDecision {
  const scoreLeft = dot(feat.descriptor, leftTemplate);
  const scoreRight = dot(feat.descriptor, rightTemplate);
  const base = { scoreLeft, scoreRight, roofRatio: feat.roofRatio, mastContrast: feat.mastContrast };
  if (feat.meanLuma < th.minMeanLuma) return { approved: false, reason: 'too_dark', ...base };
  if (scoreLeft < th.minScoreLeft) return { approved: false, reason: 'low_left_score', ...base };
  if (scoreLeft - scoreRight < th.minMargin) return { approved: false, reason: 'low_margin', ...base };
  if (feat.roofRatio > th.maxRoofRatio) return { approved: false, reason: 'roof_not_found', ...base };
  if (feat.mastContrast < th.minMastContrast) return { approved: false, reason: 'mast_not_found', ...base };
  return { approved: true, reason: 'left_lens', ...base };
}
