import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ThankYouContent from "./thank-you-content";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("offers.callUs.thankYouMetadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function CallUsThankYouPage() {
  return <ThankYouContent />;
}
