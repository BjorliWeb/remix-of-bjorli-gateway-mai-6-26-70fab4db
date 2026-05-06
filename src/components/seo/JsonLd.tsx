/**
 * JsonLd — renders a single schema.org JSON-LD block.
 *
 * Use one component per logical entity. Multiple JsonLd components on a
 * page are fine and recommended (Organization + WebPage + FAQPage + …).
 *
 * In Next.js this maps 1:1 to a <script type="application/ld+json"> emitted
 * from `generateMetadata` or a server component, so the API mirrors the
 * future production behaviour.
 */
interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
  /** Optional id — useful when the same page mounts/unmounts the same schema. */
  id?: string;
}

const JsonLd = ({ data, id }: JsonLdProps) => (
  <script
    type="application/ld+json"
    {...(id ? { id } : {})}
    // eslint-disable-next-line react/no-danger
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);

export default JsonLd;