import { listSitePages, readSiteHtml } from "@/lib/site-pages";
import { opinly } from "@/lib/opinly";

export async function generateStaticParams() {
  const pages = await listSitePages();

  return pages.map((slug) => ({ slug }));
}

type RouteContext = {
  params: Promise<{ slug?: string[] }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const html = await readSiteHtml(slug ?? []);

  if (html) {
    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=0, must-revalidate",
      },
    });
  }

  // Opinly posts are served under /blog; send matching root slugs there.
  if (slug?.length === 1) {
    const post = await opinly.post(slug[0]);
    if (post) {
      return Response.redirect(new URL(`/blog/${slug[0]}/`, request.url), 308);
    }
  }

  return new Response("Not Found", { status: 404 });
}
