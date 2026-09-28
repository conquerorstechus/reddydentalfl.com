import enMessages from "@/messages/en.json";
import esMessages from "@/messages/es.json";
import type { AppLocale } from "@/i18n/routing";

const DESKTOP_MENU_OPEN =
  '<div class="gap-x-md hidden flex-row items-center justify-self-end lg:flex">';
const MOBILE_MENU_OPEN = '<div class="flex items-center lg:hidden">';
const FOOTER_OPEN = '<div class="flex justify-center py-md px-sm text-primary bg-primary">';

const PAGE_KEYS: Record<string, string[]> = {
  "": ["home"],
  about: ["about"],
  contact: ["contact"],
  reviews: ["reviews"],
  "patient-resources": ["patientResources", "index"],
  "patient-resources/office-tour": ["patientResources", "officeTour"],
  "patient-resources/smile-savings-plan": ["patientResources", "smileSavingsPlan"],
  services: ["services", "index"],
  "services/bridges": ["services", "bridges"],
  "services/cosmetic": ["services", "cosmetic"],
  "services/crowns": ["services", "crowns"],
  "services/dental-cleanings": ["services", "dentalCleanings"],
  "services/dental-implants": ["services", "dentalImplants"],
  "services/dentures": ["services", "dentures"],
  "services/dermal-fillers": ["services", "dermalFillers"],
  "services/emergency": ["services", "emergency"],
  "services/emergency-exams": ["services", "emergencyExams"],
  "services/endodontics": ["services", "endodontics"],
  "services/extractions": ["services", "extractions"],
  "services/fillings": ["services", "fillings"],
  "services/fluoride-treatment": ["services", "fluorideTreatment"],
  "services/invisalign": ["services", "invisalign"],
  "services/mouth-guards": ["services", "mouthGuards"],
  "services/night-guards": ["services", "nightGuards"],
  "services/oral-cancer-screenings": ["services", "oralCancerScreenings"],
  "services/partial-dentures": ["services", "partialDentures"],
  "services/preventative": ["services", "preventative"],
  "services/reconstruction": ["services", "reconstruction"],
  "services/restorative": ["services", "restorative"],
  "services/root-canals": ["services", "rootCanals"],
  "services/sealants": ["services", "sealants"],
  "services/sleep-apnea": ["services", "sleepApnea"],
  "services/tmj-treatment": ["services", "tmjTreatment"],
  "services/veneers": ["services", "veneers"],
  "services/whitening": ["services", "whitening"],
  "services/wisdom-teeth": ["services", "wisdomTeeth"],
  technologies: ["technologies", "index"],
  "technologies/3d-imaging": ["technologies", "imaging3d"],
  "technologies/cone-beam": ["technologies", "coneBeam"],
  "technologies/digital-x-rays": ["technologies", "digitalXRays"],
  "technologies/impressions": ["technologies", "impressions"],
  "technologies/intraoral-cameras": ["technologies", "intraoralCameras"],
  "technologies/panoramic-x-rays": ["technologies", "panoramicXRays"],
  "technologies/ultrasonic-scaler": ["technologies", "ultrasonicScaler"],
  blog: ["blog", "index"],
  "blog/cosmetic-dentistry-options-for-a-confident-smile": ["blog", "cosmeticDentistryOptions"],
  "blog/how-to-choose-a-family-dentist-in-st-petersburg": ["blog", "howToChooseAFamilyDentist"],
  "blog/what-to-do-in-a-dental-emergency": ["blog", "dentalEmergency"],
};

