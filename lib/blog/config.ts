import path from "path";

export type BlogSourceName = "opinly" | "github";

const BLOG_ROOT = path.join(process.cwd(), "content", "blog");
const BLOG_POSTS_DIR = path.join(BLOG_ROOT, "posts");
const BLOG_AUTHORS_FILE = path.join(BLOG_ROOT, "authors", "authors.json");
const BLOG_CATEGORIES_FILE = path.join(BLOG_ROOT, "categories", "categories.json");
const BLOG_IMAGES_PUBLIC_DIR = path.join(process.cwd(), "public", "blog-images");

export const blogSiteConfig = {
  siteUrl: "https://www.reddydentalfl.com",
  siteName: "Reddy Dental",
  blogPrefix: "/blog",
  categoryPrefix: "category",
  authorPrefix: "authors",
  tagPrefix: "tag",
  imagesPrefix: "/blog-images",
};

export function getBlogSourceName(): BlogSourceName {
  const value = process.env.BLOG_SOURCE?.trim().toLowerCase();
  return value === "github" ? "github" : "opinly";
}

export function isGithubBlogSource(): boolean {
  return getBlogSourceName() === "github";
}

export const blogPaths = {
  root: BLOG_ROOT,
  posts: BLOG_POSTS_DIR,
  authorsFile: BLOG_AUTHORS_FILE,
  categoriesFile: BLOG_CATEGORIES_FILE,
  publicImages: BLOG_IMAGES_PUBLIC_DIR,
};
