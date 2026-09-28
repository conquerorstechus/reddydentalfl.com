import { cookies } from "next/headers";
import { getBlogSource } from "@/lib/blog";
import { isAppLocale, LOCALE_COOKIE } from "@/i18n/routing";
import { listSitePages, readSiteHtml } from "@/lib/site-pages";

export async function generateStaticParams() {
  const pages = await listSitePages();

  return pages.map((slug) => ({ slug }));
}

type RouteContext = {
  params: Promise<{ slug?: string[] }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const origin = new URL(request.url).origin;
  const store = await cookies();
  const requested = store.get(LOCALE_COOKIE)?.value;
  const locale = isAppLocale(requested) ? requested : "en";
  const html = await readSiteHtml(slug ?? [], origin, locale);

  if (html) {
    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=0, must-revalidate",
      },
    });
  }

  // Blog posts are served under /blog; send matching root slugs there.
  if (slug?.length === 1) {
    const post = await getBlogSource().getPostBySlug(slug[0]);
    if (post) {
      return Response.redirect(new URL(`/blog/${slug[0]}/`, request.url), 308);
    }
  }

  return new Response("Not Found", { status: 404 });
}
