import type { Metadata } from "next";
import type { ReactNode } from "react";
import { GoogleTagManager } from "@next/third-parties/google";
import { getLocale, getTranslations } from "next-intl/server";
import { GTM_CONTAINER_ID } from "@/lib/analytics";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("offers.callUs.metadata");
  const locale = await getLocale();
  const title = t("title");
  const description = t("description");

  return {
    title,
    description,
    alternates: { canonical: "/offers/call-us/" },
    openGraph: {
      type: "website",
      siteName: "Reddy Dental",
      locale: locale === "es" ? "es_ES" : "en_US",
      url: "/offers/call-us/",
      title,
      description,
      images: [{
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: t("ogImageAlt"),
      }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.jpg"],
    },
  };
}

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
          title="Google Tag Manager"
        />
      </noscript>
      {children}
    </>
  );
}
