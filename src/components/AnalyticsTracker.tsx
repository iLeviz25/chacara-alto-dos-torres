"use client";

import { useEffect } from "react";
import { trackAnalyticsEvent, trackPageView } from "@/src/lib/analytics/client";
import type { AnalyticsEventName, AnalyticsSite } from "@/src/lib/analytics/types";

export function AnalyticsTracker({ site }: { site: AnalyticsSite }) {
  useEffect(() => {
    trackPageView(site);

    const handleClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const tracked = target?.closest<HTMLElement>("[data-analytics-event]");
      const eventName = tracked?.dataset.analyticsEvent as
        | AnalyticsEventName
        | undefined;

      if (!eventName) return;
      trackAnalyticsEvent({
        site,
        eventName,
        origin: tracked?.dataset.analyticsOrigin,
      });
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [site]);

  return null;
}
