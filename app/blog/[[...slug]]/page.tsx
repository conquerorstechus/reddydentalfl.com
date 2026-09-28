import type { ResolvingMetadata } from "next";
import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { BlogAuthorView, BlogAuthorsView } from "@/components/blog-author-view";
import { BlogCategoryView } from "@/components/blog-category-view";
import { BlogIndexView } from "@/components/blog-index-view";
import { BlogPostView } from "@/components/blog-post-view";
import {
  generateBlogMetadata,
  getBlogSource,
  isGithubBlogSource,
  localizeBlogRoute,
} from "@/lib/blog";

export const revalidate = 3600;

type BlogPageProps = { params: Promise<{ slug?: string[] }> };

export async function generateStaticParams() {
  if (!isGithubBlogSource()) return [];
  const source = getBlogSource();
  return source.listStaticParams();
}

export const generateMetadata = async (
  props: BlogPageProps,
  parent: ResolvingMetadata,
) => {
  const { slug } = await props.params;
  const locale = await getLocale();
  const route = await localizeBlogRoute(
    await getBlogSource().loadRoute(slug ?? []),
    locale,
  );
  if (route.type === "not-found") return {};
  return generateBlogMetadata(route, parent);
};

export default async function BlogPage(props: BlogPageProps) {
  const { slug } = await props.params;
  const locale = await getLocale();
  const route = await localizeBlogRoute(
    await getBlogSource().loadRoute(slug ?? []),
    locale,
  );

  switch (route.type) {
    case "home":
      return (
        <BlogIndexView
          posts={route.data.posts}
          categories={route.data.categories}
        />
      );
    case "post":
      return <BlogPostView post={route.data} />;
    case "category":
      return <BlogCategoryView category={route.data} />;
    case "author":
      return <BlogAuthorView author={route.data} />;
    case "authors":
      return <BlogAuthorsView authors={route.data} />;
    default:
      notFound();
  }
}
