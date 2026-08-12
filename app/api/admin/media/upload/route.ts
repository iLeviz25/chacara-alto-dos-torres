import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getAdminIdentity } from "@/src/lib/admin-auth";
import { EDITABLE_SITE_SLUGS, type EditableSiteSlug } from "@/src/lib/content/site-content";
import type { MediaLibraryConfig, MediaLibraryItem, ManagedMediaType } from "@/src/lib/media/library";
import { createClient } from "@/src/lib/supabase/server";

export const runtime = "nodejs";

const IMAGE_LIMIT = 12 * 1024 * 1024;
const VIDEO_LIMIT = 100 * 1024 * 1024;
const accepted = new Map([
  ["image/jpeg", ["jpg", "jpeg"]],
  ["image/png", ["png"]],
  ["image/webp", ["webp"]],
  ["video/mp4", ["mp4"]],
  ["video/webm", ["webm"]],
]);

type UploadRequest = {
  action?: unknown;
  siteSlug?: unknown;
  mediaType?: unknown;
  usage?: unknown;
  originalName?: unknown;
  mimeType?: unknown;
  sizeBytes?: unknown;
  storagePath?: unknown;
};

function safeSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 70) || "arquivo";
}

function validSite(value: unknown): value is EditableSiteSlug {
  return typeof value === "string" && EDITABLE_SITE_SLUGS.includes(value as EditableSiteSlug);
}

function validateFile(body: UploadRequest) {
  const originalName = typeof body.originalName === "string" ? body.originalName.slice(0, 180) : "";
  const mimeType = typeof body.mimeType === "string" ? body.mimeType : "";
  const sizeBytes = Number(body.sizeBytes);
  const extension = originalName.split(".").pop()?.toLowerCase() ?? "";
  const mediaType: ManagedMediaType | null = mimeType.startsWith("image/")
    ? "image"
    : mimeType.startsWith("video/")
      ? "video"
      : null;
  const extensions = accepted.get(mimeType);
  if (
    !originalName ||
    !extensions?.includes(extension) ||
    !mediaType ||
    body.mediaType !== mediaType
  ) {
    return { ok: false as const, error: "Formato de arquivo não permitido.", status: 400 };
  }
  const limit = mediaType === "image" ? IMAGE_LIMIT : VIDEO_LIMIT;
  if (!Number.isInteger(sizeBytes) || sizeBytes < 1 || sizeBytes > limit) {
    return {
      ok: false as const,
      error: mediaType === "image"
        ? "A imagem deve ter no máximo 12 MB."
        : "O vídeo deve ter no máximo 100 MB.",
      status: 413,
    };
  }
  return { ok: true as const, originalName, mimeType, sizeBytes, extension, mediaType };
}

function validStoragePath(
  value: unknown,
  siteSlug: EditableSiteSlug,
  mediaType: ManagedMediaType,
) {
  if (typeof value !== "string") return null;
  const folder = mediaType === "image" ? "images" : "videos";
  const pattern = new RegExp(`^${siteSlug}/${folder}/[a-zA-Z0-9._-]+$`);
  return pattern.test(value) ? value : null;
}

