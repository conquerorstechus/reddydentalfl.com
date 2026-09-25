import type { Metadata, ResolvingMetadata } from "next";
import type { BlogRoute } from "./types";
import { blogSiteConfig } from "./config";

function resolveTitle(route: BlogRoute): string {
  switch (route.type) {
    case "post":
      return route.data.metaTitle || route.data.title;
    case "category":
      return route.data.title;
    case "author":
      return route.data.name;
    case "authors":
      return "Authors";
    case "home":
    default:
      return "Reddy Dental Blog";
  }
}

function resolveDescription(route: BlogRoute): string | undefined {
  switch (route.type) {
    case "post":
      return route.data.metaDescription || route.data.description || undefined;
    case "category":
      return route.data.description || undefined;
    case "author":
      return route.data.bio || undefined;
    default:
      return undefined;
  }
}

function resolveOgImage(route: BlogRoute, title: string) {
  if (route.type === "post" && route.data.titleImage?.src) {
    return {
      url: route.data.titleImage.src,
      width: 1200,
      height: 630,
      alt: route.data.titleImage.alt || title,
    };
  }

  return {
    url: "/og-image.jpg",
    width: 1200,
    height: 630,
    alt: title,
  };
}

export async function generateBlogMetadata(
  route: BlogRoute,
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  if (route.type === "not-found") return {};

  const title = resolveTitle(route);
  const description = resolveDescription(route);
  const image = resolveOgImage(route, title);
  const canonicalPath =
    route.type === "post"
      ? `${blogSiteConfig.blogPrefix}/${route.data.slug}/`
      : route.type === "category"
        ? `${blogSiteConfig.blogPrefix}/${blogSiteConfig.categoryPrefix}/${route.data.slug}/`
        : route.type === "author"
          ? `${blogSiteConfig.blogPrefix}/${blogSiteConfig.authorPrefix}/${route.data.slug}/`
          : route.type === "authors"
            ? `${blogSiteConfig.blogPrefix}/${blogSiteConfig.authorPrefix}/`
            : `${blogSiteConfig.blogPrefix}/`;

  return {
    title,
    ...(description ? { description } : {}),
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: route.type === "post" ? "article" : "website",
      siteName: blogSiteConfig.siteName,
      locale: "en_US",
      title,
      ...(description ? { description } : {}),
      url: canonicalPath,
      images: [image],
      ...(route.type === "post"
        ? {
            publishedTime: route.data.firstPublishedAt,
            modifiedTime: route.data.modifiedAt,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      ...(description ? { description } : {}),
      images: [image.url],
    },
  };
}
