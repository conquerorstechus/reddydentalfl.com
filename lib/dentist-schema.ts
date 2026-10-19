import { CANONICAL_SITE_ORIGIN, DEFAULT_SOCIAL_IMAGE } from "@/lib/site-origin";

const WEEKDAYS = [
  "https://schema.org/Monday",
  "https://schema.org/Tuesday",
  "https://schema.org/Wednesday",
  "https://schema.org/Thursday",
  "https://schema.org/Friday",
] as const;

const WEEKEND = [
  "https://schema.org/Saturday",
  "https://schema.org/Sunday",
] as const;

export function dentistSchemaId(origin = CANONICAL_SITE_ORIGIN): string {
  return `${origin.replace(/\/$/, "")}/#dentist`;
}

export function buildDentistSchema(origin = CANONICAL_SITE_ORIGIN) {
  const site = origin.replace(/\/$/, "");

  return {
    "@context": "https://schema.org",
    "@type": ["Dentist", "MedicalBusiness"],
    "@id": dentistSchemaId(site),
    name: "Reddy Dental",
    url: `${site}/`,
    telephone: "+1-727-377-3339",
    image: `${site}${DEFAULT_SOCIAL_IMAGE.path}`,
    logo: `${site}/assets/images/reddy-dental-logo-light-bg.svg`,
    hasMap: "https://maps.app.goo.gl/MmTH3GryrAqJzzqt9",
    address: {
      "@type": "PostalAddress",
      streetAddress: "6751 1st Ave S",
      addressLocality: "St. Petersburg",
      addressRegion: "FL",
      postalCode: "33707",
      addressCountry: "US",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: WEEKDAYS,
        opens: "09:00",
        closes: "17:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: WEEKEND,
        opens: "09:00",
        closes: "17:00",
        description: "Emergency dental calls only",
      },
    ],
    areaServed: {
      "@type": "City",
      name: "St. Petersburg",
      containedInPlace: {
        "@type": "State",
        name: "Florida",
      },
    },
    medicalSpecialty: "https://schema.org/Dentistry",
  };
}

export function buildDentistSchemaJson(origin = CANONICAL_SITE_ORIGIN): string {
  return JSON.stringify(buildDentistSchema(origin)).replace(/</g, "\\u003c");
}

/** Homepage, contact, and the services index — the pages Google should associate with the practice. */
export function shouldInjectDentistSchema(slug: string[]): boolean {
  if (slug.length === 0) return true;
  return slug.length === 1 && (slug[0] === "contact" || slug[0] === "services");
}
