import { promises as fs } from "fs";
import path from "path";
import type { OpinlyNode } from "@opinly/shared";
import { blogPaths, blogSiteConfig } from "./config";
import type {
  BlogAuthor,
  BlogCategory,
  BlogPost,
  BlogPostMeta,
  BlogPostSummary,
  BlogRoute,
  BlogSource,
  BlogStructuredData,
} from "./types";

type AuthorsRegistry = { authors: BlogAuthor[] };
type CategoriesRegistry = { categories: BlogCategory[] };

function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function listPostSlugs(): Promise<string[]> {
  try {
    const entries = await fs.readdir(blogPaths.posts, { withFileTypes: true });
    return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  } catch {
    return [];
  }
}

async function readAuthorsRegistry(): Promise<BlogAuthor[]> {
  const registry = await readJsonFile<AuthorsRegistry>(blogPaths.authorsFile);
  return registry?.authors ?? [];
}

async function readCategoriesRegistry(): Promise<BlogCategory[]> {
  const registry = await readJsonFile<CategoriesRegistry>(blogPaths.categoriesFile);
  return registry?.categories ?? [];
}

function toSummary(meta: BlogPostMeta): BlogPostSummary {
  return {
    slug: meta.slug,
    title: meta.title,
    description: meta.description,
    firstPublishedAt: meta.firstPublishedAt,
    modifiedAt: meta.modifiedAt,
    author: meta.author ?? null,
    category: meta.category ?? null,
    tags: meta.tags ?? [],
    titleImage: meta.titleImage ?? null,
  };
}

async function readPostMeta(slug: string): Promise<BlogPostMeta | null> {
  const metaPath = path.join(blogPaths.posts, slug, "meta.json");
  const meta = await readJsonFile<BlogPostMeta>(metaPath);
  if (!meta) return null;
  return { ...meta, slug: meta.slug || slug };
}

async function readPost(slug: string): Promise<BlogPost | null> {
  const meta = await readPostMeta(slug);
  if (!meta || meta.draft) return null;

  const contentPath = path.join(blogPaths.posts, slug, "content.json");
  const content = await readJsonFile<OpinlyNode>(contentPath);
  if (!content) return null;

  const structuredData = await readJsonFile<BlogStructuredData>(
    path.join(blogPaths.posts, slug, "structured-data.json"),
  );

  const summary = toSummary(meta);

  return {
    ...summary,
    metaTitle: meta.metaTitle ?? null,
    metaDescription: meta.metaDescription ?? null,
    content,
    faqs: meta.faqs ?? null,
    structuredData,
  };
}

async function listPublishedPosts(): Promise<BlogPostSummary[]> {
  const slugs = await listPostSlugs();
  const posts: BlogPostSummary[] = [];

  for (const slug of slugs) {
    const meta = await readPostMeta(slug);
    if (!meta || meta.draft) continue;
    posts.push(toSummary(meta));
  }

  return posts.sort(
    (a, b) =>
      new Date(b.firstPublishedAt).getTime() - new Date(a.firstPublishedAt).getTime(),
  );
}

function mergeCategories(
  registry: BlogCategory[],
  posts: BlogPostSummary[],
): BlogCategory[] {
  const map = new Map<string, BlogCategory>();

  for (const category of registry) {
    map.set(category.slug, category);
  }

  for (const post of posts) {
    if (!post.category) continue;
    if (!map.has(post.category)) {
      map.set(post.category, {
        slug: post.category,
        title: slugToTitle(post.category),
      });
    }
  }

  return Array.from(map.values()).sort((a, b) => a.title.localeCompare(b.title));
}

function mergeAuthors(registry: BlogAuthor[], posts: BlogPostSummary[]): BlogAuthor[] {
  const map = new Map<string, BlogAuthor>();

  for (const author of registry) {
    map.set(author.slug, author);
  }

  for (const post of posts) {
    if (!post.author) continue;
    if (!map.has(post.author)) {
      map.set(post.author, {
        slug: post.author,
        name: slugToTitle(post.author),
      });
    }
  }

  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

async function loadRoute(slug: string[]): Promise<BlogRoute> {
  const posts = await listPublishedPosts();
  const categories = mergeCategories(await readCategoriesRegistry(), posts);
  const authors = mergeAuthors(await readAuthorsRegistry(), posts);

  if (slug.length === 0) {
    return { type: "home", data: { posts, categories } };
  }

  if (slug[0] === blogSiteConfig.categoryPrefix) {
    const categorySlug = slug[1];
    if (!categorySlug) return { type: "not-found" };
    const category = categories.find((item) => item.slug === categorySlug);
    if (!category) return { type: "not-found" };
    const categoryPosts = posts.filter((post) => post.category === categorySlug);
    return {
      type: "category",
      data: { ...category, name: category.title, posts: categoryPosts },
    };
  }

  if (slug[0] === blogSiteConfig.authorPrefix) {
    const authorSlug = slug[1];
    if (!authorSlug) {
      return { type: "authors", data: authors };
    }
    const author = authors.find((item) => item.slug === authorSlug);
    if (!author) return { type: "not-found" };
    const authorPosts = posts.filter((post) => post.author === authorSlug);
    return {
      type: "author",
      data: { ...author, posts: authorPosts },
    };
  }

  if (slug.length !== 1) return { type: "not-found" };

  const post = await readPost(slug[0]);
  return post ? { type: "post", data: post } : { type: "not-found" };
}

async function listStaticParams(): Promise<{ slug: string[] }[]> {
  const posts = await listPublishedPosts();
  const categories = mergeCategories(await readCategoriesRegistry(), posts);
  const authors = mergeAuthors(await readAuthorsRegistry(), posts);
  const params: { slug: string[] }[] = [{ slug: [] }];

  for (const post of posts) {
    params.push({ slug: [post.slug] });
  }

  for (const category of categories) {
    params.push({
      slug: [blogSiteConfig.categoryPrefix, category.slug],
    });
  }

  params.push({ slug: [blogSiteConfig.authorPrefix] });

  for (const author of authors) {
    params.push({
      slug: [blogSiteConfig.authorPrefix, author.slug],
    });
  }

  return params;
}

export const githubBlogSource: BlogSource = {
  loadRoute,
  listStaticParams,
  getPostBySlug: readPost,
};
