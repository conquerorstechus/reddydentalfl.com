import { getBlogSourceName, isGithubBlogSource } from "./config";
import { githubBlogSource } from "./source-github";
import { opinlyBlogSource } from "./source-opinly";
import type { BlogSource } from "./types";

export function getBlogSource(): BlogSource {
  return getBlogSourceName() === "github" ? githubBlogSource : opinlyBlogSource;
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
