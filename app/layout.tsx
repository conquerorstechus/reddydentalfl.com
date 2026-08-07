import type { Metadata } from "next";
import type { ReactNode } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";

function resolveMetadataBase(): URL {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
  return new URL(fromEnv || "https://reddydentalfl.com");
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
  return (
    <html lang="en">
      <body>
        {children}
        <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
      </body>
    </html>
  );
}
