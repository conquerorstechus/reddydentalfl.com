import { promises as fs } from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content");
const SITE_URL = "https://reddydentalfl.com";
const SITE_NAME = "Reddy Dental";
const OG_IMAGE_URL = `${SITE_URL}/og-image.jpg`;
const DEFAULT_TITLE = "Dentist Near Me in St. Petersburg, FL | Reddy Dental";
const DEFAULT_DESCRIPTION =
  "Reddy Dental is a dentist near me located in St. Petersburg, FL 33707 for all your family and cosmetic dentistry needs.";

export async function listSitePages(): Promise<string[][]> {
  const pages: string[][] = [];

  async function walk(dir: string, segments: string[]) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const hasIndex = entries.some(
      (entry) => entry.isFile() && entry.name === "index.html",
    );

    if (hasIndex) {
      pages.push(segments);
    }

    for (const entry of entries) {
      if (entry.isDirectory()) {
        await walk(path.join(dir, entry.name), [...segments, entry.name]);
      }
    }
  }

  await walk(CONTENT_DIR, []);
  return pages;
}

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function extractTitle(html: string): string {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!match) return DEFAULT_TITLE;
  const title = match[1].replace(/\s+/g, " ").trim();
  return title || DEFAULT_TITLE;
}

function extractDescription(html: string): string {
  const namedContent = html.match(
    /<meta\s+name=["']description["']\s+content=["']([^"']*)["'][^>]*>/i,
  );
  if (namedContent?.[1]) return namedContent[1].trim();

  const contentNamed = html.match(
    /<meta\s+content=["']([^"']*)["']\s+name=["']description["'][^>]*>/i,
  );
  if (contentNamed?.[1]) return contentNamed[1].trim();

  return DEFAULT_DESCRIPTION;
}

function buildCanonicalUrl(slug: string[]): string {
  if (slug.length === 0) return `${SITE_URL}/`;
  return `${SITE_URL}/${slug.join("/")}/`;
}

function injectOpenGraphTags(html: string, slug: string[]): string {
  if (/property=["']og:title["']/i.test(html)) {
    return html;
  }

  const title = extractTitle(html);
  const description = extractDescription(html);
  const url = buildCanonicalUrl(slug);
  const safeTitle = escapeHtmlAttr(title);
  const safeDescription = escapeHtmlAttr(description);
  const safeUrl = escapeHtmlAttr(url);

  const tags = `
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${escapeHtmlAttr(SITE_NAME)}">
    <meta property="og:title" content="${safeTitle}">
    <meta property="og:description" content="${safeDescription}">
    <meta property="og:url" content="${safeUrl}">
    <meta property="og:image" content="${OG_IMAGE_URL}">
    <meta property="og:image:secure_url" content="${OG_IMAGE_URL}">
    <meta property="og:image:type" content="image/jpeg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${safeTitle}">
    <meta property="og:locale" content="en_US">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${safeTitle}">
    <meta name="twitter:description" content="${safeDescription}">
    <meta name="twitter:image" content="${OG_IMAGE_URL}">
    <link rel="canonical" href="${safeUrl}">
`;

  const descriptionMeta =
    /<meta\s+name=["']description["'][^>]*>/i.exec(html) ||
    /<meta\s+content=["'][^"']*["']\s+name=["']description["'][^>]*>/i.exec(
      html,
    );

  if (descriptionMeta?.index != null) {
    const insertAt = descriptionMeta.index + descriptionMeta[0].length;
    return `${html.slice(0, insertAt)}\n${tags}${html.slice(insertAt)}`;
  }

  if (/<\/title>/i.test(html)) {
    return html.replace(/<\/title>/i, `</title>\n${tags}`);
  }

  return html.replace(/<head[^>]*>/i, (match) => `${match}\n${tags}`);
}

export async function readSiteHtml(slug: string[] = []): Promise<string | null> {
  const filePath = path.join(CONTENT_DIR, ...slug, "index.html");

  try {
    const html = await fs.readFile(filePath, "utf8");
    return injectOpenGraphTags(html, slug);
  } catch {
    return null;
  }
}
