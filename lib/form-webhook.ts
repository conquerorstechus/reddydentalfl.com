export function readText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function postFormWebhook(
  webhookUrl: string,
  payload: Record<string, unknown>,
  query: Record<string, string>,
) {
  const webhook = new URL(webhookUrl);
  for (const [key, value] of Object.entries(query)) {
    webhook.searchParams.set(key, value);
  }

  const upstream = await fetch(webhook, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!upstream.ok) {
    throw new Error("Webhook request failed.");
  }
}
