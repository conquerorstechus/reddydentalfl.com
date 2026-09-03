import Link from "next/link";

const PHONE_TEL = "tel:727-377-3339";

const insurancePlans = [
  { carrier: "Aetna", plans: "PPO and Medicare" },
  { carrier: "Always Care", plans: "PPO" },
  { carrier: "Ameritas", plans: "Classic PPO" },
  { carrier: "Anthem", plans: "300/Complete" },
  { carrier: "Cigna", plans: "Total DPPO" },
  { carrier: "GEHA", plans: "PPO" },
  { carrier: "Humana", plans: "PPO and Medicare" },
  { carrier: "LFG", plans: "PPO plans" },
  { carrier: "DNoA", plans: "PPO and Medicare" },
  { carrier: "MetLife", plans: "PDP Plus" },
  { carrier: "Principal", plans: "Principal Preferred" },
  { carrier: "United Concordia", plans: "Elite Plus" },
  { carrier: "United Healthcare", plans: "Medicare and PPO" },
  { carrier: "Delta Dental", plans: "PPO and Premier" },
  { carrier: "Florida Blue", plans: "BlueDental Access Max" },
];

export default function CallUsOfferPage() {
  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.kicker}>Dental offers</div>

        <div style={styles.topRow}>
          <div>
            <p style={styles.eyebrow}>Reddy Dental</p>
            <h1 style={styles.title}>Let&apos;s find the right way to care for your smile.</h1>
          </div>
          <a href={PHONE_TEL} style={styles.primaryButton}>
            Call the office
          </a>
        </div>

        <p style={styles.subtitle}>
          Have questions about your insurance or need an appointment? Call our friendly team. We&apos;ll explain your options in simple terms and help you find a time that works for you.
        </p>

        <section style={styles.insuranceSection} aria-labelledby="insurance-heading">
          <div style={styles.insuranceHeader}>
            <div>
              <p style={styles.cardLabel}>Insurance patients</p>
              <h2 id="insurance-heading" style={styles.sectionTitle}>
                Insurance plans we accept
              </h2>
            </div>
            <p style={styles.effectiveNote}>Coverage can vary by plan</p>
          </div>

          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th scope="col" style={styles.th}>Carrier</th>
                  <th scope="col" style={styles.th}>Plans we accept</th>
                </tr>
              </thead>
              <tbody>
                {insurancePlans.map((plan) => (
                  <tr key={plan.carrier}>
                    <th scope="row" style={styles.td}>
                      {plan.carrier}
                    </th>
                    <td style={styles.td}>{plan.plans}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section style={styles.offerBanner} aria-labelledby="no-insurance-heading">
          <div style={styles.price}>$99</div>
          <div style={styles.offerCopy}>
            <p style={styles.cardLabel}>No insurance? No problem.</p>
            <h2 id="no-insurance-heading" style={styles.sectionTitle}>
              New patient exam and X-rays
            </h2>
            <p style={styles.cardText}>
              New patients without dental insurance can receive a complete exam, including X-rays, for just $99. We&apos;ll listen to your concerns, check your oral health, and explain your options clearly.
            </p>
          </div>
          <a href={PHONE_TEL} style={styles.claimButton}>
            Call the office
          </a>
        </section>

        <section style={styles.offerBannerSecond} aria-labelledby="limited-exam-heading">
          <div style={styles.price}>$59</div>
          <div style={styles.offerCopy}>
            <p style={styles.cardLabel}>Need care now?</p>
            <h2 id="limited-exam-heading" style={styles.sectionTitle}>
              Focused exam and X-ray
            </h2>
            <p style={styles.cardText}>
              Have a specific dental concern? Start with a focused exam and X-ray for just $59. We&apos;ll identify the issue, explain the next steps, and, when appropriate, call in an antibiotic for an infection.
            </p>
          </div>
          <a href={PHONE_TEL} style={styles.claimButton}>
            Call the office
          </a>
        </section>

        <div style={styles.bottomRow}>
          <p style={styles.bottomText}>
            Questions at any hour? Call now for an appointment as early as tomorrow.
          </p>
          <a href={PHONE_TEL} style={styles.secondaryButton}>
            Call the office now
          </a>
        </div>

        <div style={styles.footerLinkRow}>
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
    maxWidth: "760px",
    fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
    lineHeight: 1.02,
    letterSpacing: "-0.06em",
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
    maxWidth: "800px",
    color: "#465d79",
    fontSize: "1.08rem",
    lineHeight: 1.7,
  },
  insuranceSection: {
    marginTop: "34px",
  },
  insuranceHeader: {
    display: "flex",
    alignItems: "end",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "12px",
  },
  cardLabel: {
    margin: 0,
    color: "#4672a8",
    fontSize: "12px",
    fontWeight: 800,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },
  sectionTitle: {
    margin: "8px 0 0",
    color: "#10263f",
    fontSize: "clamp(1.6rem, 3vw, 2.35rem)",
    lineHeight: 1.1,
    letterSpacing: "-0.04em",
  },
  effectiveNote: {
    margin: 0,
    color: "#617894",
    fontSize: "0.9rem",
  },
  tableWrap: {
    marginTop: "18px",
    overflowX: "auto",
    border: "1px solid rgba(17,35,61,0.1)",
    borderRadius: "16px",
  },
  table: {
    width: "100%",
    minWidth: "520px",
    borderCollapse: "collapse",
    color: "#304c6b",
    fontSize: "0.95rem",
  },
  th: {
    padding: "15px 14px",
    background: "#10263f",
    color: "#fff",
    textAlign: "left",
    fontSize: "0.76rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  td: {
    padding: "13px 14px",
    borderTop: "1px solid rgba(17,35,61,0.08)",
    textAlign: "left",
    lineHeight: 1.4,
  },
  offerBanner: {
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    alignItems: "center",
    gap: "22px",
    marginTop: "30px",
    padding: "24px",
    borderRadius: "20px",
    background: "#f8fbff",
    border: "1px solid #dbe9f7",
  },
  offerBannerSecond: {
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    alignItems: "center",
    gap: "22px",
    marginTop: "16px",
    padding: "24px",
    borderRadius: "20px",
    background: "#f8fbff",
    border: "1px solid #dbe9f7",
  },
  price: {
    color: "#0d5bb5",
    fontSize: "clamp(2.5rem, 6vw, 4.25rem)",
    fontWeight: 800,
    letterSpacing: "-0.06em",
  },
  offerCopy: {
    minWidth: 0,
  },
  cardText: {
    margin: "12px 0 0",
    color: "#455d79",
    lineHeight: 1.6,
  },
  claimButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "50px",
    padding: "0 20px",
    borderRadius: "999px",
    background: "#0f213a",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 700,
    whiteSpace: "nowrap",
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
