import {
  analyticsDevices,
  analyticsEventNames,
  analyticsSites,
  type AnalyticsEventName,
  type AnalyticsEventPayload,
  type AnalyticsSite,
} from "./types";

const whatsappOrigins = new Set([
  "hero",
  "contato",
  "cta-final",
  "botao-flutuante",
  "cabecalho",
  "rodape",
]);

const instagramOrigins = new Set(["contato", "rodape"]);

function isShortText(value: unknown, maximum: number) {
  return typeof value === "string" && value.trim().length <= maximum;
}

function isUuid(value: unknown) {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    )
  );
}

function isAllowedPage(site: AnalyticsSite, page: string) {
  if (!page.startsWith("/") || page.includes("//") || page.length > 180) {
    return false;
  }

  if (site === "hub") return page === "/";
  return page === `/${site}` || page.startsWith(`/${site}/`);
}

function isAllowedOrigin(eventName: AnalyticsEventName, origin?: string) {
  if (eventName === "page_view") return !origin;
  if (!origin || origin.length > 64) return false;
  if (eventName === "whatsapp_click") return whatsappOrigins.has(origin);
  if (eventName === "instagram_click") return instagramOrigins.has(origin);
  if (eventName === "gallery_open") {
    return origin === "galeria" || origin === "galeria-espaco";
  }
  return origin === "hero-video" || /^video-curto-0[1-9]$/.test(origin);
}

export function validateAnalyticsPayload(
  input: unknown,
): AnalyticsEventPayload | null {
  if (!input || typeof input !== "object") return null;
  const value = input as Record<string, unknown>;
  const site = value.site;
  const eventName = value.eventName;
  const page = value.page;
  const origin = value.origin;

  if (
    !analyticsSites.includes(site as AnalyticsSite) ||
    !analyticsEventNames.includes(eventName as AnalyticsEventName) ||
    !analyticsDevices.includes(value.device as AnalyticsEventPayload["device"]) ||
    !isUuid(value.eventId) ||
    !isUuid(value.sessionId) ||
    typeof page !== "string" ||
    !isAllowedPage(site as AnalyticsSite, page) ||
    (origin !== undefined && typeof origin !== "string") ||
    !isAllowedOrigin(eventName as AnalyticsEventName, origin as string | undefined)
  ) {
    return null;
  }

  for (const field of [
    "referrer",
    "utmSource",
    "utmMedium",
    "utmCampaign",
  ] as const) {
    if (value[field] !== undefined && !isShortText(value[field], 240)) {
      return null;
    }
  }

  return {
    eventId: value.eventId as string,
    sessionId: value.sessionId as string,
    site: site as AnalyticsSite,
    eventName: eventName as AnalyticsEventName,
    page,
    origin: origin as string | undefined,
    referrer: value.referrer as string | undefined,
    utmSource: value.utmSource as string | undefined,
    utmMedium: value.utmMedium as string | undefined,
    utmCampaign: value.utmCampaign as string | undefined,
    device: value.device as AnalyticsEventPayload["device"],
  };
}

export function normalizeReferrer(value?: string) {
  if (!value) return "Direto";

  try {
    const hostname = new URL(value).hostname.replace(/^www\./, "");
    return hostname || "Direto";
  } catch {
    return "Direto";
  }
}
