import { promises as fs } from "fs";
import path from "path";
import { blogPaths, getBlogSourceName, isGithubBlogSource } from "./config";
import { githubBlogSource } from "./source-github";
import { opinlyBlogSource } from "./source-opinly";
import type { BlogPost, BlogPostSummary, BlogRoute, BlogSource } from "./types";

export function getBlogSource(): BlogSource {
  return getBlogSourceName() === "github" ? githubBlogSource : opinlyBlogSource;
}

async function readSpanishJson<T>(slug: string, fileName: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(path.join(blogPaths.posts, slug, fileName), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function overlaySummary(post: BlogPostSummary): Promise<BlogPostSummary> {
  const meta = await readSpanishJson<{
    title?: string;
    description?: string;
    titleImage?: BlogPostSummary["titleImage"];
  }>(post.slug, "meta.es.json");
  if (!meta) return post;
  return {
    ...post,
    title: meta.title || post.title,
    description: meta.description || post.description,
    titleImage: post.titleImage
      ? {
          ...post.titleImage,
          alt: meta.titleImage?.alt || post.titleImage.alt,
          title: meta.titleImage?.title || post.titleImage.title,
          caption: meta.titleImage?.caption || post.titleImage.caption,
        }
      : post.titleImage,
  };
}

async function overlayPost(post: BlogPost): Promise<BlogPost> {
  const summary = await overlaySummary(post);
  const meta = await readSpanishJson<{ metaTitle?: string; metaDescription?: string }>(
    post.slug,
    "meta.es.json",
  );
  const content = await readSpanishJson<BlogPost["content"]>(post.slug, "content.es.json");
  return {
    ...post,
    ...summary,
    metaTitle: meta?.metaTitle || post.metaTitle,
    metaDescription: meta?.metaDescription || post.metaDescription,
    content: content || post.content,
  };
}

export async function localizeBlogRoute(route: BlogRoute, locale: string): Promise<BlogRoute> {
  if (locale !== "es") return route;

  if (route.type === "home") {
    return {
      ...route,
      data: {
        ...route.data,
        posts: await Promise.all(route.data.posts.map(overlaySummary)),
      },
    };
  }

  if (route.type === "post") {
    return { ...route, data: await overlayPost(route.data) };
  }

  if (route.type === "category") {
    return {
      ...route,
      data: {
        ...route.data,
        posts: await Promise.all(route.data.posts.map(overlaySummary)),
      },
    };
  }

  if (route.type === "author") {
    return {
      ...route,
      data: {
        ...route.data,
        posts: await Promise.all(route.data.posts.map(overlaySummary)),
      },
    };
  }

  return route;
}

export { getBlogSourceName, isGithubBlogSource, blogSiteConfig } from "./config";
export { generateBlogMetadata } from "./metadata";
export { resolveStructuredData } from "./structured-data";
export type {
  BlogAuthor,
  BlogCategory,
  BlogPost,
  BlogPostSummary,
  BlogRoute,
  BlogSource,
} from "./types";
