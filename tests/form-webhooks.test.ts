/**
 * Form → webhook end-to-end check.
 *
 * Runs automatically before `npm run build` (see "prebuild" in package.json),
 * or on its own with `npm run test:forms`.
 *
 * For each of the 6 site forms (3 forms × EN/ES) it fills in test data, sends it
 * through the real Next.js API route handler, and checks that:
 *   - the route accepts it (HTTP 200),
 *   - exactly one request went to the correct n8n webhook for that form,
 *   - the webhook payload / query string carry the expected fields,
 *   - the n8n webhook itself answered with a 2xx.
 *
 * Env switches:
 *   FORM_TEST_DRY_RUN=1   (or `npm run test:forms:dry`) don't contact n8n; fake a 200 from the webhook (checks routing only)
 *   SKIP_FORM_TESTS=1     skip the whole suite
 *   CI / VERCEL set       suite is skipped automatically, so deploy builds never send test leads
 */
import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
for (const file of [".env.local", ".env"]) {
  const full = path.join(ROOT, file);
  if (existsSync(full)) process.loadEnvFile(full);
}

const SKIP_REASON = process.env.SKIP_FORM_TESTS
  ? "SKIP_FORM_TESTS is set"
  : process.env.VERCEL || process.env.CI
    ? "running in CI/Vercel – test leads are only sent from local builds"
    : false;
const DRY_RUN =
  process.env.FORM_TEST_DRY_RUN === "1" || process.env.npm_lifecycle_event === "test:forms:dry";
const SITE = "https://www.reddydentalfl.com";
const TEST_TAG = "TEST BUILD CHECK";
const WEBHOOK_TIMEOUT_MS = 20_000;

// ---------------------------------------------------------------------------
// fetch spy: records every outgoing webhook call, then forwards it (or fakes it in dry-run)
// ---------------------------------------------------------------------------
type WebhookCall = {
  url: URL;
  body: Record<string, unknown>;
  status: number;
  responseText: string;
};

const realFetch = globalThis.fetch;
let calls: WebhookCall[] = [];

function installFetchSpy() {
  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(input instanceof Request ? input.url : input.toString());
    const body = JSON.parse(String(init?.body ?? "{}")) as Record<string, unknown>;

    if (DRY_RUN) {
      calls.push({ url, body, status: 200, responseText: "(dry run)" });
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    const response = await realFetch(input, {
      ...init,
      signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
    });
    const responseText = await response.clone().text();
    calls.push({ url, body, status: response.status, responseText: responseText.slice(0, 200) });
    return response;
  };
}

