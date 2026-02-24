// src/components/seo/JsonLd.tsx
// Reusable component để inject Schema.org JSON-LD

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Inject một hoặc nhiều JSON-LD schema vào <head>
 * 
 * Cách dùng:
 *   <JsonLd data={schemaWebApp()} />
 *   <JsonLd data={[schemaArticle(), schemaBreadcrumb()]} />
 */
export function JsonLd({ data }: JsonLdProps) {
  // Nếu là mảng nhiều schema: embed từng cái riêng để validators dễ parse
  // Nếu là object đơn: embed trực tiếp (chuẩn schema.org)
  if (Array.isArray(data)) {
    return (
      <>
        {data.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </>
    );
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
