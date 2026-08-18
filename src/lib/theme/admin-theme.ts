import { createClient } from "@/src/lib/supabase/server";
import type { EditableSiteSlug } from "@/src/lib/content/site-content";
import {
  DEFAULT_SITE_THEMES,
  validateSiteTheme,
  type SiteTheme,
} from "./site-theme";

export type SiteThemeEditorState = {
  siteSlug: EditableSiteSlug;
  displayName: string;
  theme: SiteTheme;
  publishedTheme: SiteTheme;
  hasDraft: boolean;
  draftUpdatedAt: string | null;
  publishedAt: string | null;
};

export async function getSiteThemeEditorState(
  siteSlug: EditableSiteSlug,
): Promise<SiteThemeEditorState> {
  const supabase = await createClient();
  const [{ data: publication, error: publicationError }, { data: draft, error: draftError }] =
    await Promise.all([
      supabase
        .from("site_theme_publications")
        .select("display_name, published_theme, published_at")
        .eq("site_slug", siteSlug)
        .single(),
      supabase
        .from("site_theme_drafts")
        .select("draft_theme, updated_at")
        .eq("site_slug", siteSlug)
        .maybeSingle(),
    ]);

  if (publicationError) throw new Error("Não foi possível carregar o tema publicado.");
  if (draftError) throw new Error("Não foi possível carregar o rascunho do tema.");

  const fallback = DEFAULT_SITE_THEMES[siteSlug];
  const publishedValidation = validateSiteTheme(publication?.published_theme);
  const draftValidation = validateSiteTheme(draft?.draft_theme);
  const publishedTheme = publishedValidation.ok ? publishedValidation.theme : fallback;

  return {
    siteSlug,
    displayName: publication?.display_name ??
      (siteSlug === "chacara-alto-dos-torres" ? "Chácara Alto dos Torres" : "Espaço Fernandes"),
    theme: draftValidation.ok ? draftValidation.theme : publishedTheme,
    publishedTheme,
    hasDraft: draftValidation.ok,
    draftUpdatedAt: draft?.updated_at ?? null,
    publishedAt: publication?.published_at ?? null,
  };
}
