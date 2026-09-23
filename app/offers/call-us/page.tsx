"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import "./call-us.css";

const PHONE_NUMBER = "727-377-3339";
const PHONE_TEL = `tel:${PHONE_NUMBER}`;
const CONTACT_ENDPOINT =
  "https://n8n.srv1393511.hstgr.cloud/webhook/8e9ccd83-8fbd-47f8-a088-044357d44c2e";
const GOOGLE_REVIEWS_URL = "https://maps.app.goo.gl/MmTH3GryrAqJzzqt9";

const googleReviews = [
  {
    name: "Dawn Bell",
    meta: "1 review · 4 photos",
    date: "4 months ago",
    initial: "D",
    avatarColor: "#5f6368",
    text:
      "I've worked with Dr Reddy's father for year's and have known him since he was a child. I came in today for my new patient exam and am impressed with the office. It is a brand new build out. All the equipment is state of the art. His assistant and front desk were so super friendly and he has an office dog named Happy who is the cutest thing ever. Im looking forward to coming back for my cleanings twice a year.",
  },
  {
    name: "Alyssa",
    meta: "Local Guide · 26 reviews · 13 photos",
    date: "2 months ago",
    initial: "A",
    avatarColor: "#1a73e8",
    text:
      "We recently went in for a second opinion for my husband, who needed a lot of dental work and I'm so glad we did. Dr. Reddy was incredibly kind and knowledgeable. He took his time explaining everything clearly, never rushed us and made the whole experience easy. He was also so sweet with our son, even letting him play with his adorable dog which made the visit feel extra comfortable. The office is spotless, the front staff is friendly, and the whole atmosphere is genuinely welcoming. We left feeling cared for and are grateful. Highly recommend.",
  },
  {
    name: "Milan Patel",
    meta: "3 reviews · 1 photo",
    date: "2 months ago",
    initial: "M",
    avatarColor: "#e8710a",
    text:
      "I had a great experience at Reddy Dental! Nikki at the front desk was welcomed me and I was seen almost immediately after by Dr Reddy! It's nice seeing some place actually honor appointment times!! Big win! Dr Reddy made me feel comfortable and explained my options, he took his time. I'm excited to finally have a Dentist that is reliable and treats me like an individual.",
  },
];

const officeHours = [
  { day: "Monday", hours: "9:00am - 5:00pm" },
  { day: "Tuesday", hours: "9:00am - 5:00pm" },
  { day: "Wednesday", hours: "9:00am - 5:00pm" },
  { day: "Thursday", hours: "9:00am - 5:00pm" },
  { day: "Friday", hours: "9:00am - 5:00pm" },
  { day: "Saturday", hours: "9:00am - 5:00pm" },
  { day: "Sunday", hours: "9:00am - 5:00pm" },
];

