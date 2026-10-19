import { dentistSchemaId } from "@/lib/dentist-schema";
import { blogSiteConfig } from "./config";
import type { BlogPost, BlogStructuredData } from "./types";

export function buildStructuredDataForPost(post: BlogPost): BlogStructuredData {
  const url = `${blogSiteConfig.siteUrl}${blogSiteConfig.blogPrefix}/${post.slug}/`;
  const image = post.titleImage?.src
    ? post.titleImage.src.startsWith("http")
      ? post.titleImage.src
      : `${blogSiteConfig.siteUrl}${post.titleImage.src}`
    : null;

  const structured: BlogStructuredData = {
    blogPosting: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.firstPublishedAt,
      dateModified: post.modifiedAt,
      mainEntityOfPage: url,
      url,
      author: {
        "@type": post.author ? "Person" : "Organization",
        name: post.author || blogSiteConfig.siteName,
      },
      publisher: {
        "@type": "Dentist",
        "@id": dentistSchemaId(blogSiteConfig.siteUrl),
        name: blogSiteConfig.siteName,
        url: blogSiteConfig.siteUrl,
      },
      ...(image ? { image } : {}),
    },
  };

  if (post.faqs?.length) {
    structured.faq = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: post.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    };
  }

  return structured;
}

export function resolveStructuredData(post: BlogPost): BlogStructuredData {
  if (post.structuredData) {
    return post.structuredData;
  }
  return buildStructuredDataForPost(post);
}
