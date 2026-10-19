import type { Metadata } from "next";
import type { ReactNode } from "react";
import ConsentTagManager from "@/components/consent-tag-manager";
import { getLocale, getTranslations } from "next-intl/server";
import { DEFAULT_SOCIAL_IMAGE } from "@/lib/site-origin";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("offers.dentalClinic.metadata");
  const locale = await getLocale();
  const title = t("title");
  const description = t("description");

  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: { canonical: "/offers/dental-clinic/" },
    openGraph: {
      type: "website",
      siteName: "Reddy Dental",
      locale: locale === "es" ? "es_ES" : "en_US",
      url: "/offers/dental-clinic/",
      title,
      description,
      images: [{
        url: DEFAULT_SOCIAL_IMAGE.path,
        width: DEFAULT_SOCIAL_IMAGE.width,
        height: DEFAULT_SOCIAL_IMAGE.height,
        alt: t("ogImageAlt"),
      }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_SOCIAL_IMAGE.path],
    },
  };
}

export default function DentalClinicOfferLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ConsentTagManager />
      {children}
    </>
  );
}
