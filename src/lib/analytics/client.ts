"use client";

import type {
  AnalyticsDevice,
  AnalyticsEventName,
  AnalyticsSite,
} from "./types";

const pageViewsSent = new Set<string>();
const SESSION_KEY = "site-analytics-session";

function getDevice(): AnalyticsDevice {
  if (window.innerWidth < 768) return "mobile";
  if (window.innerWidth < 1100) return "tablet";
  return "desktop";
}

function getSessionId() {
  const current = window.sessionStorage.getItem(SESSION_KEY);
  if (current) return current;
  const created = crypto.randomUUID();
  window.sessionStorage.setItem(SESSION_KEY, created);
  return created;
}

export function trackAnalyticsEvent({
  site,
  eventName,
  origin,
}: {
  site: AnalyticsSite;
  eventName: AnalyticsEventName;
  origin?: string;
}) {
  if (typeof window === "undefined") return;

  try {
    const page = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    const payload = {
      eventId: crypto.randomUUID(),
      sessionId: getSessionId(),
      site,
      eventName,
      page,
      origin,
      referrer: document.referrer || undefined,
      utmSource: params.get("utm_source") || undefined,
      utmMedium: params.get("utm_medium") || undefined,
      utmCampaign: params.get("utm_campaign") || undefined,
      device: getDevice(),
    };

    void fetch("/api/analytics/events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "same-origin",
      keepalive: true,
    }).catch(() => {
      // Analytics must never interrupt the visitor's action.
    });
  } catch {
    // Analytics must never interrupt the visitor's action.
  }
}

export function trackPageView(site: AnalyticsSite) {
  if (typeof window === "undefined") return;
  try {
    const key = `${site}:${window.location.pathname}`;
    if (pageViewsSent.has(key)) return;

    const storageKey = `site-analytics-page-view:${key}`;
    const previous = Number(window.sessionStorage.getItem(storageKey) || 0);
    const now = Date.now();
    if (previous && now - previous < 30 * 60 * 1000) {
      pageViewsSent.add(key);
      return;
    }

    pageViewsSent.add(key);
    window.sessionStorage.setItem(storageKey, String(now));
    trackAnalyticsEvent({ site, eventName: "page_view" });
  } catch {
    trackAnalyticsEvent({ site, eventName: "page_view" });
  }
}
