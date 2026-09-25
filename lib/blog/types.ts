import type { OpinlyNode } from "@opinly/shared";

export interface BlogFaq {
  question: string;
  answer: string;
}

export interface BlogTitleImage {
  src: string;
  alt?: string | null;
  title?: string | null;
  caption?: string | null;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  firstPublishedAt: string;
  modifiedAt: string;
  draft?: boolean;
  author?: string | null;
  category?: string | null;
  tags?: string[];
  titleImage?: BlogTitleImage | null;
  faqs?: BlogFaq[] | null;
}

export interface BlogPostSummary {
  slug: string;
  title: string;
  description: string;
  firstPublishedAt: string;
  modifiedAt: string;
  author?: string | null;
  category?: string | null;
  tags?: string[];
  titleImage?: BlogTitleImage | null;
}

export interface BlogPost extends BlogPostSummary {
  metaTitle: string | null;
  metaDescription: string | null;
  content: OpinlyNode;
  faqs: BlogFaq[] | null;
  structuredData: BlogStructuredData | null;
}

export interface BlogStructuredData {
  blogPosting?: Record<string, unknown>;
  faq?: Record<string, unknown>;
}

export interface BlogCategory {
  slug: string;
  title: string;
  description?: string | null;
}

export interface BlogAuthor {
  slug: string;
  name: string;
  bio?: string | null;
  image?: string | null;
}

export interface BlogCategoryView extends BlogCategory {
  name: string;
  posts: BlogPostSummary[];
}

export interface BlogAuthorView extends BlogAuthor {
  posts: BlogPostSummary[];
}

export type BlogRoute =
  | { type: "home"; data: { posts: BlogPostSummary[]; categories: BlogCategory[] } }
  | { type: "post"; data: BlogPost }
  | { type: "category"; data: BlogCategoryView }
  | { type: "author"; data: BlogAuthorView }
  | { type: "authors"; data: BlogAuthor[] }
  | { type: "not-found" };

export interface BlogSource {
  loadRoute(slug: string[]): Promise<BlogRoute>;
  listStaticParams(): Promise<{ slug: string[] }[]>;
  getPostBySlug(slug: string): Promise<BlogPost | null>;
}
