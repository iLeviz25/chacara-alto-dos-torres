import { createClient } from "@/src/lib/supabase/server";
import { buildStaticMediaLibrary } from "@/src/lib/media/static-media-library";
import type {
  MediaAssetRecord,
  MediaLibraryConfig,
} from "@/src/lib/media/library";
import type { EditableSiteSlug } from "@/src/lib/content/site-content";

export type MediaEditorState = {
  siteSlug: EditableSiteSlug;
  displayName: string;
  config: MediaLibraryConfig;
  publishedConfig: MediaLibraryConfig;
  assets: MediaAssetRecord[];
  hasDraft: boolean;
  draftUpdatedAt: string | null;
  publishedAt: string | null;
};

export async function getMediaEditorState(
  siteSlug: EditableSiteSlug,
): Promise<MediaEditorState> {
  const supabase = await createClient();
  const [{ data: publication, error: publicationError }, { data: draft, error: draftError }, { data: assets, error: assetsError }] =
    await Promise.all([
      supabase
        .from("media_publications")
        .select("published_config, published_at")
        .eq("site_slug", siteSlug)
        .single(),
      supabase
        .from("media_drafts")
        .select("draft_config, updated_at")
        .eq("site_slug", siteSlug)
        .maybeSingle(),
      supabase
        .from("media_assets")
        .select("id, site_slug, media_type, bucket_id, storage_path, public_url, local_fallback_path, original_name, mime_type, size_bytes, created_at, updated_at")
        .eq("site_slug", siteSlug)
        .is("deleted_at", null)
        .order("created_at", { ascending: true }),
    ]);
  if (publicationError || draftError || assetsError) {
    throw new Error("Não foi possível carregar a biblioteca de mídia.");
  }
  const fallback = buildStaticMediaLibrary(siteSlug);
  const publishedConfig = (publication?.published_config ?? fallback) as MediaLibraryConfig;
  return {
    siteSlug,
    displayName: siteSlug === "chacara-alto-dos-torres"
      ? "Chácara Alto dos Torres"
      : "Espaço Fernandes",
    config: (draft?.draft_config ?? publishedConfig) as MediaLibraryConfig,
    publishedConfig,
    assets: (assets ?? []) as MediaAssetRecord[],
    hasDraft: Boolean(draft),
    draftUpdatedAt: draft?.updated_at ?? null,
    publishedAt: publication?.published_at ?? null,
  };
}
