import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import GoogleCallTracking from "@/components/google-call-tracking";
import MetaPixel from "@/components/meta-pixel";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";

const PRODUCTION_SITE_URL = "https://www.reddydentalfl.com";

function resolveMetadataBase(): URL {
  // Prefer the canonical production host so OG/Twitter image URLs never
  // resolve to a protected *.vercel.app preview deployment.
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return new URL(fromEnv);
  if (process.env.OPINLY_SITE_URL) return new URL(process.env.OPINLY_SITE_URL);
  return new URL(PRODUCTION_SITE_URL);
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  const locale = await getLocale();
  const title = t("title");
  const description = t("description");

  return {
    metadataBase: resolveMetadataBase(),
    title,
    description,
    openGraph: {
      type: "website",
      siteName: "Reddy Dental",
      locale: locale === "es" ? "es_ES" : "en_US",
      title,
      description,
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: t("ogImageAlt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.jpg"],
    },
  };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();
  // GoogleAnalytics applies to React routes only (e.g. /blog).
  // Static HTML from app/[[...slug]]/route.ts bypasses this layout and
  // receives GA via lib/site-pages.ts → getGoogleAnalyticsHtml().
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
        <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
      </body>
    </html>
  );
}
