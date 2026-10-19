import { promises as fs } from "fs";
import path from "path";
import { buildDentistSchemaJson, shouldInjectDentistSchema } from "@/lib/dentist-schema";
import { buildPrivacyDocument, injectPrivacyLinks } from "@/lib/privacy-page";
import { CANONICAL_SITE_ORIGIN, DEFAULT_SOCIAL_IMAGE } from "@/lib/site-origin";
import { getTrackingConsentHtml } from "@/lib/tracking-consent";
import type { AppLocale } from "@/i18n/routing";
import { applySiteLocale, backLinkPrefix, translateBackLabel } from "@/lib/localize-site-html";

const CONTENT_DIR = path.join(process.cwd(), "content");
const SITE_NAME = "Reddy Dental";
const DEFAULT_TITLE = "Dentist Near Me in St. Petersburg, FL | Reddy Dental";
const DEFAULT_DESCRIPTION =
  "Reddy Dental is a dentist near me located in St. Petersburg, FL 33707 for all your family and cosmetic dentistry needs.";

function resolveSiteOrigin(_origin?: string): string {
  // Always emit absolute production URLs in OG/Twitter tags. Preview origins
  // (VERCEL_URL / request host) are often behind Deployment Protection, so
  // WhatsApp/Facebook scrapers never see the real page or image.
  return CANONICAL_SITE_ORIGIN;
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
  locale: AppLocale,
): string {
  if (/property=["']og:title["']/i.test(html)) {
    return html;
  }

  const title = extractTitle(html);
  const description = extractDescription(html);
  const url = buildCanonicalUrl(siteOrigin, slug);
  const ogImageUrl = `${siteOrigin}${DEFAULT_SOCIAL_IMAGE.path}`;
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
    <meta property="og:image:type" content="${DEFAULT_SOCIAL_IMAGE.type}">
    <meta property="og:image:width" content="${DEFAULT_SOCIAL_IMAGE.width}">
    <meta property="og:image:height" content="${DEFAULT_SOCIAL_IMAGE.height}">
    <meta property="og:image:alt" content="${safeTitle}">
    <meta property="og:locale" content="${locale === "es" ? "es_ES" : "en_US"}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${safeTitle}">
    <meta name="twitter:description" content="${safeDescription}">
    <meta name="twitter:image" content="${safeImageUrl}">
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

function insertBeforeHeadClose(html: string, snippet: string): string {
  if (/<\/head>/i.test(html)) {
    return html.replace(/<\/head>/i, `${snippet}</head>`);
  }
  if (/<head[^>]*>/i.test(html)) {
    return html.replace(/<head[^>]*>/i, (match) => `${match}\n${snippet}`);
  }
  return `${snippet}${html}`;
}

function injectCanonicalLink(html: string, canonicalUrl: string): string {
  if (/<link\b[^>]*rel=["']canonical["']/i.test(html)) return html;
  return insertBeforeHeadClose(
    html,
    `\n    <link rel="canonical" href="${escapeHtmlAttr(canonicalUrl)}">`,
  );
}

function injectRobotsMeta(html: string): string {
  if (/<meta\b[^>]*name=["']robots["']/i.test(html)) return html;
  return insertBeforeHeadClose(html, `\n    <meta name="robots" content="index, follow">`);
}

function injectDentistSchema(html: string, slug: string[], siteOrigin: string): string {
  if (!shouldInjectDentistSchema(slug)) return html;
  if (html.includes("data-rd-dentist-schema")) return html;
  if (/"@type"\s*:\s*\[?\s*"Dentist"/i.test(html)) return html;
  return insertBeforeHeadClose(
    html,
    `\n    <script type="application/ld+json" data-rd-dentist-schema>${buildDentistSchemaJson(siteOrigin)}</script>`,
  );
}

function improveContentImages(html: string): string {
  return html.replace(/<img\b([^>]*?)\/?>/gi, (full, attrs: string) => {
    let next = attrs;
    if (!/\balt\s*=/i.test(next)) {
      next += ' alt=""';
    } else {
      next = next.replace(/\balt\s*=\s*(["'])Logo\1/gi, 'alt="Reddy Dental"');
    }

    const critical =
      /fetchpriority\s*=\s*["']high["']/i.test(next) ||
      /\bid\s*=\s*["']heroStill["']/i.test(next) ||
      /\balt\s*=\s*["']Reddy Dental["']/i.test(next);
    if (!critical && !/\bloading\s*=/i.test(next)) {
      next += ' loading="lazy"';
    }
    if (!critical && !/\bdecoding\s*=/i.test(next)) {
      next += ' decoding="async"';
    }

    if (next === attrs) return full;
    const closed = full.trimEnd().endsWith("/>") ? "/>" : ">";
    return `<img${next}${closed}`;
  });
}

function injectTrackingConsent(html: string): string {
  if (html.includes("data-rd-tracking-consent")) return html;
  const snippet = getTrackingConsentHtml(true);
  if (/<\/body>/i.test(html)) {
    return html.replace(/<\/body>/i, `${snippet}</body>`);
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
        /* clip stops sideways scroll without turning the page into a scroll
           container. hidden does that, and it keeps the menu from sticking. */
        overflow-x: clip;
      }

      @media (min-width: 1024px) {
        #menuBar {
          z-index: 40;
        }

        #menuBar.bg-primary {
          box-shadow: 0 8px 24px rgba(24, 36, 58, 0.16);
        }

        #menuBar [id$="_dropdown"] {
          min-width: max-content;
          z-index: 50;
        }

        #menuBar [id$="_dropdown"] a {
          white-space: nowrap;
        }
      }

      img,
      video,
      iframe {
        max-width: 100%;
      }

      /* Homepage hero: white nav labels sit on a light photo */
      #menuBar.bg-transparent > .max-w-content > div:last-child {
        background-color: #231f20;
        border-radius: 999px;
        padding: 10px 22px;
      }

      .coverage-learn-more {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 14px;
        margin: 6px 0 10px;
        padding: 8px 22px 8px 8px;
        border-radius: 999px;
        background: #d9b748;
        color: #231f20;
        font-family: Roboto, system-ui, sans-serif;
        font-size: 16px;
        font-weight: 700;
        line-height: 1.35;
        text-align: left;
        text-decoration: none;
        max-width: min(100%, 760px);
      }

      .coverage-learn-more:hover {
        background: #e6c865;
        color: #231f20;
      }

      .coverage-learn-more-icon {
        display: flex;
        flex: none;
        width: 72px;
        height: 72px;
        overflow: hidden;
        border: 4px solid #918c85;
        border-radius: 999px;
      }

      .coverage-learn-more-icon svg {
        display: block;
        width: 100%;
        height: 100%;
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
          max-width: min(46vw, 9.25rem);
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
          max-width: min(40vw, 8rem);
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

type BackNavTarget = { href: string; label: string };

const SERVICE_CATEGORY_PAGES = new Set([
  "cosmetic",
  "restorative",
  "preventative",
  "emergency",
]);

/** Leaf service pages → parent category listing (Learn More destinations). */
const SERVICE_PARENT: Record<string, BackNavTarget> = {
  crowns: { href: "/services/cosmetic/", label: "Cosmetic Dentistry" },
  dentures: { href: "/services/cosmetic/", label: "Cosmetic Dentistry" },
  "partial-dentures": {
    href: "/services/cosmetic/",
    label: "Cosmetic Dentistry",
  },
  whitening: { href: "/services/cosmetic/", label: "Cosmetic Dentistry" },
  veneers: { href: "/services/cosmetic/", label: "Cosmetic Dentistry" },
  reconstruction: { href: "/services/cosmetic/", label: "Cosmetic Dentistry" },
  invisalign: { href: "/services/cosmetic/", label: "Cosmetic Dentistry" },
  bridges: { href: "/services/restorative/", label: "Restorative Dentistry" },
  endodontics: {
    href: "/services/restorative/",
    label: "Restorative Dentistry",
  },
  fillings: { href: "/services/restorative/", label: "Restorative Dentistry" },
  "dental-implants": {
    href: "/services/restorative/",
    label: "Restorative Dentistry",
  },
  "root-canals": {
    href: "/services/restorative/",
    label: "Restorative Dentistry",
  },
  "tmj-treatment": {
    href: "/services/restorative/",
    label: "Restorative Dentistry",
  },
  "dental-cleanings": {
    href: "/services/preventative/",
    label: "Preventative Dentistry",
  },
  "fluoride-treatment": {
    href: "/services/preventative/",
    label: "Preventative Dentistry",
  },
  "mouth-guards": {
    href: "/services/preventative/",
    label: "Preventative Dentistry",
  },
  "night-guards": {
    href: "/services/preventative/",
    label: "Preventative Dentistry",
  },
  sealants: {
    href: "/services/preventative/",
    label: "Preventative Dentistry",
  },
  "sleep-apnea": {
    href: "/services/preventative/",
    label: "Preventative Dentistry",
  },
  "wisdom-teeth": {
    href: "/services/preventative/",
    label: "Preventative Dentistry",
  },
  "emergency-exams": {
    href: "/services/emergency/",
    label: "Emergency Dentistry",
  },
  extractions: { href: "/services/emergency/", label: "Emergency Dentistry" },
  "oral-cancer-screenings": {
    href: "/technologies/",
    label: "Technologies",
  },
  "dermal-fillers": { href: "/services/", label: "All Services" },
};

function resolveBackNav(slug: string[]): BackNavTarget | null {
  if (slug[0] === "services" && slug.length === 2) {
    const page = slug[1];
    // Category listing pages already include their own back control.
    if (SERVICE_CATEGORY_PAGES.has(page)) {
      return null;
    }
    return SERVICE_PARENT[page] ?? { href: "/services/", label: "All Services" };
  }

  if (slug[0] === "technologies" && slug.length === 2) {
    return { href: "/technologies/", label: "Technologies" };
  }

  return null;
}

/**
 * Adds a clear "Back to …" control on detail pages so users can return after
 * clicking Learn More from a category listing. Matches the existing
 * `.back-to-services` pill used on category pages.
 */
function injectPageBackNav(html: string, slug: string[], locale: AppLocale): string {
  if (html.includes("data-page-back-nav")) {
    return html;
  }

  const target = resolveBackNav(slug);
  if (!target) {
    return html;
  }

  let next = html;

  if (!next.includes(".back-to-services")) {
    const styles = `
    <style data-page-back-nav-style>
      @keyframes backLinkPulse {
        0%,
        100% {
          opacity: 1;
          box-shadow: 0 0 0 0 rgba(217, 183, 72, 0.55);
        }
        50% {
          opacity: 0.72;
          box-shadow: 0 0 0 8px rgba(217, 183, 72, 0);
        }
      }
      .back-to-services {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 14px;
        padding: 8px 16px;
        border: 1.5px solid #46433f;
        border-radius: 999px;
        font-family: Roboto, sans-serif;
        font-size: 15px;
        font-weight: 600;
        line-height: 1.3;
        color: #46433f;
        text-decoration: none;
        background: rgba(255, 255, 255, 0.65);
        animation: backLinkPulse 1.4s ease-in-out infinite;
      }
      .back-to-services:hover,
      .back-to-services:focus-visible {
        background: #46433f;
        color: #fff;
        animation: none;
        outline: none;
      }
      @media (prefers-reduced-motion: reduce) {
        .back-to-services {
          animation: none;
        }
      }
    </style>
`;
    if (/<\/head>/i.test(next)) {
      next = next.replace(/<\/head>/i, `${styles}</head>`);
    } else {
      next = `${styles}${next}`;
    }
  }

  const backLink = `<a href="${escapeHtmlAttr(target.href)}" target="_self" class="back-to-services" data-page-back-nav>${escapeHtmlAttr(backLinkPrefix(locale))} ${escapeHtmlAttr(translateBackLabel(target.label, locale))}</a>`;

  // Prefer the tertiary hero band (same placement as category pages).
  const heroInner =
    /(<div class="bg-tertiary py-md px-sm flex justify-center">\s*<div class="max-w-content w-full text-center lg:text-start">)/i;
  if (heroInner.test(next)) {
    return next.replace(heroInner, `$1\n          ${backLink}\n          `);
  }

  if (/<main\b[^>]*>/i.test(next)) {
    return next.replace(
      /<main\b[^>]*>/i,
      (match) =>
        `${match}\n      <div class="bg-tertiary px-sm py-sm flex justify-center"><div class="max-w-content w-full">${backLink}</div></div>`,
    );
  }

  return `${backLink}${next}`;
}

/**
 * Normalize relative/CDN asset paths used in Tailwind bg-[url('...')] classes
 * to root-absolute /assets/... URLs that work from any page depth.
 */
function toAbsoluteAssetUrl(rawPath: string): string | null {
  let p = rawPath.trim().replace(/\\/g, "/");
  if (!p) return null;

  if (/^https?:\/\//i.test(p)) {
    try {
      const { pathname } = new URL(p);
      // CDN paths are typically /images/..., /Atwood-.../, or /computer.webp
      if (pathname.startsWith("/assets/")) return pathname;
      return `/assets${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
    } catch {
      return null;
    }
  }

  while (p.startsWith("../") || p.startsWith("./")) {
    p = p.replace(/^\.\.?\//, "");
  }

  if (p.startsWith("/assets/")) return p;
  if (p.startsWith("assets/")) return `/${p}`;
  if (p.startsWith("/")) return `/assets${p}`;
  return `/assets/${p}`;
}

/**
 * Callout cards use white icons/text inside gold circles on photo backgrounds.
 * Precompiled CSS only matched CDN-shaped bg-[url(...)] classes, while HTML used
 * relative paths — so backgrounds never applied and light content vanished on white.
 * Inject absolute background-image inline styles for every bg-[url('...')] usage.
 */
function fixCalloutBackgroundImages(html: string): string {
  // Match tags whose class contains bg-[url('...')] or bg-[url("...")].
  // Class values often nest quotes (url('...')), so parse by outer quote type.
  return html.replace(
    /<([a-zA-Z][\w:-]*)\b([^>]*?)>/gi,
    (match, tag: string, attrs: string) => {
      const classMatch = attrs.match(/\bclass\s*=\s*(")([^"]*)"|(\bclass\s*=\s*')([^']*)'/i);
      if (!classMatch) return match;

      const classValue = classMatch[2] ?? classMatch[4] ?? "";
      const urlMatch = classValue.match(
        /bg-\[url\(\s*['"]([^'"]+)['"]\s*\)\]/,
      );
      if (!urlMatch) return match;

      const absUrl = toAbsoluteAssetUrl(urlMatch[1]);
      if (!absUrl) return match;

      const bgDecl = `background-image: url('${absUrl}')`;

      if (/\bstyle\s*=\s*"/i.test(attrs)) {
        if (
          new RegExp(
            `background-image\\s*:\\s*url\\(['"]?${absUrl.replace(
              /[.*+?^${}()|[\]\\]/g,
              "\\$&",
            )}['"]?\\)`,
            "i",
          ).test(attrs)
        ) {
          return match;
        }
        const nextAttrs = attrs.replace(
          /background-image\s*:\s*url\((['"]?)([^'")]+)\1\)/i,
          bgDecl,
        );
        if (nextAttrs !== attrs) {
          return `<${tag}${nextAttrs}>`;
        }
        return `<${tag}${attrs.replace(/\bstyle\s*=\s*"/i, `style="${bgDecl}; `)}>`;
      }

      if (/\bstyle\s*=\s*'/i.test(attrs)) {
        if (
          new RegExp(
            `background-image\\s*:\\s*url\\(['"]?${absUrl.replace(
              /[.*+?^${}()|[\]\\]/g,
              "\\$&",
            )}['"]?\\)`,
            "i",
          ).test(attrs)
        ) {
          return match;
        }
        const nextAttrs = attrs.replace(
          /background-image\s*:\s*url\((['"]?)([^'")]+)\1\)/i,
          bgDecl,
        );
        if (nextAttrs !== attrs) {
          return `<${tag}${nextAttrs}>`;
        }
        return `<${tag}${attrs.replace(/\bstyle\s*=\s*'/i, `style='${bgDecl}; `)}>`;
      }

      return `<${tag}${attrs} style="${bgDecl}">`;
    },
  );
}

/**
 * Makes inline "Learn More »" CTAs look like real hyperlinks (gold + underline)
 * so they don't blend into body copy.
 */
function styleLearnMoreLinks(html: string): string {
  let next = html;

  if (!next.includes("data-learn-more-link-style")) {
    const styles = `
    <style data-learn-more-link-style>
      a.learn-more-link {
        color: #b8942f !important;
        font-weight: 500 !important;
        text-decoration: underline !important;
        text-underline-offset: 3px;
        text-decoration-thickness: 1.5px;
        white-space: nowrap;
        transition: color 0.2s ease, text-decoration-color 0.2s ease;
      }
      a.learn-more-link:hover,
      a.learn-more-link:focus-visible {
        color: #d9b748 !important;
        text-decoration-thickness: 2px;
        outline: none;
      }
    </style>
`;
    if (/<\/head>/i.test(next)) {
      next = next.replace(/<\/head>/i, `${styles}</head>`);
    } else {
      next = `${styles}${next}`;
    }
  }

  return next.replace(
    /<a\b([^>]*?)>(\s*(?:Learn More|Más información)\s*»\s*)<\/a>/gi,
    (match, attrs: string, text: string) => {
      if (/\blearn-more-link\b/.test(attrs)) {
        return match;
      }
      if (/\bclass\s*=\s*"/i.test(attrs)) {
        attrs = attrs.replace(/\bclass\s*=\s*"/i, 'class="learn-more-link ');
      } else if (/\bclass\s*=\s*'/i.test(attrs)) {
        attrs = attrs.replace(/\bclass\s*=\s*'/i, "class='learn-more-link ");
      } else {
        attrs = ` class="learn-more-link"${attrs}`;
      }
      return `<a${attrs}>${text}</a>`;
    },
  );
}

export async function readSiteHtml(
  slug: string[] = [],
  origin?: string,
  locale: AppLocale = "en",
): Promise<string | null> {
  const isPrivacy = slug.length === 1 && slug[0] === "privacy";
  const filePath = isPrivacy
    ? path.join(CONTENT_DIR, "index.html")
    : path.join(CONTENT_DIR, ...slug, "index.html");

  try {
    const html = await fs.readFile(filePath, "utf8");
    const localized = applySiteLocale(html, isPrivacy ? [] : slug, locale);
    const page = isPrivacy ? buildPrivacyDocument(localized, locale) : localized;
    const siteOrigin = resolveSiteOrigin(origin);
    const withOg = injectOpenGraphTags(page, slug, siteOrigin, locale);
    const withCanonical = injectCanonicalLink(withOg, buildCanonicalUrl(siteOrigin, slug));
    const withRobots = injectRobotsMeta(withCanonical);
    const withSchema = injectDentistSchema(withRobots, slug, siteOrigin);
    const withImages = improveContentImages(withSchema);
    const withPhone = fixMobileHeaderPhone(withImages);
    const withMobile = injectMobileResponsiveFixes(withPhone);
    const withCallouts = fixCalloutBackgroundImages(withMobile);
    const withBack = injectPageBackNav(withCallouts, slug, locale);
    const withLearnMore = styleLearnMoreLinks(withBack);
    const withPrivacy = injectPrivacyLinks(withLearnMore, locale);
    return injectTrackingConsent(withPrivacy);
  } catch {
    return null;
  }
}
