"use client";

import { useEffect, useState } from "react";
import { TRACKING_CONSENT_COOKIE } from "@/lib/tracking-consent";

function readChoice(): "accepted" | "declined" | "" {
  if (typeof document === "undefined") return "";
  const fromWindow = window.__rdTrackingConsent;
  if (fromWindow === "accepted" || fromWindow === "declined") return fromWindow;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${TRACKING_CONSENT_COOKIE}=([^;]*)`),
  );
  const value = match ? decodeURIComponent(match[1]) : "";
  return value === "accepted" || value === "declined" ? value : "";
}

export function useTrackingAllowed(): boolean {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const sync = () => setAllowed(readChoice() === "accepted");
    sync();
    document.addEventListener("rd-tracking-consent", sync);
    return () => document.removeEventListener("rd-tracking-consent", sync);
  }, []);

  return allowed;
}
