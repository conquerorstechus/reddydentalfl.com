const WEBHOOK_URL = process.env.CALL_US_WEBHOOK_URL;

type CallbackPayload = {
  source: string;
  name: string;
  phoneNumber: string;
  summary: string;
};

function readText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  if (!WEBHOOK_URL) {
    return Response.json({ error: "Callback webhook is not configured." }, { status: 500 });
  }

  let incoming: unknown;
  try {
    incoming = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const record = incoming && typeof incoming === "object" ? (incoming as Record<string, unknown>) : {};
  const payload: CallbackPayload = {
    source: readText(record.source),
    name: readText(record.name),
    phoneNumber: readText(record.phoneNumber),
    summary: readText(record.summary),
  };

  if (!payload.name || !payload.phoneNumber) {
    return Response.json({ error: "Name and phone number are required." }, { status: 400 });
  }

  const webhook = new URL(WEBHOOK_URL);
  webhook.searchParams.set("source", payload.source);
  webhook.searchParams.set("name", payload.name);
  webhook.searchParams.set("phoneNumber", payload.phoneNumber);
  webhook.searchParams.set("summary", payload.summary);

  try {
    const upstream = await fetch(webhook, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!upstream.ok) {
      return Response.json({ error: "Webhook request failed." }, { status: 502 });
    }
  } catch {
    return Response.json({ error: "Webhook request failed." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
