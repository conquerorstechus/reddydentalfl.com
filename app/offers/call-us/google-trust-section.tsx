"use client";

import { useLanguage } from "./language-provider";

const GOOGLE_REVIEWS_URL = "https://maps.app.goo.gl/MmTH3GryrAqJzzqt9";
const GOOGLE_RATING = "5.0";
const GOOGLE_REVIEW_COUNT = "61";

export default function GoogleTrustSection() {
  const { t } = useLanguage();

  return (
    <section className="google-trust-section" aria-label={t.googleTrustAriaLabel}>
      <a
        className="google-trust-badge"
        href={GOOGLE_REVIEWS_URL}
        target="_blank"
        rel="noreferrer"
      >
        <img
          src="/assets/google_stars.svg"
          alt=""
          width={130}
          height={24}
          className="google-trust-badge-stars"
        />
        <span className="google-trust-badge-label">{t.googleTrustBadgeLabel}</span>
      </a>

      <a
        className="google-trust-rating"
        href={GOOGLE_REVIEWS_URL}
        target="_blank"
        rel="noreferrer"
        aria-label={t.googleTrustRatingAriaLabel}
      >
        <span className="google-trust-score">{GOOGLE_RATING}</span>
        <span className="google-trust-stars" aria-hidden="true">★★★★★</span>
        <span className="google-trust-count">{t.googleTrustReviewCount}</span>
      </a>
    </section>
  );
}
