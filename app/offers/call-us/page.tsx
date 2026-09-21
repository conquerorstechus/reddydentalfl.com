"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import "./call-us.css";

const PHONE_NUMBER = "727-377-3339";
const PHONE_TEL = `tel:${PHONE_NUMBER}`;
const CONTACT_ENDPOINT =
  "https://n8n.srv1393511.hstgr.cloud/webhook/8e9ccd83-8fbd-47f8-a088-044357d44c2e";

const services = [
  { title: "Emergency dental care", text: "Help for tooth pain, swelling, broken teeth, and other urgent concerns." },
  { title: "Dental implants", text: "Thoughtfully planned tooth replacement with clear guidance at every step." },
  { title: "Cleanings and prevention", text: "Routine care that helps protect your smile and catch concerns early." },
  { title: "Crowns and restorative care", text: "Comfort-focused treatment to repair damaged or weakened teeth." },
  { title: "Cosmetic dentistry", text: "Personalized options for a brighter, more confident smile." },
  { title: "Dentures and bridges", text: "Practical choices to restore comfort, function, and confidence." },
];

const insurancePlans = [
  "Aetna PPO & Medicare",
  "Always Care PPO",
  "Ameritas Classic PPO",
  "Anthem 300/Complete",
  "Cigna Total DPPO",
  "GEHA PPO",
  "Humana PPO & Medicare",
  "LFG PPO",
  "DNoA PPO & Medicare",
  "MetLife PDP Plus",
  "Principal Preferred",
  "United Concordia Elite Plus",
  "United Healthcare PPO & Medicare",
  "Delta Dental PPO & Premier",
  "Florida Blue Access Max",
];

type TrackingWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
};

function getGtag() {
  const trackingWindow = window as TrackingWindow;
  trackingWindow.dataLayer = trackingWindow.dataLayer || [];
  trackingWindow.gtag =
    trackingWindow.gtag ||
    ((...args: unknown[]) => trackingWindow.dataLayer?.push(args));
  return trackingWindow.gtag;
}

function sendGoogleEvent(eventName: string, parameters: Record<string, unknown>) {
  getGtag()("event", eventName, parameters);
}

function formatPhoneInput(value: string) {
  return value.replace(/\D/g, "").slice(0, 10);
}

function CallButton({ dark = false, label = "Call (727) 377-3339" }: { dark?: boolean; label?: string }) {
  return (
    <a
      href={PHONE_TEL}
      data-google-call-tracking="true"
      className={`call-button ${dark ? "call-button-dark" : ""}`}
      aria-label={`Call Reddy Dental at ${PHONE_NUMBER}`}
    >
      <span aria-hidden="true">☎</span>
      {label}
    </a>
  );
}

