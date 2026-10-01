/**
 * Minimal, Node-safe editorial body markup shared by React and prerender:
 * blank-line separated paragraphs, `## ` headings (H2) and `[text](/path/)`
 * internal links. Both renderers consume the same parse, so first HTML and
 * the hydrated view show identical content.
 */
export type Inline = { text: string; href?: string };
export type Block = { type: 'h2' | 'p'; inlines: Inline[] };

const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

export const hasRichMarkup = (body: string): boolean => /^## /m.test(body) || /\[[^\]]+\]\([^)\s]+\)/.test(body);

const parseInlines = (s: string): Inline[] => {
  const out: Inline[] = [];
  let last = 0;
  for (const m of s.matchAll(LINK)) {
    if (m.index! > last) out.push({ text: s.slice(last, m.index) });
    out.push({ text: m[1], href: m[2] });
    last = m.index! + m[0].length;
  }
  if (last < s.length) out.push({ text: s.slice(last) });
  return out;
};

export const parseRichText = (body: string): Block[] =>
  body
    .split(/\n{2,}/)
    .map((c) => c.trim())
    .filter(Boolean)
    .map((c) =>
      c.startsWith('## ')
        ? { type: 'h2' as const, inlines: parseInlines(c.slice(3).trim()) }
        : { type: 'p' as const, inlines: parseInlines(c.replace(/\s*\n\s*/g, ' ')) },
    );

/** Plain text (links flattened) — for word counts and tests. */
export const richTextPlain = (body: string): string =>
  parseRichText(body).map((b) => b.inlines.map((i) => i.text).join('')).join('\n\n');
