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
    return process.env.DISCOUNT_OFFER_WEBHOOK_URL;
  }
  return process.env.CALL_US_WEBHOOK_URL;
}

export function contactWebhookUrl() {
  return process.env.CONTACT_FORM_WEBHOOK_URL;
}

export function callbackFormType(source: string) {
  return isDiscountOfferSource(source) ? "discount" : "callback";
}