function jsonRequest(url: string, body: unknown) {
  return new Request(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

function stripQuery(url: URL) {
  return `${url.origin}${url.pathname}`;
}

// ---------------------------------------------------------------------------
// Test data for the 6 forms
// ---------------------------------------------------------------------------
type Locale = "en" | "es";

function callbackForm(page: "call-us" | "discount", locale: Locale) {
  return {
    formType: "callback",
    locale,
    source: `${SITE}/offers/${page}/?utm_source=${encodeURIComponent(TEST_TAG)}`,
    name: `${TEST_TAG} ${page} ${locale.toUpperCase()}`,
    phoneNumber: "7275550100",
    summary:
      locale === "es"
        ? "Prueba automática antes del build – ignorar"
        : "Automated pre-build test – please ignore",
  };
}

function contactForm(locale: Locale) {
  return {
    formType: "contact",
    locale,
    source: `${SITE}/contact/?utm_source=${encodeURIComponent(TEST_TAG)}`,
    name: `${TEST_TAG} contact ${locale.toUpperCase()}`,
    phoneNumber: "(727) 555-0100",
    patientType: "newPatient",
    availability: [
      { dayOfWeek: "Monday", timeOfDay: "Morning" },
      { dayOfWeek: "Thursday", timeOfDay: "Afternoon" },
    ],
    howDidYouHearAboutUs: "onlineSearch",
    preferredContactMethod: "Phone",
    notes:
      locale === "es"
        ? "Prueba automática antes del build – ignorar"
        : "Automated pre-build test – please ignore",
    email: "build-check@example.com",
    lastDentalVisit: "oneToTwoYears",
  };
}

type FormCase = {
  label: string;
  route: "contact" | "call-us";
  apiPath: string;
  data: Record<string, unknown>;
  expectedFormType: "contact" | "callback" | "discount";
  webhookEnv: string;
};

const FORMS: FormCase[] = (["en", "es"] as const).flatMap((locale): FormCase[] => [
  {
    label: `Call-us offer (${locale.toUpperCase()})`,
    route: "call-us",
    apiPath: "/api/offers/call-us/",
    data: callbackForm("call-us", locale),
    expectedFormType: "callback",
    webhookEnv: "CALL_US_WEBHOOK_URL",
  },
  {
    label: `Discount offer (${locale.toUpperCase()})`,
    route: "call-us",
    apiPath: "/api/offers/call-us/",
    data: callbackForm("discount", locale),
    expectedFormType: "discount",
    webhookEnv: "DISCOUNT_OFFER_WEBHOOK_URL",
  },
  {
    label: `Contact / appointment (${locale.toUpperCase()})`,
    route: "contact",
    apiPath: "/api/contact/",
    data: contactForm(locale),
    expectedFormType: "contact",
    webhookEnv: "CONTACT_FORM_WEBHOOK_URL",
  },
]);

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------
describe("Form webhooks", { skip: SKIP_REASON }, () => {
  let routes: Record<FormCase["route"], { POST: (req: Request) => Promise<Response> }>;
  let webhooks: typeof import("../lib/offer-webhooks");
  const summary: string[] = [];

  before(async () => {
    installFetchSpy();
    webhooks = await import("../lib/offer-webhooks");
    routes = {
      contact: await import("../app/api/contact/route"),
      "call-us": await import("../app/api/offers/call-us/route"),
    };
    console.log(
      DRY_RUN
        ? "\n[form-tests] DRY RUN – webhooks are faked, nothing is sent to n8n\n"
        : "\n[form-tests] LIVE – sending 6 test submissions to the n8n webhooks\n",
    );
  });

  after(() => {
    globalThis.fetch = realFetch;
    if (summary.length) console.log(`\n[form-tests] results\n${summary.join("\n")}\n`);
  });

  test("the 3 webhooks are configured and distinct", () => {
    const urls = [
      webhooks.callbackWebhookUrl(`${SITE}/offers/call-us/`),
      webhooks.callbackWebhookUrl(`${SITE}/offers/discount/`),
      webhooks.contactWebhookUrl(),
    ];
    for (const url of urls) {
      assert.ok(url, "webhook URL is empty");
      assert.doesNotThrow(() => new URL(url), `invalid webhook URL: ${url}`);
    }
    assert.equal(new Set(urls).size, 3, "two forms share the same webhook URL");
  });

  for (const form of FORMS) {
    test(`${form.label} → ${form.webhookEnv}`, { timeout: WEBHOOK_TIMEOUT_MS + 5_000 }, async () => {
      calls = [];
      const response = await routes[form.route].POST(jsonRequest(`${SITE}${form.apiPath}`, form.data));
      const responseBody = await response.json().catch(() => ({}));
      const call = calls[0];

      summary.push(
        `  ${response.ok ? "✔" : "✖"} ${form.label.padEnd(30)} route ${response.status}` +
          (call ? `  webhook ${call.status}  ${stripQuery(call.url)}` : "  (no webhook call)"),
      );

      assert.equal(calls.length, 1, `expected 1 webhook call, got ${calls.length}`);
      assert.ok(
        call.status >= 200 && call.status < 300,
        `n8n webhook answered ${call.status}: ${call.responseText}`,
      );
      assert.equal(response.status, 200, `route returned ${response.status}: ${JSON.stringify(responseBody)}`);
      assert.deepEqual(responseBody, { ok: true });

      // Went to the right webhook for this form
      const expectedUrl =
        form.route === "contact"
          ? webhooks.contactWebhookUrl()
          : webhooks.callbackWebhookUrl(String(form.data.source));
      assert.equal(stripQuery(call.url), stripQuery(new URL(expectedUrl)), "sent to the wrong webhook");

      // Payload sent to n8n
      const locale = form.data.locale as Locale;
      const language = locale === "es" ? "Spanish" : "English";
      assert.equal(call.body.formType, form.expectedFormType);
      assert.equal(call.body.locale, locale);
      assert.equal(call.body.language, language);
      assert.equal(call.body.name, form.data.name);
      assert.equal(call.body.phoneNumber, form.data.phoneNumber);
      assert.equal(call.body.source, form.data.source);
      assert.equal(typeof call.body.html, "string");
      assert.equal(call.body.html, call.body.htmlBody);
      assert.match(String(call.body.html), new RegExp(String(form.data.name)));

      if (form.route === "contact") {
        assert.equal(call.body.email, form.data.email);
        assert.equal(call.body.patientType, "newPatient");
        assert.deepEqual(call.body.availability, form.data.availability);
        assert.equal(call.body.lastDentalVisit, "oneToTwoYears");
      } else {
        assert.equal(call.body.summary, form.data.summary);
      }

      // Query string sent to n8n
      assert.equal(call.url.searchParams.get("formType"), form.expectedFormType);
      assert.equal(call.url.searchParams.get("language"), language);
      assert.equal(call.url.searchParams.get("name"), form.data.name);
    });
  }

  // Validation: bad submissions must be rejected and must NOT reach n8n.
  const invalid: Array<[string, FormCase["route"], unknown]> = [
    ["call-us: missing phone", "call-us", { ...callbackForm("call-us", "en"), phoneNumber: "" }],
    ["call-us: missing name", "call-us", { ...callbackForm("discount", "en"), name: "  " }],
    ["contact: missing email", "contact", { ...contactForm("en"), email: "" }],
    ["contact: missing patient type", "contact", { ...contactForm("es"), patientType: "" }],
    ["call-us: malformed JSON", "call-us", "{not json"],
    ["contact: malformed JSON", "contact", "{not json"],
  ];
  for (const [label, route, body] of invalid) {
    test(`rejects ${label} without calling the webhook`, async () => {
      calls = [];
      const response = await routes[route].POST(jsonRequest(`${SITE}/api/x/`, body));
      assert.equal(response.status, 400);
      assert.equal(calls.length, 0, "webhook was called for an invalid submission");
    });
  }

  // The browser forms must still post to these routes.
  test("client forms post to the API routes", () => {
    const callUsPage = readFileSync(path.join(ROOT, "app/offers/call-us/page.tsx"), "utf8");
    const discountPage = readFileSync(path.join(ROOT, "app/offers/discount/page.tsx"), "utf8");
    const contactHtml = readFileSync(path.join(ROOT, "content/contact/index.html"), "utf8");

    assert.match(callUsPage, /"\/api\/offers\/call-us\/"/, "call-us page no longer posts to /api/offers/call-us/");
    assert.match(discountPage, /CallUsOfferPage/, "discount page no longer reuses the call-us form");
    assert.match(contactHtml, /id="requestAppointment"/, "contact form #requestAppointment is missing");
    assert.match(contactHtml, /"\/api\/contact\/"/, "contact form no longer posts to /api/contact/");
  });
});