const offerServices = [
  "Preventive Dentistry",
  "Restorative Dentistry",
  "Cosmetic Dentistry",
  "Implant Dentistry",
  "Emergency Dental Care",
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

function CallButton({ dark = false, label = "Call now" }: { dark?: boolean; label?: string }) {
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
  const [summary, setSummary] = useState("");
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
          summary: summary.trim(),
        }),
      });

      if (!response.ok) throw new Error("Request failed");

      sendGoogleEvent("generate_lead", {
        form_name: "google_ads_callback_request",
        care_need: summary.trim() || "not_provided",
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
          <img
            src="/assets/images/reddy-dental-logo-light-bg.svg"
            alt="Reddy Dental — General & Implant Dentistry"
            className="brand-logo"
            width={250}
            height={50}
          />
        </a>
        <a
          className="header-phone"
          href={PHONE_TEL}
          data-google-call-tracking="true"
          aria-label={`Call Reddy Dental at ${PHONE_NUMBER}`}
        >
          <span className="header-phone-icon" aria-hidden="true">☎</span>
          <strong>Call now</strong>
        </a>
      </header>

      <section className="hero-banner" aria-labelledby="hero-heading">
        <div className="hero-banner-inner">
          <div className="hero-banner-copy">
            <h1 id="hero-heading">Need a Dentist in St.&nbsp;Petersburg, FL?</h1>
            <p className="hero-subtitle">Personalized Dental Care for New &amp; Existing Patients</p>
            <p className="hero-description">
              Preventive, restorative, cosmetic, implant and emergency dental care in a comfortable, patient-focused environment.
            </p>
            <CallButton label="Call now" />
            <p className="hero-note">New Patients Welcome | St. Petersburg, FL</p>
          </div>
          <div className="hero-banner-image-wrap">
            <img
              src="/assets/images/img_8775.webp"
              alt="Modern dental operatory at Reddy Dental in St. Petersburg, FL"
              className="hero-banner-image"
            />
          </div>
        </div>
        <div className="hero-banner-curve" aria-hidden="true" />
      </section>

      <section className="form-section" id="request-callback" aria-label="Request a callback">
        <form className="lead-form" onSubmit={handleSubmit}>
          <div className="lead-form-row">
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
            <label className="lead-form-summary">
              Summary <span>(optional)</span>
              <textarea
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
                name="summary"
                rows={1}
                placeholder="Tell us briefly what you need help with"
              />
            </label>
            <button className="lead-form-submit" type="submit" disabled={formStatus === "loading"}>
              {formStatus === "loading" ? "Sending..." : "Request my callback"}
            </button>
          </div>
          <small className="privacy-note">Your information is used only to contact you about dental care.</small>
          {formStatus === "error" && (
            <p role="alert" className="form-error">We could not send your request. Please call (727) 377-3339.</p>
          )}
        </form>
      </section>

      <section className="reviews-section" aria-labelledby="reviews-heading">
        <div className="reviews-header">
          <div>
            <p className="eyebrow">Patient reviews</p>
            <h2 id="reviews-heading">What patients are saying</h2>
          </div>
          <a className="reviews-google-link" href={GOOGLE_REVIEWS_URL} target="_blank" rel="noreferrer">
            <img src="/assets/google_stars.svg" alt="" width={130} height={24} />
            <span>Read more on Google</span>
          </a>
        </div>
        <div className="reviews-list">
          {googleReviews.map((review) => (
            <article className="review-card" key={review.name}>
              <div className="review-top">
                <div className="review-avatar" style={{ backgroundColor: review.avatarColor }} aria-hidden="true">
                  {review.initial}
                </div>
                <div className="review-author">
                  <strong>{review.name}</strong>
                  <span>{review.meta}</span>
                </div>
              </div>
              <div className="review-rating">
                <span className="review-stars" aria-label="5 out of 5 stars">★★★★★</span>
                <span className="review-date">{review.date}</span>
              </div>
              <p className="review-text">{review.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="offer-services-section" aria-labelledby="offer-services-heading">
        <p className="eyebrow">Our services</p>
        <h2 id="offer-services-heading">Comprehensive care for every smile</h2>
        <div className="offer-services-panel">
          <div className="offer-services-grid">
            {offerServices.map((service, index) => (
              <div className="offer-service-box" key={service}>
                <span className="offer-service-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="offer-service-title">{service}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="section-cta">
          <a className="book-button" href="#request-callback">Book an Appointment</a>
        </div>
      </section>

      <section className="trust-section" aria-labelledby="trust-heading">
        <div className="trust-section-header">
          <h2 id="trust-heading">About Us</h2>
          <p className="eyebrow">Trust is built first. Smiles follow.</p>
        </div>
        <div className="doctor-card">
          <img src="/assets/images/img_8777.webp" alt="Dr. Sajan Anish Reddy" />
          <div><strong>Dr. Sajan “Anish” Reddy, DMD</strong><span>University of Florida graduate</span></div>
        </div>
        <div className="trust-copy">
          <p className="trust-bio">
            Dr. Sajan Anish Reddy, DMD, was drawn to dentistry for its unique blend of precision, problem-solving, and the ability to make an immediate, meaningful impact on a person&apos;s confidence and quality of life. He earned his Doctor of Dental Medicine degree from the University of Florida and has over five years of clinical experience, including extensive hands-on patient care during his training. Dr. Reddy is licensed to practice in Florida, Georgia, Tennessee, Alabama, South Carolina, North Carolina, Missouri, and Wisconsin, and is an active member of the American Dental Association and Florida Dental Association.
          </p>
        </div>
      </section>

      <section className="insurance-section" aria-labelledby="insurance-heading">
        <p className="eyebrow">Insurance and self-pay welcome</p>
        <h2 id="insurance-heading">Affordable options for patients with and without insurance.</h2>
        <p className="insurance-intro">Coverage varies by plan. Our team will gladly help verify your benefits before treatment.</p>
        <div className="offer-notes insurance-offers">
          <div><strong>$99</strong><span>New patient exam and X-rays for patients without insurance</span></div>
          <div><strong>$59</strong><span>Focused exam and X-ray for a specific dental concern</span></div>
        </div>
        <div className="section-cta">
          <a className="book-button" href="#request-callback">Book an Appointment</a>
        </div>
      </section>

      <section className="final-cta" aria-labelledby="final-heading">
        <p className="eyebrow">Ready when you are</p>
        <h2 id="final-heading">Let’s take the next step together.</h2>
        <p>Call now to ask a question or request an appointment. We’ll help you understand what comes next.</p>
        <div className="final-actions">
          <CallButton dark />
          <a className="text-link" href="#request-callback">Request a callback instead</a>
        </div>
      </section>

      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-location">
            <p className="lp-footer-label">Location</p>
            <strong>Reddy Dental</strong>
            <address>
              6751 1st Ave S
              <br />
              St. Petersburg, FL 33707
            </address>
            <a href={PHONE_TEL} data-google-call-tracking="true">727-377-3339</a>
          </div>
          <div className="lp-footer-hours">
            <h2>Office Hours</h2>
            <div className="lp-footer-hours-divider" aria-hidden="true" />
            <ul className="lp-footer-hours-list">
              {officeHours.map((entry) => (
                <li key={entry.day}>
                  <span>{entry.day}</span>
                  <span>{entry.hours}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>

      <a className="mobile-call-bar" href={PHONE_TEL} data-google-call-tracking="true">Call now</a>
    </main>
  );
}
