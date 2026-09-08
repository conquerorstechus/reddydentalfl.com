/** Google Analytics 4 measurement ID (public; safe to expose client-side). */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-1CH7FV431K";

/** Google Tag Manager container ID (public; safe to expose client-side). */
export const GTM_CONTAINER_ID =
  process.env.NEXT_PUBLIC_GTM_CONTAINER_ID || "GTM-PMT4LNC5";

/** Google Ads tag and website-call conversion label (public IDs). */
export const GOOGLE_ADS_TAG_ID = "AW-18388713730";
export const GOOGLE_ADS_WEBSITE_CALL_LABEL =
  "AW-18388713730/_dS8CIyJ7vAcEIKCtsBE";

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
      gtag('config', '${GOOGLE_ADS_TAG_ID}');
      gtag('config', '${GOOGLE_ADS_WEBSITE_CALL_LABEL}', {
        phone_conversion_number: '727-377-3339',
        phone_conversion_callback: function(formattedNumber, mobileNumber) {
          document.querySelectorAll('a[href^="tel:"]').forEach(function(link) {
            link.setAttribute('href', 'tel:' + mobileNumber);
            var label = (link.textContent || '').trim();
            if (/^\\+?[\\d\\s().-]+$/.test(label) && label.replace(/\\D/g, '').length >= 10) {
              link.textContent = formattedNumber;
            }
          });
        }
      });
      document.addEventListener('click', function(event) {
        var target = event.target;
        if (!target || typeof target.closest !== 'function') return;
        var link = target.closest('a[href^="tel:"]');
        if (!link) return;
        gtag('event', 'click_to_call', {
          phone_number: '727-377-3339',
          link_url: link.href,
          page_location: window.location.href
        });
      }, true);
    </script>
`;
}
