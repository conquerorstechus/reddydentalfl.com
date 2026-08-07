/** Google Analytics 4 measurement ID (public; safe to expose client-side). */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-1CH7FV431K";

/**
 * gtag.js snippet for static HTML pages served outside the React tree.
 * Equivalent to the standard Google tag install code.
 */
export function getGoogleAnalyticsHtml(gaId: string = GA_MEASUREMENT_ID): string {
  return `
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${gaId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}');
    </script>
`;
}
