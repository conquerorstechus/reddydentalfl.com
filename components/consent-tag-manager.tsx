"use client";

import { GoogleTagManager } from "@next/third-parties/google";
import { GTM_CONTAINER_ID } from "@/lib/analytics";
import { useTrackingAllowed } from "@/components/use-tracking-consent";

export default function ConsentTagManager() {
  const allowed = useTrackingAllowed();
  if (!allowed) return null;
  return <GoogleTagManager gtmId={GTM_CONTAINER_ID} />;
}
