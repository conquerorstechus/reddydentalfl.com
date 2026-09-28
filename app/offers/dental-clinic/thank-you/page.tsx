import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { LanguageToggle } from "@/components/language-toggle";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("offers.dentalClinic.thankYou.metadata");
  return {
    title: t("title"),
    description: t("description"),
    robots: { index: false, follow: false },
  };
}

export default async function DentalClinicThankYouPage() {
  const t = await getTranslations("offers.dentalClinic.thankYou");

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <LanguageToggle appearance="pill" />
        </div>
        <div style={styles.kicker}>{t("kicker")}</div>
        <section style={styles.thankYouSection} aria-labelledby="thank-you-heading">
          <h1 id="thank-you-heading" style={styles.thankYouTitle}>{t("title")}</h1>
          <p style={styles.thankYouText}>{t("body")}</p>
          <a href="tel:727-377-3339" data-google-call-tracking="true" style={styles.callButton}>{t("callOffice")}</a>
        </section>
        <div style={styles.footerLinkRow}>
          <Link href="/offers/dental-clinic/" style={styles.backLink}>{t("backToOffer")}</Link>
          <a href="/" style={styles.backLink}>{t("backToHome")}</a>
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", display: "flex", justifyContent: "center", padding: "32px 20px 72px", background: "linear-gradient(180deg, #f4f9ff 0%, #edf4fb 100%)", color: "#11233d", fontFamily: "Arial, Helvetica, sans-serif" },
  hero: { width: "100%", maxWidth: "1120px", background: "#fff", borderRadius: "26px", border: "1px solid rgba(17,35,61,0.08)", boxShadow: "0 24px 60px rgba(17,35,61,0.08)", padding: "36px 28px" },
  kicker: { display: "inline-flex", background: "#eaf3ff", color: "#184d8c", borderRadius: "999px", padding: "8px 16px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" },
  thankYouSection: { marginTop: "34px", padding: "32px 28px", borderRadius: "20px", background: "#10263f", color: "#fff" },
  thankYouTitle: { margin: 0, fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.1, letterSpacing: "-0.04em" },
  thankYouText: { margin: "16px 0 0", color: "#dce9f7", fontSize: "1.08rem", lineHeight: 1.6 },
  callButton: { display: "inline-flex", marginTop: "22px", minHeight: "50px", padding: "0 22px", alignItems: "center", borderRadius: "999px", background: "#d9b748", color: "#10263f", textDecoration: "none", fontWeight: 800 },
  footerLinkRow: { display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "22px" },
  backLink: { color: "#1d5aa7", textDecoration: "none", fontWeight: 700 },
};
