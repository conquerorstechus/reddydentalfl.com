"use client";

import { useLanguage } from "./language-provider";

const VALUE_ICONS = [
  {
    src: "/assets/images/581fb3c4-6004-4d51-ab2a-dbdafd9e4d7c.svg",
    alt: "Integrity icon",
  },
  {
    src: "/assets/images/551dc171-133b-4312-9fbe-f41a415b173b.svg",
    alt: "Calm experience icon",
  },
  {
    src: "/assets/images/fb8a33f7-c201-4b95-ac6c-fafcdb60db98.svg",
    alt: "Clarity icon",
  },
  {
    src: "/assets/images/4ec56138-bd6d-4ec6-929a-cca3973af749.svg",
    alt: "Precision icon",
  },
  {
    src: "/assets/images/358852cf-d050-49f1-aea0-3da69fe5fae7.svg",
    alt: "Home icon",
  },
] as const;

export default function BrandValuesSection() {
  const { t } = useLanguage();

  return (
    <section className="brand-values-section" aria-labelledby="brand-values-heading">
      <h2 id="brand-values-heading" className="brand-values-heading">
        <strong>{t.valuesHeadingLead}</strong> {t.valuesHeadingLocation}
        <br />
        {t.valuesHeadingTagline}
      </h2>

      <div className="brand-values-inner">
        <div className="brand-values-image-wrap">
          <img
            src="/assets/images/reddy-dental-consultation.jpg"
            alt={t.valuesImageAlt}
            className="brand-values-image"
            loading="lazy"
          />
        </div>

        <div className="brand-values-grid">
          {t.valuesItems.map((item, index) => (
            <article className="brand-values-item" key={item.title}>
              <img
                src={VALUE_ICONS[index].src}
                alt=""
                width={70}
                height={70}
                className="brand-values-icon"
                aria-hidden="true"
              />
              <div className="brand-values-copy">
                <h3 className="brand-values-title">{item.title}</h3>
                <p className="brand-values-text">{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
