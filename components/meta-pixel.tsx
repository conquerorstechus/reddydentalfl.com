"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { META_PIXEL_ID } from "@/lib/analytics";

type MetaPixelFunction = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[][];
  loaded?: boolean;
  version?: string;
  push?: (...args: unknown[]) => void;
};

type MetaWindow = Window & {
  fbq?: MetaPixelFunction;
  _fbq?: MetaPixelFunction;
};

function getMetaPixel() {
  const metaWindow = window as MetaWindow;
  if (metaWindow.fbq) return metaWindow.fbq;

  const fbq = ((...args: unknown[]) => {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue?.push(args);
  }) as MetaPixelFunction;

  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.push = fbq;
  metaWindow.fbq = fbq;
  metaWindow._fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  fbq("init", META_PIXEL_ID);
  return fbq;
}

export default function MetaPixel() {
  const pathname = usePathname();

  useEffect(() => {
    getMetaPixel()("track", "PageView");
  }, [pathname]);

  useEffect(() => {
    const trackPhoneClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (!target.closest('a[href^="tel:"]')) return;
      getMetaPixel()("track", "Contact");
    };

    document.addEventListener("click", trackPhoneClick, true);
    return () => document.removeEventListener("click", trackPhoneClick, true);
  }, []);

  return null;
}
