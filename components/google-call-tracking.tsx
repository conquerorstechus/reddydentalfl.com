"use client";

import { useEffect } from "react";
import { GOOGLE_ADS_WEBSITE_CALL_LABEL } from "@/lib/analytics";

const PHONE_NUMBER = "727-377-3339";

type TrackingWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

function getGtag() {
  const trackingWindow = window as TrackingWindow;
  trackingWindow.dataLayer = trackingWindow.dataLayer || [];
  trackingWindow.gtag =
    trackingWindow.gtag ||
    ((...args: unknown[]) => {
      trackingWindow.dataLayer?.push(args);
    });
  return trackingWindow.gtag;
}

function replaceWebsitePhoneNumber(formattedNumber: string, mobileNumber: string) {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="tel:"]').forEach((link) => {
    link.href = `tel:${mobileNumber}`;
    const label = link.textContent?.trim() || "";
    if (/^\+?[\d\s().-]+$/.test(label) && label.replace(/\D/g, "").length >= 10) {
      link.textContent = formattedNumber;
    }
  });
}

export default function GoogleCallTracking() {
  useEffect(() => {
    const gtag = getGtag();
    gtag("config", GOOGLE_ADS_WEBSITE_CALL_LABEL, {
      phone_conversion_number: PHONE_NUMBER,
      phone_conversion_callback: replaceWebsitePhoneNumber,
    });

    const trackPhoneClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>('a[href^="tel:"]');
      if (!link) return;

      getGtag()("event", "click_to_call", {
        phone_number: PHONE_NUMBER,
        link_url: link.href,
        page_location: window.location.href,
      });
    };

    document.addEventListener("click", trackPhoneClick, true);
    return () => document.removeEventListener("click", trackPhoneClick, true);
  }, []);

  return null;
}
