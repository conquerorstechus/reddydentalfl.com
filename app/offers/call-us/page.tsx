"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import BrandValuesSection from "./brand-values-section";
import GoogleTrustSection from "./google-trust-section";
import LanguageToggle from "./language-toggle";
import { useLanguage } from "./language-provider";
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

type CallButtonProps = {
  dark?: boolean;
  label: string;
  ariaLabel: string;
};

function CallButton({ dark = false, label, ariaLabel }: CallButtonProps) {
  return (
    <a
      href={PHONE_TEL}
      data-google-call-tracking="true"
      className={`call-button ${dark ? "call-button-dark" : ""}`}
      aria-label={ariaLabel}
    >
      <span aria-hidden="true">☎</span>
      {label}
    </a>
  );
}

export default function CallUsOfferPage() {
  const router = useRouter();
  const { toggleLanguage, t } = useLanguage();
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
        <a className="brand" href="/" aria-label={t.brandHomeAriaLabel}>
          <img
            src="/assets/images/reddy-dental-logo-light-bg.svg"
            alt={t.brandLogoAlt}
            className="brand-logo"
            width={250}
            height={50}
          />
        </a>
        <div className="header-actions">
          <LanguageToggle label={t.languageToggleLabel} onToggle={toggleLanguage} />
          <a
            className="header-phone"
            href={PHONE_TEL}
            data-google-call-tracking="true"
            aria-label={t.callAriaLabel}
          >
            <span className="header-phone-icon" aria-hidden="true">☎</span>
            <strong>{t.callNow}</strong>
          </a>
        </div>
      </header>

      <section className="hero-banner" aria-labelledby="hero-heading">
        <div className="hero-banner-inner">
          <div className="hero-banner-copy">
            <h1 id="hero-heading">{t.heroHeading}</h1>
            <p className="hero-subtitle">{t.heroSubtitle}</p>
            <p className="hero-description">{t.heroDescription}</p>
            <CallButton label={t.callNow} ariaLabel={t.callAriaLabel} />
            <p className="hero-note">{t.heroNote}</p>
          </div>
          <div className="hero-banner-image-wrap">
            <img
              src="/assets/images/img_8775.webp"
              alt={t.heroImageAlt}
              className="hero-banner-image"
            />
          </div>
        </div>
        <div className="hero-banner-curve" aria-hidden="true" />
      </section>

      <GoogleTrustSection />

      <section className="form-section" id="request-callback" aria-label={t.formSectionAriaLabel}>
        <form className="lead-form" onSubmit={handleSubmit}>
          <div className="lead-form-row">
            <label>
              {t.formNameLabel}
              <input required value={name} onChange={(event) => setName(event.target.value)} name="name" type="text" autoComplete="name" />
            </label>
            <label>
              {t.formPhoneLabel}
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
                title={t.formPhoneTitle}
              />
            </label>
            <label className="lead-form-summary">
              {t.formSummaryLabel} <span>{t.formSummaryOptional}</span>
              <textarea
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
                name="summary"
                rows={1}
                placeholder={t.formSummaryPlaceholder}
              />
            </label>
            <button className="lead-form-submit" type="submit" disabled={formStatus === "loading"}>
              {formStatus === "loading" ? t.formSubmitLoading : t.formSubmitIdle}
            </button>
          </div>
          <small className="privacy-note">{t.formPrivacyNote}</small>
          {formStatus === "error" && (
            <p role="alert" className="form-error">{t.formError}</p>
          )}
        </form>
      </section>

      <section className="reviews-section" aria-labelledby="reviews-heading">
        <div className="reviews-header">
          <div>
            <p className="eyebrow">{t.reviewsEyebrow}</p>
            <h2 id="reviews-heading">{t.reviewsHeading}</h2>
          </div>
          <a className="reviews-google-link" href={GOOGLE_REVIEWS_URL} target="_blank" rel="noreferrer">
            <img src="/assets/google_stars.svg" alt="" width={130} height={24} />
            <span>{t.reviewsGoogleLink}</span>
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
                <span className="review-stars" aria-label={t.reviewStarsAriaLabel}>★★★★★</span>
                <span className="review-date">{review.date}</span>
              </div>
              <p className="review-text">{review.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="offer-services-section" aria-labelledby="offer-services-heading">
        <p className="eyebrow">{t.servicesEyebrow}</p>
        <h2 id="offer-services-heading">{t.servicesHeading}</h2>
        <div className="offer-services-panel">
          <div className="offer-services-grid">
            {t.services.map((service, index) => (
              <div className="offer-service-box" key={service}>
                <span className="offer-service-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="offer-service-title">{service}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="section-cta">
          <a className="book-button" href="#request-callback">{t.bookAppointment}</a>
        </div>
      </section>

      <BrandValuesSection />

      <section className="trust-section" aria-labelledby="trust-heading">
        <div className="trust-section-header">
          <h2 id="trust-heading">{t.aboutHeading}</h2>
          <p className="eyebrow">{t.aboutEyebrow}</p>
        </div>
        <div className="doctor-card">
          <img src="/assets/images/img_8777.webp" alt="Dr. Sajan Anish Reddy" />
          <div>
            <strong>Dr. Sajan “Anish” Reddy, DMD</strong>
            <span>{t.doctorCredential}</span>
          </div>
        </div>
        <div className="trust-copy">
          <p className="trust-bio">{t.doctorBio}</p>
        </div>
      </section>

      <section className="insurance-section" aria-labelledby="insurance-heading">
        <div className="insurance-section-inner">
          <div className="insurance-image-wrap">
            <img
              src="/assets/images/reddy-dental-exterior.jpg"
              alt={t.insuranceImageAlt}
              className="insurance-image"
              loading="lazy"
            />
          </div>
          <div className="insurance-copy">
            <p className="eyebrow">{t.insuranceEyebrow}</p>
            <h2 id="insurance-heading">{t.insuranceHeading}</h2>
            <p className="insurance-intro">{t.insuranceIntro}</p>
            <div className="offer-notes insurance-offers">
              <div><strong>$99</strong><span>{t.offer99Description}</span></div>
              <div><strong>$59</strong><span>{t.offer59Description}</span></div>
            </div>
            <div className="section-cta">
              <a className="book-button" href="#request-callback">{t.bookAppointment}</a>
            </div>
          </div>
        </div>
      </section>

      <section className="final-cta" aria-labelledby="final-heading">
        <p className="eyebrow">{t.finalEyebrow}</p>
        <h2 id="final-heading">{t.finalHeading}</h2>
        <p>{t.finalDescription}</p>
        <div className="final-actions">
          <CallButton dark label={t.callNow} ariaLabel={t.callAriaLabel} />
          <a className="text-link" href="#request-callback">{t.requestCallbackInstead}</a>
        </div>
      </section>

      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-location">
            <p className="lp-footer-label">{t.footerLocationLabel}</p>
            <strong>Reddy Dental</strong>
            <address>
              6751 1st Ave S
              <br />
              St. Petersburg, FL 33707
            </address>
            <a href={PHONE_TEL} data-google-call-tracking="true">{PHONE_NUMBER}</a>
          </div>
          <div className="lp-footer-hours">
            <h2>{t.footerOfficeHours}</h2>
            <div className="lp-footer-hours-divider" aria-hidden="true" />
            <ul className="lp-footer-hours-list">
              {t.officeHours.map((entry) => (
                <li key={entry.day}>
                  <span>{entry.day}</span>
                  <span>{entry.hours}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>

      <a className="mobile-call-bar" href={PHONE_TEL} data-google-call-tracking="true">{t.callNow}</a>
    </main>
  );
}
