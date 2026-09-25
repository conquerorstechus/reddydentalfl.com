import type { CategorySummary, FullPost, Post } from "@opinly/backend";
import { opinlyConfig } from "@opinly/next";
import type { OpinlyNode } from "@opinly/shared";
import { opinly } from "@/lib/opinly";
import { blogSiteConfig } from "./config";
import type {
  BlogAuthor,
  BlogCategory,
  BlogPost,
  BlogPostSummary,
  BlogRoute,
  BlogSource,
} from "./types";

const categoryPrefix = opinlyConfig.categoryPrefix ?? blogSiteConfig.categoryPrefix;
const authorPrefix = opinlyConfig.authorPrefix ?? blogSiteConfig.authorPrefix;

type OpinlyAuthorsList = Awaited<ReturnType<typeof opinly.authors>>["data"];
type OpinlyAuthorListItem = OpinlyAuthorsList[number];

function mapPostSummary(post: Post): BlogPostSummary {
  const image = post.image;
  return {
    slug: post.slug,
    title: post.title,
    description: post.description,
    firstPublishedAt: post.firstPublishedAt,
    modifiedAt: post.lastPublishedAt,
    author: post.author?.slug ?? null,
    category: post.category?.slug ?? null,
    tags: post.tags?.map((tag) => tag.slug) ?? [],
    titleImage: image?.fileKey
      ? {
          src: `${opinlyConfig.imagesPrefix}/${image.fileKey.replace(/^\/+/, "")}`,
          alt: image.alt ?? null,
          title: image.title ?? null,
          caption: image.caption ?? null,
        }
      : null,
  };
}

function mapFullPost(post: FullPost): BlogPost {
  const titleImage = post.titleFile?.fileKey
    ? {
        src: `${opinlyConfig.imagesPrefix}/${post.titleFile.fileKey.replace(/^\/+/, "")}`,
        alt: post.titleFile.altText ?? null,
        title: post.titleFile.title ?? null,
        caption: post.titleFile.caption ?? null,
      }
    : null;

  return {
    slug: post.slug,
    title: post.title,
    description: post.description,
    firstPublishedAt: post.firstPublishedAt,
    modifiedAt: post.modifiedAt,
    author: post.author?.slug ?? null,
    category: post.category?.slug ?? null,
    tags: post.tags?.map((tag) => tag.slug) ?? [],
    titleImage,
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
    content: post.content as OpinlyNode,
    faqs: post.faqs ?? null,
    structuredData: null,
  };
}

async function loadRoute(slug: string[]): Promise<BlogRoute> {
  if (slug.length === 0) {
    const [posts, categories] = await Promise.all([
      opinly.posts({ limit: 100 }),
      opinly.categories(),
    ]);
    return {
      type: "home",
      data: {
        posts: posts.data.map(mapPostSummary),
        categories: categories.map((category: CategorySummary) => ({
          slug: category.slug,
          title: category.title,
          description: category.description,
        })),
      },
    };
  }

  if (slug[0] === categoryPrefix && slug[1]) {
    const [categories, list] = await Promise.all([
      opinly.categories(),
      opinly.posts({ category: slug[1] }),
    ]);
    const meta = categories.find(
      (category: CategorySummary) => category.slug === slug[1],
    );
    if (!meta) return { type: "not-found" };
    return {
      type: "category",
      data: {
        slug: meta.slug,
        title: meta.title,
        description: meta.description,
        name: meta.title,
        posts: list.data.map(mapPostSummary),
      },
    };
  }

  if (slug[0] === authorPrefix) {
    const authorSlug = slug[1];
    if (!authorSlug) {
      const authors = await opinly.authors();
      return {
        type: "authors",
        data: authors.data.map((author: OpinlyAuthorListItem) => ({
          slug: author.slug,
          name: author.name,
          bio: author.bio,
          image: author.image?.fileKey
            ? `${opinlyConfig.imagesPrefix}/${author.image.fileKey.replace(/^\/+/, "")}`
            : null,
        })),
      };
    }

    const author = await opinly.author(authorSlug);
    if (author.type !== "author") return { type: "not-found" };
    return {
      type: "author",
      data: {
        slug: author.data.slug,
        name: author.data.name,
        bio: author.data.bio,
        image: author.data.image?.fileKey
          ? `${opinlyConfig.imagesPrefix}/${author.data.image.fileKey.replace(/^\/+/, "")}`
          : null,
        posts: author.data.posts.map(mapPostSummary),
      },
    };
  }

  if (slug.length !== 1) return { type: "not-found" };

  const post = await opinly.post(slug[0]);
  return post ? { type: "post", data: mapFullPost(post) } : { type: "not-found" };
}

async function listStaticParams(): Promise<{ slug: string[] }[]> {
  return [];
}

async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const post = await opinly.post(slug);
  return post ? mapFullPost(post) : null;
}

export const opinlyBlogSource: BlogSource = {
  loadRoute,
  listStaticParams,
  getPostBySlug,
};