function unescapeIcu(value: string): string {
  return value.replaceAll("''", "'");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeHtmlAttr(value: string): string {
  return escapeHtml(value).replace(/"/g, "&quot;");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function readPage(
  messages: typeof enMessages,
  slug: string[],
): { title: string; description: string } | null {
  const key = PAGE_KEYS[slug.join("/")];
  if (!key) return null;

  let node: unknown = messages.pages;
  for (const part of key) {
    if (!node || typeof node !== "object" || !(part in node)) return null;
    node = (node as Record<string, unknown>)[part];
  }

  if (!node || typeof node !== "object") return null;
  const page = node as { title?: string; description?: string };
  if (!page.title || !page.description) return null;
  return {
    title: unescapeIcu(page.title),
    description: unescapeIcu(page.description),
  };
}

function textPairs(
  english: Record<string, string>,
  spanish: Record<string, string>,
): Array<[string, string]> {
  return Object.keys(english)
    .filter((key) => typeof english[key] === "string" && english[key] !== spanish[key])
    .map((key) => [unescapeIcu(english[key]), unescapeIcu(spanish[key])] as [string, string])
    .sort((a, b) => b[0].length - a[0].length);
}

function flexibleWhitespace(value: string): string {
  return escapeRegExp(value).replace(/ +/g, "\\s+");
}

function translateTextNodes(region: string, pairs: Array<[string, string]>): string {
  let next = region;
  for (const [english, spanish] of pairs) {
    const pattern = flexibleWhitespace(english);
    next = next.replaceAll(`aria-label="${english}"`, `aria-label="${escapeHtmlAttr(spanish)}"`);
    next = next.replaceAll(`alt="${english}"`, `alt="${escapeHtmlAttr(spanish)}"`);
    next = next.replaceAll(
      `type="submit" value="${english}"`,
      `type="submit" value="${escapeHtmlAttr(spanish)}"`,
    );
    if (english.includes(" ")) {
      next = next.replaceAll(`value="${english}"`, `value="${escapeHtmlAttr(spanish)}"`);
    }
    next = next.replace(
      new RegExp(`(>\\s*)${pattern}(\\s*<)`, "g"),
      `$1${escapeHtml(spanish)}$2`,
    );
    if (english.length >= 24) {
      next = next.replaceAll(`"${english}"`, `"${spanish.replaceAll('"', '\\"')}"`);
    }
  }
  return next;
}

function copyPairs(): Array<[string, string]> {
  const english = (enMessages as { copy?: Record<string, string> }).copy;
  const spanish = (esMessages as { copy?: Record<string, string> }).copy;
  if (!english || !spanish) return [];
  return textPairs(english, spanish);
}

function sliceByElement(html: string, openTag: string, closeTag: string): [number, number] | null {
  const start = html.indexOf(openTag);
  if (start < 0) return null;
  const end = html.indexOf(closeTag, start);
  if (end < 0) return null;
  return [start, end + closeTag.length];
}

function sliceDiv(html: string, openTag: string): [number, number] | null {
  const start = html.indexOf(openTag);
  if (start < 0) return null;
  const openEnd = html.indexOf(">", start);
  if (openEnd < 0) return null;

  let depth = 1;
  let index = openEnd + 1;
  while (index < html.length && depth > 0) {
    const nextOpen = html.indexOf("<div", index);
    const nextClose = html.indexOf("</div>", index);
    if (nextClose < 0) return null;
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth += 1;
      index = nextOpen + 4;
    } else {
      depth -= 1;
      if (depth === 0) return [start, nextClose + "</div>".length];
      index = nextClose + "</div>".length;
    }
  }
  return null;
}

function replaceSlice(
  html: string,
  range: [number, number] | null,
  transform: (region: string) => string,
): string {
  if (!range) return html;
  const [start, end] = range;
  return `${html.slice(0, start)}${transform(html.slice(start, end))}${html.slice(end)}`;
}

function languageToggleMarkup(locale: AppLocale): string {
  const englishPressed = locale === "en" ? "true" : "false";
  const spanishPressed = locale === "es" ? "true" : "false";
  const label = locale === "es" ? "Idioma" : "Language";
  return `<div class="lang-toggle" data-lang-toggle role="group" aria-label="${label}"><button type="button" data-locale="en" aria-pressed="${englishPressed}">EN</button><span aria-hidden="true">|</span><button type="button" data-locale="es" aria-pressed="${spanishPressed}">ES</button></div>`;
}

function insertInside(html: string, openTag: string, insertion: string, position: "start" | "end"): string {
  const range = sliceDiv(html, openTag);
  if (!range) return html;
  const [start, end] = range;
  const region = html.slice(start, end);
  const openEnd = region.indexOf(">");
  const closeAt = region.lastIndexOf("</div>");
  if (openEnd < 0 || closeAt < 0) return html;
  const next =
    position === "start"
      ? `${region.slice(0, openEnd + 1)}${insertion}${region.slice(openEnd + 1)}`
      : `${region.slice(0, closeAt)}${insertion}${region.slice(closeAt)}`;
  return `${html.slice(0, start)}${next}${html.slice(end)}`;
}

const TOGGLE_STYLE = `
    <style data-lang-toggle-style>
      .lang-toggle {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        flex-shrink: 0;
        margin-left: 10px;
        padding: 5px 10px;
        border: 1px solid #d9b748;
        border-radius: 999px;
        background: #fff;
        color: #1c1c1c;
        font-family: Roboto, sans-serif;
        font-size: 14px;
        font-weight: 600;
        line-height: 1;
        letter-spacing: 0.04em;
        position: relative;
        z-index: 30;
      }
      .lang-toggle button {
        appearance: none;
        margin: 0;
        padding: 4px 0;
        border: 0;
        background: transparent;
        color: inherit;
        font: inherit;
        letter-spacing: inherit;
        cursor: pointer;
      }
      .lang-toggle button[aria-pressed="true"] {
        color: #9a7b12;
        font-weight: 700;
      }
      .lang-toggle button:focus-visible {
        outline: 1px solid #d9b748;
        outline-offset: 3px;
      }
      @media (max-width: 1023px) {
        .lang-toggle {
          font-size: 13px;
          gap: 0.2rem;
        }
      }
    </style>`;

const TOGGLE_SCRIPT = `
    <script data-lang-toggle-script>
      document.querySelectorAll("[data-lang-toggle]").forEach((group) => {
        group.addEventListener("click", (event) => {
          const button = event.target.closest("[data-locale]");
          if (!button || button.getAttribute("aria-pressed") === "true") return;
          const locale = button.getAttribute("data-locale");
          if (locale !== "en" && locale !== "es") return;
          document.cookie = "NEXT_LOCALE=" + locale + "; Path=/; Max-Age=31536000; SameSite=Lax";
          window.location.reload();
        });
      });
    </script>`;

function injectLanguageToggle(html: string, locale: AppLocale): string {
  if (html.includes("data-lang-toggle")) return html;

  const toggle = languageToggleMarkup(locale);
  let next = insertInside(html, MOBILE_MENU_OPEN, toggle, "end");
  next = insertInside(next, DESKTOP_MENU_OPEN, toggle, "end");

  if (/<\/head>/i.test(next)) {
    next = next.replace(/<\/head>/i, `${TOGGLE_STYLE}</head>`);
  }
  if (/<\/body>/i.test(next)) {
    next = next.replace(/<\/body>/i, `${TOGGLE_SCRIPT}</body>`);
  }
  return next;
}

function localizeSpanish(html: string, slug: string[]): string {
  const page = readPage(esMessages, slug);
  let next = html.replace(/<html\b([^>]*)\blang=["']en["']/i, "<html$1lang=\"es\"");

  if (page) {
    next = next.replace(/<title[^>]*>[\s\S]*?<\/title>/i, `<title>${escapeHtml(page.title)}</title>`);
    next = next.replace(
      /(<meta\s+name=["']description["']\s+content=["'])[^"']*(["'])/i,
      `$1${escapeHtmlAttr(page.description)}$2`,
    );
  }

  const navPairs = textPairs(enMessages.nav, esMessages.nav);
  next = replaceSlice(next, sliceByElement(next, '<nav id="topNav"', "</nav>"), (region) =>
    translateTextNodes(region, navPairs),
  );
  next = replaceSlice(next, sliceDiv(next, '<div id="menuBar"'), (region) =>
    translateTextNodes(region, navPairs),
  );

  const footerPairs = [
    ...textPairs(
      {
        contactInfo: enMessages.footer.contactInfo,
        officeHours: enMessages.footer.officeHours,
        quickLinks: enMessages.footer.quickLinks,
        requestAppointment: enMessages.footer.requestAppointment,
        dentalBlog: enMessages.footer.dentalBlog,
        newPatientForms: enMessages.footer.newPatientForms,
        onlinePayment: enMessages.footer.onlinePayment,
        mapAlt: enMessages.footer.mapAlt,
      },
      {
        contactInfo: esMessages.footer.contactInfo,
        officeHours: esMessages.footer.officeHours,
        quickLinks: esMessages.footer.quickLinks,
        requestAppointment: esMessages.footer.requestAppointment,
        dentalBlog: esMessages.footer.dentalBlog,
        newPatientForms: esMessages.footer.newPatientForms,
        onlinePayment: esMessages.footer.onlinePayment,
        mapAlt: esMessages.footer.mapAlt,
      },
    ),
    ...enMessages.footer.hours.map(
      (entry, index) =>
        [entry.day, esMessages.footer.hours[index]?.day ?? entry.day] as [string, string],
    ),
    ["All Rights Reserved.", "Todos los derechos reservados."] as [string, string],
  ].sort((a, b) => b[0].length - a[0].length);

  next = replaceSlice(next, sliceDiv(next, FOOTER_OPEN), (region) =>
    translateTextNodes(region, footerPairs).replaceAll(
      "All Rights Reserved.",
      "Todos los derechos reservados.",
    ),
  );

  const bodyPairs = copyPairs();
  if (bodyPairs.length > 0) {
    next = translateTextNodes(next, bodyPairs);
  }

  return next;
}

export function applySiteLocale(html: string, slug: string[], locale: AppLocale): string {
  const translated = locale === "es" ? localizeSpanish(html, slug) : html;
  return injectLanguageToggle(translated, locale);
}

export function translateBackLabel(label: string, locale: AppLocale): string {
  if (locale !== "es") return label;
  const labels: Record<string, string> = {
    "Cosmetic Dentistry": "Odontología cosmética",
    "Restorative Dentistry": "Odontología restauradora",
    "Preventative Dentistry": "Odontología preventiva",
    "Emergency Dentistry": "Odontología de emergencia",
    Technologies: "Tecnologías",
    "All Services": "Todos los servicios",
  };
  return labels[label] ?? label;
}

export function backLinkPrefix(locale: AppLocale): string {
  return locale === "es" ? "← Volver a" : "← Back to";
}