export default function CallUsOfferPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [careNeed, setCareNeed] = useState("");
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormStatus("loading");

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          source: window.location.href,
          name: name.trim(),
          phoneNumber: phoneNumber.trim(),
          careNeed,
        }),
      });

      if (!response.ok) throw new Error("Request failed");

      sendGoogleEvent("generate_lead", {
        form_name: "google_ads_callback_request",
        care_need: careNeed || "not_selected",
        page_location: window.location.href,
      });
      (window as TrackingWindow).fbq?.("track", "Lead", {
        content_name: "google_ads_callback_request",
      });

      const currentPath = window.location.pathname.endsWith("/")
        ? window.location.pathname
        : `${window.location.pathname}/`;
      router.push(`${currentPath}thank-you/`);
    } catch {
      setFormStatus("error");
    }
  }

  return (
    <main className="lp-page">
      <header className="lp-header">
        <a className="brand" href="/" aria-label="Reddy Dental home">
          <span className="brand-mark" aria-hidden="true">R</span>
          <span><strong>Reddy Dental</strong><small>General &amp; Implant Dentistry</small></span>
        </a>
        <a className="header-phone" href={PHONE_TEL} data-google-call-tracking="true">
          <small>Questions? Call us</small>
          <strong>(727) 377-3339</strong>
        </a>
      </header>

      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-copy">
          <p className="eyebrow">Your local St. Petersburg dentist</p>
          <h1 id="hero-heading">Gentle dental care, with clear answers and no pressure.</h1>
          <p className="hero-lead">
            Dr. Anish Reddy takes time to listen, explain your options, and help you choose care that feels right for your health and your budget.
          </p>
          <div className="hero-points" aria-label="Practice benefits">
            <span>New patients welcome</span>
            <span>Insurance and self-pay options</span>
            <span>Emergency appointments available</span>
          </div>
        </div>
        <div className="hero-image" role="img" aria-label="A welcoming dental office reception">
          <div className="hero-badge"><strong>5-star care</strong><span>from local patients</span></div>
        </div>
      </section>

      <section className="call-strip" aria-label="Call Reddy Dental">
        <div>
          <p>Need a dentist in St. Petersburg?</p>
          <strong>Speak with our friendly team now.</strong>
        </div>
        <CallButton />
      </section>

      <section className="form-section" id="request-callback" aria-labelledby="form-heading">
        <div className="form-intro">
          <p className="eyebrow">Prefer a callback?</p>
          <h2 id="form-heading">Tell us how to reach you.</h2>
          <p>Share a few details and our team will call during office hours. No pressure—just clear next steps.</p>
          <div className="offer-notes">
            <div><strong>$99</strong><span>New patient exam and X-rays for patients without insurance</span></div>
            <div><strong>$59</strong><span>Focused exam and X-ray for a specific dental concern</span></div>
          </div>
        </div>
        <form className="lead-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input required value={name} onChange={(event) => setName(event.target.value)} name="name" type="text" autoComplete="name" />
          </label>
          <label>
            Phone number
            <input
              required
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(formatPhoneInput(event.target.value))}
              name="phoneNumber"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={10}
              pattern="[0-9]{10}"
              title="Enter a 10-digit phone number"
            />
          </label>
          <label>
            How can we help? <span>(optional)</span>
            <select value={careNeed} onChange={(event) => setCareNeed(event.target.value)} name="careNeed">
              <option value="">Choose one</option>
              <option>Tooth pain or emergency</option>
              <option>Dental implants</option>
              <option>New patient exam</option>
              <option>Cleaning or routine care</option>
              <option>Cosmetic dentistry</option>
              <option>Something else</option>
            </select>
          </label>
          <button type="submit" disabled={formStatus === "loading"}>
            {formStatus === "loading" ? "Sending..." : "Request my callback"}
          </button>
          <small className="privacy-note">Your information is used only to contact you about dental care.</small>
          {formStatus === "error" && (
            <p role="alert" className="form-error">We could not send your request. Please call (727) 377-3339.</p>
          )}
        </form>
      </section>

      <section className="trust-section" aria-labelledby="trust-heading">
        <div className="doctor-card">
          <img src="/assets/images/db2b95d2-3eae-40ea-8f30-eb6c3d577b91.webp" alt="Dr. Sajan Anish Reddy" />
          <div><strong>Sajan “Anish” Reddy, DMD</strong><span>University of Florida graduate</span></div>
        </div>
        <div className="trust-copy">
          <p className="eyebrow">Trust is built first. Smiles follow.</p>
          <h2 id="trust-heading">Care that feels personal from the first call.</h2>
          <p>Patients choose Reddy Dental for an honest, welcoming experience where questions are encouraged and treatment is thoughtfully tailored.</p>
          <a className="review-link" href="https://maps.app.goo.gl/MmTH3GryrAqJzzqt9" target="_blank" rel="noreferrer">★★★★★ Read our 5-star Google reviews</a>
        </div>
      </section>

      <section className="services-section" aria-labelledby="services-heading">
        <p className="eyebrow">Dental care for the whole family</p>
        <h2 id="services-heading">How we can help</h2>
        <div className="services-grid">
          {services.map((service, index) => (
            <article className="service-card" key={service.title}>
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="why-section" aria-labelledby="why-heading">
        <div>
          <p className="eyebrow">Why Reddy Dental</p>
          <h2 id="why-heading">A calmer, clearer dental experience.</h2>
        </div>
        <div className="why-grid">
          <article><strong>We listen first</strong><p>Your concerns, comfort, and goals guide the conversation.</p></article>
          <article><strong>Options are explained clearly</strong><p>You will understand what we recommend, why, and what it may cost.</p></article>
          <article><strong>No-pressure decisions</strong><p>Choose care on your timeline with support from a team that treats you like family.</p></article>
        </div>
      </section>

      <section className="insurance-section" aria-labelledby="insurance-heading">
        <div className="insurance-heading">
          <div>
            <p className="eyebrow">Insurance and self-pay welcome</p>
            <h2 id="insurance-heading">We make the financial side easier to understand.</h2>
          </div>
          <p>Coverage varies by plan. Our team will gladly help verify your benefits before treatment.</p>
        </div>
        <div className="insurance-list">
          {insurancePlans.map((plan) => <span key={plan}>{plan}</span>)}
        </div>
        <p className="insurance-note"><strong>No insurance?</strong> Ask about our $99 new patient exam and X-ray offer.</p>
      </section>

      <section className="location-section" aria-labelledby="location-heading">
        <img src="/assets/images/8ce37db2-ec42-4161-a256-8e19d5808b7e.webp" alt="Map showing Reddy Dental in St. Petersburg" />
        <div className="location-copy">
          <p className="eyebrow">Conveniently located in St. Petersburg</p>
          <h2 id="location-heading">Local care, close to home.</h2>
          <address>6751 1st Ave S<br />St. Petersburg, FL 33707</address>
          <p>Easy to reach from St. Pete Beach, Gulfport, South Pasadena, and nearby neighborhoods.</p>
          <a className="directions-button" href="https://maps.app.goo.gl/MmTH3GryrAqJzzqt9" target="_blank" rel="noreferrer">Get directions</a>
        </div>
      </section>

      <section className="final-cta" aria-labelledby="final-heading">
        <p className="eyebrow">Ready when you are</p>
        <h2 id="final-heading">Let’s take the next step together.</h2>
        <p>Call now to ask a question or request an appointment. We’ll help you understand what comes next.</p>
        <div className="final-actions">
          <CallButton dark label="Call now: (727) 377-3339" />
          <a className="text-link" href="#request-callback">Request a callback instead</a>
        </div>
      </section>

      <footer className="lp-footer">
        <span>Reddy Dental · General &amp; Implant Dentistry</span>
        <span>6751 1st Ave S, St. Petersburg, FL 33707</span>
      </footer>

      <a className="mobile-call-bar" href={PHONE_TEL} data-google-call-tracking="true">Call Reddy Dental · (727) 377-3339</a>
    </main>
  );
}
