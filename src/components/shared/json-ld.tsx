interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * Structured data for search engines. Escapes "<" so content such as "</script>" cannot break
 * out of the script tag.
 */
export function JsonLd({ data }: JsonLdProps) {
  const serialised = JSON.stringify(data).replace(/</g, '\\u003c');

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serialised }} />;
}
