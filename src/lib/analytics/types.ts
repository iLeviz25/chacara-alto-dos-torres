export const analyticsSites = [
  "chacara-alto-dos-torres",
  "espaco-fernandes",
  "hub",
] as const;

export const analyticsEventNames = [
  "page_view",
  "whatsapp_click",
  "instagram_click",
  "video_play",
  "gallery_open",
] as const;

export const analyticsDevices = ["mobile", "tablet", "desktop"] as const;

export type AnalyticsSite = (typeof analyticsSites)[number];
export type AnalyticsEventName = (typeof analyticsEventNames)[number];
export type AnalyticsDevice = (typeof analyticsDevices)[number];

export type AnalyticsEventPayload = {
  eventId: string;
  sessionId: string;
  site: AnalyticsSite;
  eventName: AnalyticsEventName;
  page: string;
  origin?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  device: AnalyticsDevice;
};

export type AnalyticsTotalRow = {
  site: AnalyticsSite;
  event_name: AnalyticsEventName;
  count: number;
};

export type AnalyticsDeviceRow = {
  site: AnalyticsSite;
  device: AnalyticsDevice;
  count: number;
};

export type AnalyticsReferrerRow = {
  site: AnalyticsSite;
  referrer: string;
  count: number;
};

export type AnalyticsCampaignRow = {
  site: AnalyticsSite;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  count: number;
};

export type AnalyticsOriginRow = {
  site: AnalyticsSite;
  origin: string;
  count: number;
};

export type AnalyticsSummary = {
  totals: AnalyticsTotalRow[];
  devices: AnalyticsDeviceRow[];
  referrers: AnalyticsReferrerRow[];
  campaigns: AnalyticsCampaignRow[];
  whatsappOrigins: AnalyticsOriginRow[];
};
