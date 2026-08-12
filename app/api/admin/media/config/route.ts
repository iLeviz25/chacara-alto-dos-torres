import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminIdentity } from "@/src/lib/admin-auth";
import { EDITABLE_SITE_SLUGS, type EditableSiteSlug } from "@/src/lib/content/site-content";
import { validateMediaLibraryConfig, type MediaLibraryConfig } from "@/src/lib/media/library";
import { mediaLibraryTag } from "@/src/lib/media/published-media";
import { createClient } from "@/src/lib/supabase/server";

type RequestBody = {
  siteSlug?: unknown;
  intent?: unknown;
  config?: unknown;
};

function validSite(value: unknown): value is EditableSiteSlug {
  return typeof value === "string" && EDITABLE_SITE_SLUGS.includes(value as EditableSiteSlug);
}

function refresh(siteSlug: EditableSiteSlug) {
  revalidatePath("/admin/midia");
  revalidatePath(`/${siteSlug}`);
  revalidateTag(mediaLibraryTag(siteSlug), "max");
}

export async function POST(request: Request) {
  const identity = await getAdminIdentity();
  if (!identity) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitação inválida." }, { status: 400 });
  }
  if (!validSite(body.siteSlug) || !["save", "publish", "discard"].includes(String(body.intent))) {
    return NextResponse.json({ error: "Projeto ou ação inválida." }, { status: 400 });
  }
  const siteSlug = body.siteSlug;
  const intent = String(body.intent) as "save" | "publish" | "discard";
  const supabase = await createClient();
  if (intent === "discard") {
    const [{ data: publication }, { data: currentAssets }] = await Promise.all([
      supabase.from("media_publications").select("published_config").eq("site_slug", siteSlug).maybeSingle(),
      supabase
        .from("media_assets")
        .select("id, storage_path, local_fallback_path")
        .eq("site_slug", siteSlug)
        .is("deleted_at", null),
    ]);
    const publishedIds = new Set(
      ((publication?.published_config as MediaLibraryConfig | null)?.items ?? []).map((item) => item.assetId),
    );
    const abandoned = (currentAssets ?? []).filter(
      (asset) => !publishedIds.has(asset.id) && asset.local_fallback_path === null,
    );
    for (const asset of abandoned) {
      const { error: removeError } = await supabase.storage.from("site-media").remove([asset.storage_path]);
      if (!removeError) {
        await supabase.from("media_assets").update({
          deleted_at: new Date().toISOString(),
          deleted_by: identity.userId,
          is_active: false,
        }).eq("id", asset.id).eq("site_slug", siteSlug);
      }
    }
    const { error } = await supabase.from("media_drafts").delete().eq("site_slug", siteSlug);
    if (error) return NextResponse.json({ error: "Não foi possível descartar o rascunho." }, { status: 500 });
    refresh(siteSlug);
    return NextResponse.json({ message: "Rascunho descartado." });
  }

  const { data: assets, error: assetsError } = await supabase
    .from("media_assets")
    .select("id, media_type, storage_path, public_url, local_fallback_path, original_name, mime_type, size_bytes")
    .eq("site_slug", siteSlug)
    .is("deleted_at", null);
  if (assetsError) return NextResponse.json({ error: "Não foi possível validar os arquivos." }, { status: 500 });
  const canonicalConfig = structuredClone(body.config) as MediaLibraryConfig;
  if (canonicalConfig && Array.isArray(canonicalConfig.items)) {
    for (const item of canonicalConfig.items) {
      const asset = assets?.find((candidate) => candidate.id === item.assetId);
      if (!asset) continue;
      item.type = asset.media_type;
      item.storagePath = asset.storage_path;
      item.publicUrl = asset.public_url;
      item.fallbackPath = asset.local_fallback_path;
      item.originalName = asset.original_name;
      item.mimeType = asset.mime_type;
      item.sizeBytes = Number(asset.size_bytes);
    }
  }
  const validation = validateMediaLibraryConfig(
    canonicalConfig,
    siteSlug,
    new Set((assets ?? []).map((asset) => asset.id)),
  );
  if (!validation.ok) {
    return NextResponse.json({ error: validation.errors[0], errors: validation.errors }, { status: 400 });
  }
  const config = validation.config as MediaLibraryConfig & { pendingDeletion?: string[] };
  const pendingDeletion = Array.isArray(config.pendingDeletion)
    ? [...new Set(config.pendingDeletion)].filter((id) => typeof id === "string")
    : [];
  if (config.items.some((item) => pendingDeletion.includes(item.assetId))) {
    return NextResponse.json({ error: "Uma mídia marcada para exclusão ainda está em uso." }, { status: 400 });
  }

  const { error: draftError } = await supabase.from("media_drafts").upsert({
    site_slug: siteSlug,
    draft_config: config,
    updated_at: new Date().toISOString(),
    updated_by: identity.userId,
  }, { onConflict: "site_slug" });
  if (draftError) return NextResponse.json({ error: "Não foi possível salvar o rascunho." }, { status: 500 });
  if (intent === "save") {
    revalidatePath("/admin/midia");
    return NextResponse.json({ message: "Rascunho salvo. O site público não mudou." });
  }

  const { error: publishError } = await supabase.rpc("publish_media_library", { p_site_slug: siteSlug });
  if (publishError) return NextResponse.json({ error: "O rascunho foi salvo, mas não pôde ser publicado." }, { status: 500 });

  const warnings: string[] = [];
  for (const assetId of pendingDeletion) {
    const asset = assets?.find((candidate) => candidate.id === assetId);
    if (!asset) continue;
    const { error: removeError } = await supabase.storage.from("site-media").remove([asset.storage_path]);
    if (removeError) {
      warnings.push(`O arquivo ${asset.storage_path} ficou retido para limpeza posterior.`);
      continue;
    }
    await supabase.from("media_assets").update({
      deleted_at: new Date().toISOString(),
      deleted_by: identity.userId,
      is_active: false,
      is_primary: false,
      is_featured: false,
    }).eq("id", assetId).eq("site_slug", siteSlug);
  }
  refresh(siteSlug);
  return NextResponse.json({
    message: warnings.length > 0
      ? "Alterações publicadas; um arquivo será limpo posteriormente."
      : "Alterações de mídia publicadas com sucesso.",
    warnings,
  });
}
