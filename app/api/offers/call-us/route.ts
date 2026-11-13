import { callbackFormType, callbackWebhookUrl } from "@/lib/offer-webhooks";
import { escapeHtml, postFormWebhook, readText } from "@/lib/form-webhook";

type CallbackPayload = {
  formType: "callback" | "discount";
  locale: string;
  language: "Spanish" | "English";
  source: string;
  name: string;
  phoneNumber: string;
  summary: string;
};

function buildEmailHtml(payload: CallbackPayload) {
  const formLabel = payload.formType === "discount" ? "Discount offer callback" : "Call-us offer callback";
  return `<h2>${formLabel}</h2>
<p><strong>Form:</strong> ${escapeHtml(formLabel)}</p>
<p><strong>Language:</strong> ${escapeHtml(payload.language)}</p>
<p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
<p><strong>Phone:</strong> ${escapeHtml(payload.phoneNumber)}</p>
<p><strong>Summary:</strong> ${escapeHtml(payload.summary || "(none)")}</p>
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
  const source = readText(record.source);
  const locale = readText(record.locale) === "es" ? "es" : "en";
  const payload: CallbackPayload = {
    formType: callbackFormType(source),
    locale,
    language: locale === "es" ? "Spanish" : "English",
    source,
    name: readText(record.name),
    phoneNumber: readText(record.phoneNumber),
    summary: readText(record.summary),
  };

  if (!payload.name || !payload.phoneNumber) {
    return Response.json({ error: "Name and phone number are required." }, { status: 400 });
  }

  const webhookUrl = callbackWebhookUrl(payload.source);
  if (!webhookUrl) {
    return Response.json({ error: "Callback webhook is not configured." }, { status: 500 });
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
      summary: payload.summary,
    });
  } catch {
    return Response.json({ error: "Webhook request failed." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
