import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import GoogleCallTracking from "@/components/google-call-tracking";
import MetaPixel from "@/components/meta-pixel";
import SiteGoogleAnalytics from "@/components/site-google-analytics";
import { CANONICAL_SITE_ORIGIN, DEFAULT_SOCIAL_IMAGE } from "@/lib/site-origin";
import { getTrackingConsentSource } from "@/lib/tracking-consent";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  const locale = await getLocale();
  const title = t("title");
  const description = t("description");

  return {
    metadataBase: new URL(CANONICAL_SITE_ORIGIN),
    title,
    description,
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: "Reddy Dental",
      locale: locale === "es" ? "es_ES" : "en_US",
      title,
      description,
      images: [
        {
          url: DEFAULT_SOCIAL_IMAGE.path,
          width: DEFAULT_SOCIAL_IMAGE.width,
          height: DEFAULT_SOCIAL_IMAGE.height,
          alt: t("ogImageAlt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_SOCIAL_IMAGE.path],
    },
  };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();
  // SiteGoogleAnalytics, Meta Pixel, and call tracking load only after the
  // visitor accepts. Static HTML pages get the same gate from lib/site-pages.ts.
  return (
    <html lang={locale}>
      <body>
        <Script id="google-tag-bootstrap" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
          `}
        </Script>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
        <GoogleCallTracking />
        <MetaPixel />
        <SiteGoogleAnalytics />
        <Script id="rd-tracking-consent" strategy="afterInteractive">
          {getTrackingConsentSource(false)}
        </Script>
      </body>
    </html>
  );
}
