import "server-only";
import { createClient } from "@supabase/supabase-js";

export function createAnalyticsIngestClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const ingestSecret = process.env.ANALYTICS_INGEST_SECRET;

  if (!url || !publishableKey || !ingestSecret) {
    throw new Error("Analytics server configuration is incomplete.");
  }

  return createClient(url, publishableKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        "x-analytics-ingest-secret": ingestSecret,
      },
    },
  });
}
