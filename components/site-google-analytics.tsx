"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { usePathname } from "next/navigation";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";
import { useTrackingAllowed } from "@/components/use-tracking-consent";

/**
 * These routes already load Google Tag Manager, and that container includes
 * the same GA4 tag (G-1CH7FV431K). A second gtag.js install double-counts page views.
 */
const GTM_ROUTE_PREFIXES = ["/offers/call-us/", "/offers/dental-clinic/"];

function routeLoadsTagManager(pathname: string): boolean {
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return GTM_ROUTE_PREFIXES.some((prefix) => path.startsWith(prefix));
}

export default function SiteGoogleAnalytics() {
  const pathname = usePathname() || "/";
  const allowed = useTrackingAllowed();
  if (!allowed || routeLoadsTagManager(pathname)) return null;
  return <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />;
}
