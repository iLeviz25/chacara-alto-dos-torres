import { createClient } from "@/src/lib/supabase/server";
import {
  staticSiteContent,
  type EditableSiteSlug,
  type SiteContentMap,
} from "./site-content";

export type SiteEditorState<S extends EditableSiteSlug> = {
  siteSlug: S;
  displayName: string;
  content: SiteContentMap[S];
  publishedContent: SiteContentMap[S];
  hasDraft: boolean;
  draftUpdatedAt: string | null;
  publishedAt: string | null;
};

export async function getSiteEditorState<S extends EditableSiteSlug>(
  siteSlug: S,
): Promise<SiteEditorState<S>> {
  const supabase = await createClient();
  const [{ data: published, error: publishedError }, { data: draft, error: draftError }] =
    await Promise.all([
      supabase
        .from("site_content")
        .select("display_name, published_content, published_at")
        .eq("site_slug", siteSlug)
        .single(),
      supabase
        .from("site_content_drafts")
        .select("draft_content, updated_at")
        .eq("site_slug", siteSlug)
        .maybeSingle(),
    ]);

  if (publishedError) {
    throw new Error("Não foi possível carregar o conteúdo publicado.");
  }
  if (draftError) {
    throw new Error("Não foi possível carregar o rascunho.");
  }

  const fallback = staticSiteContent[siteSlug];
  const publishedContent = (published?.published_content ?? fallback) as SiteContentMap[S];
  const draftContent = draft?.draft_content as SiteContentMap[S] | undefined;

  return {
    siteSlug,
    displayName: published?.display_name ??
      (siteSlug === "chacara-alto-dos-torres" ? "Chácara Alto dos Torres" : "Espaço Fernandes"),
    content: draftContent ?? publishedContent,
    publishedContent,
    hasDraft: Boolean(draftContent),
    draftUpdatedAt: draft?.updated_at ?? null,
    publishedAt: published?.published_at ?? null,
  };
}
