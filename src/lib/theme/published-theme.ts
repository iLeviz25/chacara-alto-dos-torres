import type { EditableSiteSlug } from "@/src/lib/content/site-content";
import {
  DEFAULT_SITE_THEMES,
  validateSiteTheme,
  type SiteTheme,
} from "./site-theme";

export function siteThemeTag(siteSlug: EditableSiteSlug) {
  return `site-theme:${siteSlug}`;
}

export async function getPublishedSiteTheme(
  siteSlug: EditableSiteSlug,
): Promise<SiteTheme> {
  const fallback = DEFAULT_SITE_THEMES[siteSlug];
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !publishableKey) return fallback;

  try {
    const query = new URL(`${supabaseUrl}/rest/v1/site_theme_publications`);
    query.searchParams.set("site_slug", `eq.${siteSlug}`);
    query.searchParams.set("select", "published_theme");
    query.searchParams.set("limit", "1");

    const response = await fetch(query, {
      headers: {
        apikey: publishableKey,
        Authorization: `Bearer ${publishableKey}`,
      },
      next: { revalidate: 300, tags: [siteThemeTag(siteSlug)] },
    });

    if (!response.ok) return fallback;
    const rows = (await response.json()) as Array<{ published_theme?: unknown }>;
    const validated = validateSiteTheme(rows[0]?.published_theme);
    return validated.ok ? validated.theme : fallback;
  } catch {
    return fallback;
  }
}
