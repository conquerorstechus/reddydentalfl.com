import type { MetadataRoute } from "next";
import { getBlogSource } from "@/lib/blog";
import { absoluteSiteUrl } from "@/lib/site-origin";
import { listSitePages } from "@/lib/site-pages";

/** React routes that are indexable and are not stored as content HTML. */
const INDEXABLE_APP_PATHS = [
  "/offers/call-us/",
  "/offers/dental-clinic/",
  "/offers/no-insurance/",
  "/privacy/",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await listSitePages();
  const urls = new Map<string, MetadataRoute.Sitemap[number]>();

  for (const slug of pages) {
    // /blog is rendered by the App Router, not the static HTML copies.
    if (slug[0] === "blog") continue;
    const path = slug.length === 0 ? "/" : `/${slug.join("/")}/`;
    urls.set(path, { url: absoluteSiteUrl(path) });
  }

  urls.set("/blog/", { url: absoluteSiteUrl("/blog/") });

  for (const path of INDEXABLE_APP_PATHS) {
    urls.set(path, { url: absoluteSiteUrl(path) });
  }

  const home = await getBlogSource().loadRoute([]);
  if (home.type === "home") {
    for (const post of home.data.posts) {
      urls.set(`/blog/${post.slug}/`, {
        url: absoluteSiteUrl(`/blog/${post.slug}/`),
        lastModified: post.modifiedAt,
      });
    }
  }

  return [...urls.values()];
}
