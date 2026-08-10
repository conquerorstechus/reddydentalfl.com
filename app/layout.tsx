import type { Metadata } from "next";
import type { ReactNode } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
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

export const metadata: Metadata = {
  metadataBase: resolveMetadataBase(),
  title: "Dentist Near Me in St. Petersburg, FL | Reddy Dental",
  description:
    "Reddy Dental is a dentist near me located in St. Petersburg, FL 33707 for all your family and cosmetic dentistry needs.",
  openGraph: {
    type: "website",
    siteName: "Reddy Dental",
    locale: "en_US",
    title: "Dentist Near Me in St. Petersburg, FL | Reddy Dental",
    description:
      "Reddy Dental is a dentist near me located in St. Petersburg, FL 33707 for all your family and cosmetic dentistry needs.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dentist Near Me in St. Petersburg, FL | Reddy Dental",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dentist Near Me in St. Petersburg, FL | Reddy Dental",
    description:
      "Reddy Dental is a dentist near me located in St. Petersburg, FL 33707 for all your family and cosmetic dentistry needs.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  // GoogleAnalytics applies to React routes only (e.g. /blog).
  // Static HTML from app/[[...slug]]/route.ts bypasses this layout and
  // receives GA via lib/site-pages.ts → getGoogleAnalyticsHtml().
  return (
    <html lang="en">
      <body>{children}</body>
      <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
    </html>
  );
}
