const PRODUCTION_SITE_ORIGIN = "https://www.reddydentalfl.com";

/** Canonical production origin. Preview hosts must not leak into metadata. */
export const CANONICAL_SITE_ORIGIN = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  PRODUCTION_SITE_ORIGIN
).replace(/\/$/, "");

/** Real on-site photo. public/og-image.jpg is not in this project. */
export const DEFAULT_SOCIAL_IMAGE = {
  path: "/assets/images/reddy-dental-exterior.jpg",
  width: 1024,
  height: 682,
  type: "image/jpeg",
} as const;

export function absoluteSiteUrl(path = "/"): string {
  if (!path || path === "/") return `${CANONICAL_SITE_ORIGIN}/`;
  const withLeading = path.startsWith("/") ? path : `/${path}`;
  return `${CANONICAL_SITE_ORIGIN}${withLeading.endsWith("/") ? withLeading : `${withLeading}/`}`;
}
