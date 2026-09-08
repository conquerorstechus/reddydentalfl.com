import type { ReactNode } from "react";
import Script from "next/script";
import { GoogleTagManager } from "@next/third-parties/google";
import { GOOGLE_ADS_TAG_ID, GTM_CONTAINER_ID } from "@/lib/analytics";

export default function CallUsOfferLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <GoogleTagManager gtmId={GTM_CONTAINER_ID} />
      <Script id="google-ads-config" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
          window.gtag('config', '${GOOGLE_ADS_TAG_ID}');
        `}
      </Script>
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
