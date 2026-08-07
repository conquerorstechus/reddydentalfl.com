/** Google Analytics 4 measurement ID (public; safe to expose client-side). */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-1CH7FV431K";

/**
 * gtag.js snippet for static HTML pages served by the Route Handler
 * (app/[[...slug]]/route.ts), which bypasses RootLayout / React.
 *
 * This is the only GA install on those pages — do not also rely on
 * @next/third-parties there. Blog (React) pages use GoogleAnalytics in
 * app/layout.tsx instead.
 */
export function getGoogleAnalyticsHtml(gaId: string = GA_MEASUREMENT_ID): string {
  return `
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${gaId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}', { send_page_view: true });
    </script>
`;
}
