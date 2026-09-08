"use client";

import { FormEvent, MouseEvent, useEffect, useState } from "react";
import Link from "next/link";
import { GOOGLE_ADS_WEBSITE_CALL_LABEL } from "@/lib/analytics";

const PHONE_NUMBER = "727-377-3339";
const PHONE_TEL = `tel:${PHONE_NUMBER}`;

type TrackingWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

function getGtag() {
  const trackingWindow = window as TrackingWindow;
  trackingWindow.dataLayer = trackingWindow.dataLayer || [];
  trackingWindow.gtag =
    trackingWindow.gtag ||
    ((...args: unknown[]) => {
      trackingWindow.dataLayer?.push(args);
    });
  return trackingWindow.gtag;
}

function sendGoogleEvent(eventName: string, parameters: Record<string, unknown>) {
  getGtag()("event", eventName, parameters);
}
const CONTACT_ENDPOINT =
  "https://n8n.srv1393511.hstgr.cloud/webhook/8e9ccd83-8fbd-47f8-a088-044357d44c2e";

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
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    getGtag()("config", GOOGLE_ADS_WEBSITE_CALL_LABEL, {
      phone_conversion_number: PHONE_NUMBER,
      phone_conversion_callback: (_formattedNumber: string, mobileNumber: string) => {
        document
          .querySelectorAll<HTMLAnchorElement>('a[data-google-call-tracking="true"]')
          .forEach((link) => {
            link.href = `tel:${mobileNumber}`;
          });
      },
    });
  }, []);

  function handleCallClick(event: MouseEvent<HTMLAnchorElement>) {
    sendGoogleEvent("click_to_call", {
      phone_number: PHONE_NUMBER,
      link_url: event.currentTarget.href,
      page_location: window.location.href,
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormStatus("loading");

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: "https://www.reddydentalfl.com/offers/call-us/",
          name: name.trim(),
          phoneNumber: phoneNumber.trim(),
        }),
      });

      if (response.ok) {
        sendGoogleEvent("generate_lead", {
          form_name: "callback_request",
          page_location: window.location.href,
        });
        setFormStatus("success");
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.kicker}>Dental offers</div>

        <div style={styles.topRow}>
          <div>
            <p style={styles.eyebrow}>Reddy Dental</p>
            <h1 style={styles.title}>Whether you have insurance or not, you&apos;re in caring hands.</h1>
          </div>
          <a href={PHONE_TEL} onClick={handleCallClick} data-google-call-tracking="true" style={styles.primaryButton}>
            Call the office
          </a>
        </div>

        <p style={styles.subtitle}>
          We take the time to listen, explain every procedure patiently, and help you choose care that feels right for your health and your budget.
        </p>

        <details style={styles.insuranceSection}>
          <summary style={styles.insuranceSummary}>
            <span>
              <span style={styles.cardLabel}>Insurance patients</span>
              <span id="insurance-heading" style={styles.sectionTitle}>Insurance plans we accept</span>
            </span>
            <span style={styles.summaryHint}>View accepted plans</span>
          </summary>
          <p style={styles.effectiveNote}>Coverage can vary by plan. We&apos;ll gladly help verify your benefits.</p>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead><tr><th scope="col" style={styles.th}>Carrier</th><th scope="col" style={styles.th}>Plans we accept</th></tr></thead>
              <tbody>{insurancePlans.map((plan) => <tr key={plan.carrier}><th scope="row" style={styles.td}>{plan.carrier}</th><td style={styles.td}>{plan.plans}</td></tr>)}</tbody>
            </table>
          </div>
        </details>

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
          <a href={PHONE_TEL} onClick={handleCallClick} data-google-call-tracking="true" style={styles.claimButton}>
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
          <a href={PHONE_TEL} onClick={handleCallClick} data-google-call-tracking="true" style={styles.claimButton}>
            Call the office
          </a>
        </section>

        <div style={styles.bottomRow}>
          <p style={styles.bottomText}>
            Questions at any hour? Call now for an appointment as early as tomorrow.
          </p>
          <a href={PHONE_TEL} onClick={handleCallClick} data-google-call-tracking="true" style={styles.secondaryButton}>
            Call the office now
          </a>
        </div>

        <section style={styles.callbackSection} aria-labelledby="callback-heading">
          <p style={styles.cardLabel}>Prefer a callback?</p>
          <h2 id="callback-heading" style={{ ...styles.sectionTitle, ...styles.callbackTitle }}>Tell us where to reach you.</h2>
          <p style={{ ...styles.cardText, ...styles.callbackText }}>Share your name and phone number and our team will get back to you.</p>
          <form onSubmit={handleSubmit} style={styles.callbackForm}>
            <label style={styles.fieldLabel}>
              Name
              <input required value={name} onChange={(event) => setName(event.target.value)} style={styles.input} name="name" type="text" autoComplete="name" />
            </label>
            <label style={styles.fieldLabel}>
              Phone number
              <input required value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} style={styles.input} name="phoneNumber" type="tel" autoComplete="tel" />
            </label>
            <button type="submit" style={styles.submitButton} disabled={formStatus === "loading"}>
              {formStatus === "loading" ? "Sending..." : "Request a callback"}
            </button>
          </form>
          {formStatus === "success" && <p role="status" style={styles.successMessage}>Thanks. We&apos;ll be in touch shortly.</p>}
          {formStatus === "error" && <p role="alert" style={styles.errorMessage}>Something went wrong. Please call us at 727-377-3339.</p>}
        </section>

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
  insuranceSummary: {
    display: "flex",
    alignItems: "end",
    justifyContent: "space-between",
    gap: "18px",
    cursor: "pointer",
    listStyle: "none",
    padding: "20px 22px",
    border: "1px solid #dbe9f7",
    borderRadius: "16px",
    background: "#f8fbff",
  },
  summaryHint: {
    color: "#1d5aa7",
    fontSize: "0.9rem",
    fontWeight: 700,
    whiteSpace: "nowrap",
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
    display: "block",
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
  callbackSection: {
    marginTop: "34px",
    padding: "26px 24px",
    borderRadius: "20px",
    background: "#10263f",
    color: "#fff",
  },
  callbackForm: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    alignItems: "end",
    gap: "14px",
    marginTop: "20px",
  },
  fieldLabel: {
    display: "grid",
    gap: "7px",
    color: "#dce9f7",
    fontSize: "0.82rem",
    fontWeight: 700,
  },
  input: {
    minHeight: "48px",
    padding: "0 13px",
    border: "1px solid #b8cee4",
    borderRadius: "8px",
    background: "#fff",
    color: "#10263f",
    font: "inherit",
    fontWeight: 400,
  },
  submitButton: {
    minHeight: "48px",
    padding: "0 20px",
    border: 0,
    borderRadius: "8px",
    background: "#ffd75c",
    color: "#1b2d3d",
    font: "inherit",
    fontWeight: 800,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  callbackTitle: {
    color: "#fff",
  },
  callbackText: {
    color: "#dce9f7",
  },
  successMessage: {
    margin: "16px 0 0",
    color: "#d7f1df",
    fontWeight: 600,
  },
  errorMessage: {
    margin: "16px 0 0",
    color: "#ffd5d5",
    fontWeight: 600,
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
