import type { Metadata } from "next";
import type { ReactNode } from "react";
import { GoogleTagManager } from "@next/third-parties/google";
import { GTM_CONTAINER_ID } from "@/lib/analytics";
import { LanguageProvider } from "./language-provider";

const title = "Gentle Dentist in St. Petersburg, FL | Reddy Dental";
const description =
  "Call Reddy Dental in St. Petersburg for gentle dental care, emergency appointments, implants, new-patient offers, and clear answers without pressure.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/offers/call-us/" },
  openGraph: {
    type: "website",
    siteName: "Reddy Dental",
    locale: "en_US",
    url: "/offers/call-us/",
    title,
    description,
    images: [{
      url: "/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "Reddy Dental in St. Petersburg, Florida",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.jpg"],
  },
};

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
      <LanguageProvider>{children}</LanguageProvider>
    </>
  );
}
