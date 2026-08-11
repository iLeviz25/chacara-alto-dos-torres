import { createClient } from "@/src/lib/supabase/server";
import type {
  AnalyticsCampaignRow,
  AnalyticsDeviceRow,
  AnalyticsOriginRow,
  AnalyticsReferrerRow,
  AnalyticsSummary,
  AnalyticsTotalRow,
} from "./types";

export type AnalyticsPeriod = "today" | "7d" | "30d" | "all";

export const analyticsPeriodOptions: Array<{
  value: AnalyticsPeriod;
  label: string;
}> = [
  { value: "today", label: "Hoje" },
  { value: "7d", label: "7 dias" },
  { value: "30d", label: "30 dias" },
  { value: "all", label: "Todo o período" },
];

function startOfTodayInSaoPaulo() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}T00:00:00-03:00`;
}

export function getAnalyticsSince(period: AnalyticsPeriod) {
  if (period === "all") return null;
  if (period === "today") return new Date(startOfTodayInSaoPaulo()).toISOString();
  const days = period === "7d" ? 7 : 30;
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

function asCount(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeSummary(value: unknown): AnalyticsSummary {
  const data = (value && typeof value === "object" ? value : {}) as Record<
    string,
    unknown
  >;
  const rows = (key: string) => (Array.isArray(data[key]) ? data[key] : []);

  return {
    totals: rows("totals").map((row) => ({
      ...(row as AnalyticsTotalRow),
      count: asCount((row as AnalyticsTotalRow).count),
    })),
    devices: rows("devices").map((row) => ({
      ...(row as AnalyticsDeviceRow),
      count: asCount((row as AnalyticsDeviceRow).count),
    })),
    referrers: rows("referrers").map((row) => ({
      ...(row as AnalyticsReferrerRow),
      count: asCount((row as AnalyticsReferrerRow).count),
    })),
    campaigns: rows("campaigns").map((row) => ({
      ...(row as AnalyticsCampaignRow),
      count: asCount((row as AnalyticsCampaignRow).count),
    })),
    whatsappOrigins: rows("whatsappOrigins").map((row) => ({
      ...(row as AnalyticsOriginRow),
      count: asCount((row as AnalyticsOriginRow).count),
    })),
  };
}

export async function getAnalyticsSummary(period: AnalyticsPeriod) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_analytics_summary", {
    p_since: getAnalyticsSince(period),
  });

  if (error) {
    console.error("Unable to load analytics summary", error.code);
    return {
      summary: normalizeSummary(null),
      available: false,
    };
  }

  return {
    summary: normalizeSummary(data),
    available: true,
  };
}
