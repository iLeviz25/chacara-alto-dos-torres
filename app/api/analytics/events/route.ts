import { createHmac } from "node:crypto";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { normalizeReferrer, validateAnalyticsPayload } from "@/src/lib/analytics/validation";
import { createAnalyticsIngestClient } from "@/src/lib/supabase/analytics-ingest";

export const runtime = "nodejs";

const WINDOW_MS = 60_000;
const MAX_EVENTS_PER_WINDOW = 40;
const MAX_BODY_BYTES = 4096;
const MAX_TRACKED_CLIENTS = 5000;
const requestWindows = new Map<string, { count: number; expiresAt: number }>();

function getRequestKey(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || request.headers.get("x-real-ip") || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  const salt = process.env.ANALYTICS_HASH_SALT;
  if (!salt) throw new Error("Analytics rate-limit salt is missing.");
  return createHmac("sha256", salt).update(`${ip}|${userAgent}`).digest("hex");
}

function isRateLimited(key: string) {
  const now = Date.now();

  if (requestWindows.size >= MAX_TRACKED_CLIENTS) {
    for (const [storedKey, window] of requestWindows) {
      if (window.expiresAt <= now) requestWindows.delete(storedKey);
    }
  }

  const current = requestWindows.get(key);

  if (!current || current.expiresAt <= now) {
    if (requestWindows.size >= MAX_TRACKED_CLIENTS) return true;
    requestWindows.set(key, { count: 1, expiresAt: now + WINDOW_MS });
    return false;
  }

  current.count += 1;
  return current.count > MAX_EVENTS_PER_WINDOW;
}

function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    const originUrl = new URL(origin);
    const forwardedHost = request.headers.get("x-forwarded-host");
    const requestHost = forwardedHost || request.headers.get("host");
    return originUrl.host === requestHost;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Origem não permitida." }, { status: 403 });
  }

  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return NextResponse.json({ error: "Formato inválido." }, { status: 415 });
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Evento muito grande." }, { status: 413 });
  }

  let requestKey: string;
  try {
    requestKey = getRequestKey(request);
  } catch {
    return NextResponse.json({ error: "Serviço indisponível." }, { status: 503 });
  }

  if (isRateLimited(requestKey)) {
    return NextResponse.json({ error: "Muitas tentativas." }, { status: 429 });
  }

  let input: unknown;
  try {
    const body = await request.text();
    if (new TextEncoder().encode(body).byteLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Evento muito grande." }, { status: 413 });
    }
    input = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Evento inválido." }, { status: 400 });
  }

  const event = validateAnalyticsPayload(input);
  if (!event) {
    return NextResponse.json({ error: "Evento não permitido." }, { status: 400 });
  }

  const supabase = createAnalyticsIngestClient();
  const { error } = await supabase.rpc("record_analytics_event", {
    p_event_id: event.eventId,
    p_session_id: event.sessionId,
    p_site: event.site,
    p_event_name: event.eventName,
    p_page: event.page,
    p_origin: event.origin || null,
    p_referrer: normalizeReferrer(event.referrer),
    p_utm_source: event.utmSource || null,
    p_utm_medium: event.utmMedium || null,
    p_utm_campaign: event.utmCampaign || null,
    p_device: event.device,
  });

  if (error && error.code !== "23505") {
    console.error("Unable to store analytics event", error.code);
    return NextResponse.json({ error: "Não foi possível registrar o evento." }, { status: 500 });
  }

  return NextResponse.json({ accepted: true }, { status: 202 });
}
