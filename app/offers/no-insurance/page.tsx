import { getTranslations } from "next-intl/server";
import { LanguageToggle } from "@/components/language-toggle";
import "./no-insurance.css";

export default async function NoInsuranceOfferPage() {
  const t = await getTranslations("offers.noInsurance");
  const included = t.raw("included") as string[];
  const reasons = t.raw("reasons") as string[];

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
          <LanguageToggle appearance="pill" />
        </div>
        <div style={styles.kicker}>{t("kicker")}</div>

        <div style={styles.topRow} className="top-row">
          <div>
            <p style={styles.eyebrow}>{t("brand")}</p>
            <h1 style={styles.title}>{t("title")}</h1>
          </div>
          <a href="tel:7273773339" style={styles.primaryButton} className="primary-btn">
            {t("call")}
          </a>
        </div>

        <p style={styles.subtitle}>{t("subtitle")}</p>

        <div style={styles.featuresGrid}>
          {included.map((item) => (
            <div key={item} style={styles.featureCard}>
              <span style={styles.check}>✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div style={styles.cardRow}>
          <div style={styles.infoCard}>
            <p style={styles.cardLabel}>{t("offerPriceLabel")}</p>
            <div style={styles.price}>{t("price")}</div>
            <p style={styles.cardText}>{t("offerPriceText")}</p>
          </div>

          <div style={styles.infoCard}>
            <p style={styles.cardLabel}>{t("whyLabel")}</p>
            <ul style={styles.bullets}>
              {reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </div>
        </div>

        <div style={styles.bottomRow} className="bottom-row">
          <p style={styles.bottomText}>{t("bottomText")}</p>
          <a href="tel:7273773339" style={styles.secondaryButton} className="secondary-btn">
            {t("callOffice")}
          </a>
        </div>

        <div style={styles.footerLinkRow}>
          <a href="/" style={styles.backLink}>{t("backToHome")}</a>
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 20px 72px",
    background: "linear-gradient(180deg, #f4f9ff 0%, #edf4fb 100%)",
    color: "#11233d",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  hero: {
    width: "100%",
    maxWidth: "1100px",
    background: "#fff",
    borderRadius: "26px",
    border: "1px solid rgba(17,35,61,0.08)",
    boxShadow: "0 24px 60px rgba(17,35,61,0.08)",
    padding: "36px 28px",
  },
  kicker: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#eaf3ff",
    color: "#184d8c",
    borderRadius: "999px",
    padding: "8px 16px",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
  },
  topRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "20px",
    marginTop: "18px",
  },
  eyebrow: {
    margin: 0,
    color: "#4672a8",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },
  title: {
    margin: "10px 0 0",
    fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
    lineHeight: 1.02,
    letterSpacing: "-0.06em",
    maxWidth: "760px",
  },
  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "58px",
    padding: "0 28px",
    borderRadius: "999px",
    background: "linear-gradient(180deg, #ffd75c 0%, #f7c948 100%)",
    color: "#1b2d3d",
    textDecoration: "none",
    fontWeight: 800,
    boxShadow: "0 12px 26px rgba(247, 201, 73, 0.35)",
    whiteSpace: "nowrap",
  },
  subtitle: {
    margin: "26px 0 0",
    maxWidth: "760px",
    color: "#465d79",
    fontSize: "1.08rem",
    lineHeight: 1.7,
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginTop: "28px",
  },
  featureCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "18px 16px",
    borderRadius: "16px",
    border: "1px solid rgba(17,35,61,0.08)",
    background: "#f7fbff",
    color: "#1a2d42",
    fontWeight: 600,
  },
  check: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "24px",
    height: "24px",
    borderRadius: "999px",
    background: "#dfeeff",
    color: "#0d5bb5",
    fontWeight: 900,
  },
  cardRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "18px",
    marginTop: "28px",
  },
  infoCard: {
    background: "#f8fbff",
    border: "1px solid rgba(17,35,61,0.08)",
    borderRadius: "18px",
    padding: "22px 20px",
  },
  cardLabel: {
    margin: 0,
    fontSize: "12px",
    fontWeight: 800,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#4672a8",
  },
  price: {
    marginTop: "12px",
    fontSize: "2.5rem",
    fontWeight: 800,
    color: "#10263f",
    letterSpacing: "-0.04em",
  },
  cardText: {
    margin: "12px 0 0",
    color: "#455d79",
    lineHeight: 1.6,
  },
  bullets: {
    margin: "14px 0 0",
    paddingLeft: "20px",
    color: "#304c6b",
    lineHeight: 1.8,
  },
  bottomRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "20px",
    marginTop: "30px",
    paddingTop: "24px",
    borderTop: "1px solid rgba(17,35,61,0.08)",
  },
  bottomText: {
    margin: 0,
    color: "#2d4866",
    fontSize: "1.02rem",
    fontWeight: 600,
  },
  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "52px",
    padding: "0 22px",
    borderRadius: "999px",
    background: "#0f213a",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  footerLinkRow: {
    marginTop: "22px",
  },
  backLink: {
    color: "#1d5aa7",
    textDecoration: "none",
    fontWeight: 700,
  },
};
