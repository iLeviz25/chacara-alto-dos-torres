import type { EditableSiteSlug } from "@/src/lib/content/site-content";
import {
  validateMediaLibraryConfig,
  type MediaLibraryConfig,
} from "@/src/lib/media/library";

export function mediaLibraryTag(siteSlug: EditableSiteSlug) {
  return `media-library:${siteSlug}`;
}
export async function getPublishedMediaLibrary(
  siteSlug: EditableSiteSlug,
): Promise<MediaLibraryConfig | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !publishableKey) return null;

  try {
    const query = new URL(`${supabaseUrl}/rest/v1/media_publications`);
    query.searchParams.set("site_slug", `eq.${siteSlug}`);
    query.searchParams.set("select", "published_config");
    query.searchParams.set("limit", "1");
    const response = await fetch(query, {
      headers: {
        apikey: publishableKey,
        Authorization: `Bearer ${publishableKey}`,
      },
      next: { revalidate: 300, tags: [mediaLibraryTag(siteSlug)] },
    });
    if (!response.ok) return null;
    const rows = (await response.json()) as Array<{ published_config?: unknown }>;
    const validation = validateMediaLibraryConfig(rows[0]?.published_config, siteSlug);
    return validation.ok ? validation.config : null;
  } catch {
    return null;
  }
}
