import { contactWebhookUrl } from "@/lib/offer-webhooks";
import { escapeHtml, postFormWebhook, readText } from "@/lib/form-webhook";

const PATIENT_TYPES: Record<string, string> = {
  newPatient: "New Patient",
  existingPatient: "Existing Patient",
};

const HEAR_ABOUT: Record<string, string> = {
  onlineSearch: "Online Search",
  maps: "Maps Listing",
  friendOrFamily: "Friend or Family",
  healthcareProvider: "Healthcare Provider",
  insurance: "Insurance",
  other: "Other",
};

const LAST_VISIT: Record<string, string> = {
  withinSixMonths: "Within 6 months",
  sixToTwelveMonths: "6–12 months",
  oneToTwoYears: "1–2 years",
  moreThanTwoYears: "More than 2 years",
  neverOrUnsure: "Never / Not sure",
};

type AvailabilitySlot = { dayOfWeek: string; timeOfDay: string };

function readAvailability(value: unknown): AvailabilitySlot[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as Record<string, unknown>;
    const dayOfWeek = readText(record.dayOfWeek);
    const timeOfDay = readText(record.timeOfDay);
    if (!dayOfWeek || !timeOfDay) return [];
    return [{ dayOfWeek, timeOfDay }];
  });
}

function labeled(map: Record<string, string>, value: string) {
  return map[value] ?? value;
}

function buildEmailHtml(payload: {
  locale: string;
  source: string;
  name: string;
  phoneNumber: string;
  patientType: string;
  availability: AvailabilitySlot[];
  howDidYouHearAboutUs: string;
  preferredContactMethod: string;
  notes: string;
  email: string;
  lastDentalVisit: string;
}) {
  const language = payload.locale === "es" ? "Spanish" : "English";
  const slots = payload.availability
    .map((slot) => `${slot.dayOfWeek} ${slot.timeOfDay}`)
    .join(", ");
  const lastVisit = payload.lastDentalVisit
    ? `<p><strong>Last dental visit:</strong> ${escapeHtml(labeled(LAST_VISIT, payload.lastDentalVisit))}</p>`
    : "";

  return `<h2>Contact / appointment request</h2>
<p><strong>Form:</strong> Contact page</p>
<p><strong>Language:</strong> ${escapeHtml(language)}</p>
<p><strong>Patient name:</strong> ${escapeHtml(payload.name)}</p>
<p><strong>Patient type:</strong> ${escapeHtml(labeled(PATIENT_TYPES, payload.patientType))}</p>
<p><strong>Phone:</strong> ${escapeHtml(payload.phoneNumber)}</p>
<p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
<p><strong>Preferred contact:</strong> ${escapeHtml(payload.preferredContactMethod || "(none)")}</p>
<p><strong>Availability:</strong> ${escapeHtml(slots || "(none)")}</p>
<p><strong>How they heard about us:</strong> ${escapeHtml(labeled(HEAR_ABOUT, payload.howDidYouHearAboutUs) || "(none)")}</p>
${lastVisit}<p><strong>Notes:</strong> ${escapeHtml(payload.notes || "(none)")}</p>
<p><strong>Source:</strong> ${escapeHtml(payload.source)}</p>`;
}

export async function POST(request: Request) {
  let incoming: unknown;
  try {
    incoming = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const record = incoming && typeof incoming === "object" ? (incoming as Record<string, unknown>) : {};
  const locale = readText(record.locale) === "es" ? "es" : "en";
  const payload = {
    formType: "contact" as const,
    locale,
    language: (locale === "es" ? "Spanish" : "English") as "Spanish" | "English",
    source: readText(record.source) || "https://www.reddydentalfl.com/contact/",
    name: readText(record.name),
    phoneNumber: readText(record.phoneNumber),
    patientType: readText(record.patientType),
    availability: readAvailability(record.availability),
    howDidYouHearAboutUs: readText(record.howDidYouHearAboutUs),
    preferredContactMethod: readText(record.preferredContactMethod),
    notes: readText(record.notes),
    email: readText(record.email),
    lastDentalVisit: readText(record.lastDentalVisit),
  };

  if (!payload.name || !payload.phoneNumber || !payload.email || !payload.patientType) {
    return Response.json({ error: "Required contact fields are missing." }, { status: 400 });
  }

  const webhookUrl = contactWebhookUrl();
  if (!webhookUrl) {
    return Response.json({ error: "Contact webhook is not configured." }, { status: 500 });
  }

  const html = buildEmailHtml(payload);
  const body = { ...payload, html, htmlBody: html };

  try {
    await postFormWebhook(webhookUrl, body, {
      formType: payload.formType,
      locale: payload.locale,
      language: payload.language,
      source: payload.source,
      name: payload.name,
      phoneNumber: payload.phoneNumber,
      email: payload.email,
    });
  } catch {
    return Response.json({ error: "Webhook request failed." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
