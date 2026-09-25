import {
  buildBlogPostingJsonLd,
  buildFaqJsonLd,
  type OpinlyNode,
} from "@opinly/shared";
import { blogSiteConfig } from "./config";
import type { BlogPost, BlogStructuredData } from "./types";

function opinlyImageConfig(imagesPrefix: string) {
  return {
    imagesPrefix,
    siteUrl: blogSiteConfig.siteUrl,
    blogPrefix: blogSiteConfig.blogPrefix,
    siteName: blogSiteConfig.siteName,
  };
}

export function buildStructuredDataForPost(post: BlogPost): BlogStructuredData {
  const titleImageKey = post.titleImage?.src
    ? post.titleImage.src.replace(/^\/blog-images\//, "")
    : null;

  const structured: BlogStructuredData = {
    blogPosting: buildBlogPostingJsonLd(
      {
        title: post.title,
        description: post.description,
        content: post.content as OpinlyNode,
        firstPublishedAt: post.firstPublishedAt,
        modifiedAt: post.modifiedAt,
        author: post.author ? { name: post.author } : null,
        imageFileKey: titleImageKey,
      },
      opinlyImageConfig(blogSiteConfig.imagesPrefix),
    ) as unknown as Record<string, unknown>,
  };

  if (post.faqs?.length) {
    structured.faq = buildFaqJsonLd(post.faqs) as unknown as Record<string, unknown>;
  }

  return structured;
}

export function resolveStructuredData(post: BlogPost): BlogStructuredData {
  if (post.structuredData) {
    return post.structuredData;
  }
  return buildStructuredDataForPost(post);
}
