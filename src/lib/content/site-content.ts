import { espacoFernandes, type EspacoFernandesContent } from "@/src/content/espacoFernandes";
import { property, type PropertyContent } from "@/src/content/property";

export const EDITABLE_SITE_SLUGS = [
  "chacara-alto-dos-torres",
  "espaco-fernandes",
] as const;

export type EditableSiteSlug = (typeof EDITABLE_SITE_SLUGS)[number];

export type SiteContentMap = {
  "chacara-alto-dos-torres": PropertyContent;
  "espaco-fernandes": EspacoFernandesContent;
};

export const staticSiteContent: SiteContentMap = {
  "chacara-alto-dos-torres": property,
  "espaco-fernandes": espacoFernandes,
};

export function siteContentTag(siteSlug: EditableSiteSlug) {
  return `site-content:${siteSlug}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function looksLikePublishedContent(
  siteSlug: EditableSiteSlug,
  value: unknown,
): value is SiteContentMap[EditableSiteSlug] {
  if (!isRecord(value)) return false;

  if (siteSlug === "chacara-alto-dos-torres") {
    return (
      typeof value.propertyName === "string" &&
      isRecord(value.hero) &&
      isRecord(value.contact) &&
      isRecord(value.faq)
    );
  }

  return (
    isRecord(value.brand) &&
    isRecord(value.hero) &&
    isRecord(value.contact) &&
    isRecord(value.faq)
  );
}

export async function getPublishedSiteContent<S extends EditableSiteSlug>(
  siteSlug: S,
): Promise<SiteContentMap[S]> {
  const fallback = staticSiteContent[siteSlug];
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !publishableKey) return fallback;

  try {
    const query = new URL(`${supabaseUrl}/rest/v1/site_content`);
    query.searchParams.set("site_slug", `eq.${siteSlug}`);
    query.searchParams.set("select", "published_content");
    query.searchParams.set("limit", "1");

    const response = await fetch(query, {
      headers: {
        apikey: publishableKey,
        Authorization: `Bearer ${publishableKey}`,
      },
      next: {
        revalidate: 300,
        tags: [siteContentTag(siteSlug)],
      },
    });

    if (!response.ok) return fallback;

    const rows = (await response.json()) as Array<{ published_content?: unknown }>;
    const published = rows[0]?.published_content;

    return looksLikePublishedContent(siteSlug, published)
      ? (published as SiteContentMap[S])
      : fallback;
  } catch {
    return fallback;
  }
}
