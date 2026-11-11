/**
 * Minimal, Node-safe editorial body markup shared by React and prerender:
 * blank-line separated paragraphs, `## ` headings (H2), `[text](/path/)`
 * links (internal, or external when the href starts with https://) and
 * `![alt](key)` image blocks, where `key` names an entry in the entry's
 * `bodyImages` map. Both renderers consume the same parse, so first HTML and
 * the hydrated view show identical content.
 */
export type Inline = { text: string; href?: string };
export type Block =
  | { type: 'h2' | 'p'; inlines: Inline[] }
  | { type: 'img'; key: string; alt: string; inlines: Inline[] };

const IMAGE_BLOCK = /^!\[([^\]]*)\]\(([a-z0-9-]+)\)$/;

/** External link: rendered as a normal <a>, never routed through the SPA. */
export const isExternalHref = (href: string): boolean => /^https?:\/\//i.test(href);

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
    .map((c): Block => {
      const img = IMAGE_BLOCK.exec(c);
      if (img) return { type: 'img', key: img[2], alt: img[1], inlines: [] };
      return c.startsWith('## ')
        ? { type: 'h2', inlines: parseInlines(c.slice(3).trim()) }
        : { type: 'p', inlines: parseInlines(c.replace(/\s*\n\s*/g, ' ')) };
    });

/** Plain text (links flattened) — for word counts and tests. */
export const richTextPlain = (body: string): string =>
  parseRichText(body).map((b) => b.inlines.map((i) => i.text).join('')).join('\n\n');
