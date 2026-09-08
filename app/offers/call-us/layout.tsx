import type { ReactNode } from "react";
import { GoogleTagManager } from "@next/third-parties/google";
import { GTM_CONTAINER_ID } from "@/lib/analytics";

export default function CallUsOfferLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <GoogleTagManager gtmId={GTM_CONTAINER_ID} />
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_CONTAINER_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
      {children}
    </>
  );
}
