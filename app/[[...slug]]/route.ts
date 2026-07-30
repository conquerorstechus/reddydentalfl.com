import { listSitePages, readSiteHtml } from "@/lib/site-pages";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const pages = await listSitePages();

  return pages.map((slug) => ({ slug }));
}

type RouteContext = {
  params: Promise<{ slug?: string[] }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const html = await readSiteHtml(slug ?? []);

  if (!html) {
    return new Response("Not Found", { status: 404 });
  }

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
