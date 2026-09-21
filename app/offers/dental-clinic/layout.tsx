import type { Metadata } from "next";
import type { ReactNode } from "react";
import { GoogleTagManager } from "@next/third-parties/google";
import { GTM_CONTAINER_ID } from "@/lib/analytics";

const title = "Dental Clinic in St. Petersburg, FL | Reddy Dental";
const description =
  "Call Reddy Dental in St. Petersburg for gentle, transparent dental care, accepted insurance plans, and new-patient exam offers.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/offers/dental-clinic/" },
  openGraph: {
    type: "website",
    siteName: "Reddy Dental",
    locale: "en_US",
    url: "/offers/dental-clinic/",
    title,
    description,
    images: [{
      url: "/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "Reddy Dental clinic in St. Petersburg, Florida",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.jpg"],
  },
};

export default function DentalClinicOfferLayout({ children }: { children: ReactNode }) {
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
