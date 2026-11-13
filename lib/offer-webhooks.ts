const CALL_US_WEBHOOK_FALLBACK =
  "https://n8n.srv1393511.hstgr.cloud/webhook/93be34dd-b236-4414-9879-5b3fd6c91320";
const DISCOUNT_WEBHOOK_FALLBACK =
  "https://n8n.srv1393511.hstgr.cloud/webhook/d64b27de-ac94-4037-9f4a-c85f0b8c0d94";
const CONTACT_WEBHOOK_FALLBACK =
  "https://n8n.srv1393511.hstgr.cloud/webhook/a6cd3ac1-d3a8-4dbd-b9b5-81fe98689152";

function webhookFromEnv(name: string, fallback: string) {
  const value = process.env[name]?.trim();
  return value || fallback;
}

export function isDiscountOfferSource(source: string) {
  try {
    const { pathname } = new URL(source);
    return pathname === "/offers/discount" || pathname.startsWith("/offers/discount/");
  } catch {
    return /\/offers\/discount(?:\/|$)/.test(source);
  }
}

export function callbackWebhookUrl(source: string) {
  if (isDiscountOfferSource(source)) {
    return webhookFromEnv("DISCOUNT_OFFER_WEBHOOK_URL", DISCOUNT_WEBHOOK_FALLBACK);
  }
  return webhookFromEnv("CALL_US_WEBHOOK_URL", CALL_US_WEBHOOK_FALLBACK);
}

export function contactWebhookUrl() {
  return webhookFromEnv("CONTACT_FORM_WEBHOOK_URL", CONTACT_WEBHOOK_FALLBACK);
}

export function callbackFormType(source: string) {
  return isDiscountOfferSource(source) ? "discount" : "callback";
}
