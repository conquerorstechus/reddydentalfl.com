import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Thank You | Reddy Dental",
  description: "Your callback request has been received. Our team will get back to you shortly.",
};

export default function CallUsThankYouPage() {
  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.kicker}>Dental offers</div>

        <section style={styles.thankYouSection} aria-labelledby="thank-you-heading">
          <h1 id="thank-you-heading" style={styles.thankYouTitle}>Thank You!</h1>
          <p style={styles.thankYouText}>Your request has been received successfully.</p>
          <p style={styles.thankYouText}>Our team will get back to you shortly.</p>
        </section>

        <div style={styles.footerLinkRow}>
          <Link href="/offers/call-us/" style={styles.backLink}>
            Back to offers
          </Link>
          <Link href="/" style={styles.backLink}>
            Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    padding: "32px 20px 72px",
    background: "linear-gradient(180deg, #f4f9ff 0%, #edf4fb 100%)",
    color: "#11233d",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  hero: {
    width: "100%",
    maxWidth: "1120px",
    background: "#fff",
    borderRadius: "26px",
    border: "1px solid rgba(17,35,61,0.08)",
    boxShadow: "0 24px 60px rgba(17,35,61,0.08)",
    padding: "36px 28px",
  },
  kicker: {
    display: "inline-flex",
    background: "#eaf3ff",
    color: "#184d8c",
    borderRadius: "999px",
    padding: "8px 16px",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
  },
  thankYouSection: {
    marginTop: "34px",
    padding: "32px 28px",
    borderRadius: "20px",
    background: "#10263f",
    color: "#fff",
  },
  thankYouTitle: {
    margin: 0,
    fontSize: "clamp(2rem, 4vw, 3rem)",
    lineHeight: 1.1,
    letterSpacing: "-0.04em",
  },
  thankYouText: {
    margin: "16px 0 0",
    color: "#dce9f7",
    fontSize: "1.08rem",
    lineHeight: 1.6,
  },
  footerLinkRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    marginTop: "22px",
  },
  backLink: {
    color: "#1d5aa7",
    textDecoration: "none",
    fontWeight: 700,
  },
};
