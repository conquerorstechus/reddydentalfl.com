import Link from "next/link";

const includedServices = [
  "Comprehensive dental exam",
  "Full digital x-rays",
  "Treatment consultation and evaluation",
  "Personalized care plan for uninsured patients",
];

export default function NoInsuranceOfferPage() {
  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.kicker}>Uninsured patient offer</div>

        <div style={styles.topRow}>
          <div>
            <p style={styles.eyebrow}>Reddy Dental</p>
            <h1 style={styles.title}>No Insurance? Get a full exam and x-rays for just $99.</h1>
          </div>
          <a href="tel:7273773339" style={styles.primaryButton}>
            Call (727) 377-3339
          </a>
        </div>

        <p style={styles.subtitle}>
          Includes a full dental evaluation and digital x-rays so you can get a clear picture of your oral health without the surprise cost.
        </p>

        <div style={styles.featuresGrid}>
          {includedServices.map((item) => (
            <div key={item} style={styles.featureCard}>
              <span style={styles.check}>✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div style={styles.cardRow}>
          <div style={styles.infoCard}>
            <p style={styles.cardLabel}>Offer price</p>
            <div style={styles.price}>$99</div>
            <p style={styles.cardText}>For uninsured patients who want a straightforward, affordable starting point.</p>
          </div>

          <div style={styles.infoCard}>
            <p style={styles.cardLabel}>Why patients choose us</p>
            <ul style={styles.bullets}>
              <li>Comfort-focused care</li>
              <li>Clear treatment recommendations</li>
              <li>Flexible next steps for your budget</li>
            </ul>
          </div>
        </div>

        <div style={styles.bottomRow}>
          <p style={styles.bottomText}>Need answers before you book? Speak with our team today.</p>
          <a href="tel:7273773339" style={styles.secondaryButton}>
            Call the office now
          </a>
        </div>

        <div style={styles.footerLinkRow}>
          <Link href="/" style={styles.backLink}>← Back to home</Link>
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
