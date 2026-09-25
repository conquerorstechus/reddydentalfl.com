import type { BlogStructuredData } from "@/lib/blog/types";

export function BlogJsonLd({ data }: { data: BlogStructuredData }) {
  const blocks = [data.blogPosting, data.faq].filter(Boolean);

  return (
    <>
      {blocks.map((block, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
}