export async function POST(request: Request) {
  const identity = await getAdminIdentity();
  if (!identity) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  let body: UploadRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitação inválida." }, { status: 400 });
  }
  if (!validSite(body.siteSlug)) {
    return NextResponse.json({ error: "Projeto inválido." }, { status: 400 });
  }
  const siteSlug = body.siteSlug;
  const file = validateFile(body);
  if (!file.ok) return NextResponse.json({ error: file.error }, { status: file.status });
  const usage = body.usage === "poster" ? "poster" : "gallery";
  const supabase = await createClient();

  if (body.action === "ticket") {
    const storageName = `${safeSlug(file.originalName.replace(/\.[^.]+$/, ""))}-${randomUUID()}.${file.extension}`;
    const storagePath = `${siteSlug}/${file.mediaType === "image" ? "images" : "videos"}/${storageName}`;
    const { data, error } = await supabase.storage
      .from("site-media")
      .createSignedUploadUrl(storagePath, { upsert: false });
    if (error || !data) {
      return NextResponse.json({ error: "Não foi possível autorizar o envio." }, { status: 500 });
    }
    return NextResponse.json({
      storagePath,
      signedUrl: data.signedUrl,
      token: data.token,
    });
  }

  if (body.action !== "finalize") {
    return NextResponse.json({ error: "Ação de upload inválida." }, { status: 400 });
  }
  const storagePath = validStoragePath(body.storagePath, siteSlug, file.mediaType);
  if (!storagePath) {
    return NextResponse.json({ error: "Caminho de arquivo inválido." }, { status: 400 });
  }
  const { data: uploaded, error: infoError } = await supabase.storage.from("site-media").info(storagePath);
  const uploadedSize = Number(uploaded?.size ?? uploaded?.metadata?.size);
  const uploadedMime = uploaded?.contentType ?? String(uploaded?.metadata?.mimetype ?? uploaded?.metadata?.type ?? "");
  if (
    infoError ||
    !uploaded ||
    uploadedSize !== file.sizeBytes ||
    uploadedMime !== file.mimeType
  ) {
    if (uploaded) await supabase.storage.from("site-media").remove([storagePath]);
    return NextResponse.json({ error: "O arquivo enviado não passou pela validação final." }, { status: 400 });
  }

  const [{ data: draft }, { data: publication }] = await Promise.all([
    supabase.from("media_drafts").select("draft_config").eq("site_slug", siteSlug).maybeSingle(),
    supabase.from("media_publications").select("published_config").eq("site_slug", siteSlug).single(),
  ]);
  const config = structuredClone((draft?.draft_config ?? publication?.published_config) as MediaLibraryConfig | undefined);
  if (!config || !Array.isArray(config.items)) {
    await supabase.storage.from("site-media").remove([storagePath]);
    return NextResponse.json({ error: "Biblioteca de mídia indisponível." }, { status: 500 });
  }

  const id = `media-${randomUUID()}`;
  const publicUrl = supabase.storage.from("site-media").getPublicUrl(storagePath).data.publicUrl;
  const categoryId = file.mediaType === "image" && usage === "gallery"
    ? config.categories.find((category) => category.visible)?.id ?? null
    : null;
  const item: MediaLibraryItem = {
    assetId: id,
    contentId: id,
    type: file.mediaType,
    storagePath,
    publicUrl,
    fallbackPath: null,
    originalName: file.originalName,
    mimeType: file.mimeType,
    sizeBytes: file.sizeBytes,
    title: file.originalName.replace(/\.[^.]+$/, "").slice(0, 180),
    caption: "",
    alt: "",
    categoryId,
    order: config.items.filter((entry) => entry.type === file.mediaType).length + 1,
    active: false,
    featured: false,
    specificUse: file.mediaType === "image"
      ? [usage === "poster" ? "video-poster" : "gallery"]
      : ["video-gallery"],
    posterAssetId: null,
    isPrimary: false,
    duration: null,
    format: file.mediaType === "video" ? "vertical" : null,
  };

  const { error: assetError } = await supabase.from("media_assets").insert({
    id,
    site_slug: siteSlug,
    media_type: file.mediaType,
    bucket_id: "site-media",
    storage_path: storagePath,
    public_url: publicUrl,
    local_fallback_path: null,
    original_name: file.originalName,
    mime_type: file.mimeType,
    size_bytes: file.sizeBytes,
    created_by: identity.userId,
    updated_by: identity.userId,
  });
  if (assetError) {
    await supabase.storage.from("site-media").remove([storagePath]);
    return NextResponse.json({ error: "Não foi possível cadastrar o arquivo." }, { status: 500 });
  }

  config.items.push(item);
  const { error: draftError } = await supabase.from("media_drafts").upsert({
    site_slug: siteSlug,
    draft_config: config,
    updated_at: new Date().toISOString(),
    updated_by: identity.userId,
  }, { onConflict: "site_slug" });
  if (draftError) {
    await supabase.storage.from("site-media").remove([storagePath]);
    await supabase.from("media_assets").delete().eq("id", id);
    return NextResponse.json({ error: "Não foi possível criar o rascunho." }, { status: 500 });
  }

  return NextResponse.json({ item }, { status: 201 });
}
