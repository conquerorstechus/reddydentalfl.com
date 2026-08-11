import { promises as fs } from "fs";
import path from "path";
import { getGoogleAnalyticsHtml } from "@/lib/analytics";

const CONTENT_DIR = path.join(process.cwd(), "content");
const PRODUCTION_SITE_URL = "https://www.reddydentalfl.com";
const SITE_NAME = "Reddy Dental";
const DEFAULT_TITLE = "Dentist Near Me in St. Petersburg, FL | Reddy Dental";
const DEFAULT_DESCRIPTION =
  "Reddy Dental is a dentist near me located in St. Petersburg, FL 33707 for all your family and cosmetic dentistry needs.";

function resolveSiteOrigin(_origin?: string): string {
  // Always emit absolute production URLs in OG/Twitter tags. Preview origins
  // (VERCEL_URL / request host) are often behind Deployment Protection, so
  // WhatsApp/Facebook scrapers never see the real page or image.
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.OPINLY_SITE_URL?.trim() ||
    "";
  return (fromEnv || PRODUCTION_SITE_URL).replace(/\/$/, "");
}

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

function buildCanonicalUrl(siteOrigin: string, slug: string[]): string {
  if (slug.length === 0) return `${siteOrigin}/`;
  return `${siteOrigin}/${slug.join("/")}/`;
}

function injectOpenGraphTags(
  html: string,
  slug: string[],
  siteOrigin: string,
): string {
  if (/property=["']og:title["']/i.test(html)) {
    return html;
  }

  const title = extractTitle(html);
  const description = extractDescription(html);
  const url = buildCanonicalUrl(siteOrigin, slug);
  const ogImageUrl = `${siteOrigin}/og-image.jpg`;
  const safeTitle = escapeHtmlAttr(title);
  const safeDescription = escapeHtmlAttr(description);
  const safeUrl = escapeHtmlAttr(url);
  const safeImageUrl = escapeHtmlAttr(ogImageUrl);

  const tags = `
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${escapeHtmlAttr(SITE_NAME)}">
    <meta property="og:title" content="${safeTitle}">
    <meta property="og:description" content="${safeDescription}">
    <meta property="og:url" content="${safeUrl}">
    <meta property="og:image" content="${safeImageUrl}">
    <meta property="og:image:secure_url" content="${safeImageUrl}">
    <meta property="og:image:type" content="image/jpeg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${safeTitle}">
    <meta property="og:locale" content="en_US">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${safeTitle}">
    <meta name="twitter:description" content="${safeDescription}">
    <meta name="twitter:image" content="${safeImageUrl}">
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

function injectGoogleAnalytics(html: string): string {
  if (/googletagmanager\.com\/gtag\/js/i.test(html)) {
    return html;
  }

  const snippet = getGoogleAnalyticsHtml();

  if (/<\/head>/i.test(html)) {
    return html.replace(/<\/head>/i, `${snippet}</head>`);
  }

  return `${html}${snippet}`;
}

/**
 * Site-wide mobile layout fixes for static HTML pages.
 * - pre-wrap + indented source caused pinched bio text
 * - oversized header phone overlapped the hamburger
 * - fixed-width images/callouts overflowed small viewports
 */
function injectMobileResponsiveFixes(html: string): string {
  if (html.includes("data-mobile-responsive-fix")) {
    return html;
  }

  const styles = `
    <style data-mobile-responsive-fix>
      /* Indentation in HTML source was preserved as leading spaces */
      p {
        white-space: normal !important;
      }

      html,
      body {
        max-width: 100%;
        overflow-x: hidden;
      }

      img,
      video,
      iframe {
        max-width: 100%;
      }

      /* Mobile top bar: keep menu + phone + book icon on one row */
      @media (max-width: 1023px) {
        #topNav .max-w-content {
          min-width: 0;
          gap: 0.5rem;
        }

        #topNav a[href^="tel:"].lg\\:hidden,
        #topNav #phoneNumber {
          font-size: clamp(12px, 3.5vw, 16px) !important;
          line-height: 1.15 !important;
          white-space: nowrap;
          max-width: min(58vw, 11.5rem);
          overflow: hidden;
          text-overflow: ellipsis;
          flex-shrink: 1;
        }

        #topNav .flex.items-center.gap-3,
        #topNav .flex.items-center.gap-x-3 {
          min-width: 0;
          flex: 1 1 auto;
          justify-content: flex-end;
        }

        #menuBar img.h-\\[50px\\].w-\\[250px\\],
        #menuBar img[alt="Logo"] {
          width: min(250px, 72vw) !important;
          height: auto !important;
          max-height: 50px;
        }

        main img.h-72.w-72,
        main img.w-72 {
          width: min(18rem, 100%) !important;
          height: auto !important;
          max-width: 100%;
        }

        .w-\\[320px\\] {
          width: min(320px, 100%) !important;
        }

        .w-\\[280px\\] {
          width: min(280px, 100%) !important;
        }

        .sm\\:w-\\[500px\\] {
          max-width: 100%;
        }
      }

      @media (max-width: 480px) {
        #topNav a[href^="tel:"].lg\\:hidden,
        #topNav #phoneNumber {
          max-width: min(52vw, 9.75rem);
        }
      }
    </style>
`;

  if (/<\/head>/i.test(html)) {
    return html.replace(/<\/head>/i, `${styles}</head>`);
  }

  return `${styles}${html}`;
}

/** Shorten the mobile header phone so it fits beside the menu icon. */
function fixMobileHeaderPhone(html: string): string {
  return html
    .replace(
      /(<a\b(?=[^>]*\bid=["']phoneNumber["'])[^>]*>)\s*727-377-3339\s*\(727-DR REDDY\)\s*(<\/a>)/gi,
      "$1\n                727-377-3339\n              $2",
    )
    .replace(
      /(<a\b(?=[^>]*\blg:hidden\b)(?=[^>]*\bhref=["']tel:727-377-3339["'])[^>]*>)\s*727-377-3339\s*\(727-DR REDDY\)\s*(<\/a>)/gi,
      "$1\n                727-377-3339\n              $2",
    );
}

export async function readSiteHtml(
  slug: string[] = [],
  origin?: string,
): Promise<string | null> {
  const filePath = path.join(CONTENT_DIR, ...slug, "index.html");

  try {
    const html = await fs.readFile(filePath, "utf8");
    const withOg = injectOpenGraphTags(html, slug, resolveSiteOrigin(origin));
    const withPhone = fixMobileHeaderPhone(withOg);
    const withMobile = injectMobileResponsiveFixes(withPhone);
    return injectGoogleAnalytics(withMobile);
  } catch {
    return null;
  }
}
