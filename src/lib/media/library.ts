import type { EspacoFernandesContent } from "@/src/content/espacoFernandes";
import type { PropertyContent } from "@/src/content/property";
import type { EditableSiteSlug, SiteContentMap } from "@/src/lib/content/site-content";

export type ManagedMediaType = "image" | "video";

export type MediaCategory = {
  id: string;
  label: string;
  order: number;
  visible: boolean;
};

export type MediaLibraryItem = {
  assetId: string;
  contentId: string;
  type: ManagedMediaType;
  storagePath: string;
  publicUrl: string;
  fallbackPath: string | null;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  title: string;
  caption: string;
  alt: string;
  categoryId: string | null;
  order: number;
  active: boolean;
  featured: boolean;
  specificUse: string[];
  posterAssetId: string | null;
  isPrimary: boolean;
  duration: string | null;
  format: "vertical" | "horizontal" | null;
  width?: number;
  height?: number;
};

export type MediaLibraryConfig = {
  version: 1;
  siteSlug: EditableSiteSlug;
  galleryInitialCount: number | null;
  categories: MediaCategory[];
  items: MediaLibraryItem[];
};

export type MediaAssetRecord = {
  id: string;
  site_slug: EditableSiteSlug;
  media_type: ManagedMediaType;
  bucket_id: string;
  storage_path: string;
  public_url: string;
  local_fallback_path: string | null;
  original_name: string;
  mime_type: string;
  size_bytes: number;
  created_at: string;
  updated_at: string;
};

const allowedSites = new Set<EditableSiteSlug>([
  "chacara-alto-dos-torres",
  "espaco-fernandes",
]);
const safeCategoryId = /^[a-z0-9][a-z0-9-]{0,63}$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function validateMediaLibraryConfig(
  value: unknown,
  expectedSite: EditableSiteSlug,
  availableAssetIds?: Set<string>,
): { ok: true; config: MediaLibraryConfig } | { ok: false; errors: string[] } {
  const errors: string[] = [];
  if (!isRecord(value)) return { ok: false, errors: ["Configuração de mídia inválida."] };
  if (value.siteSlug !== expectedSite || !allowedSites.has(expectedSite)) {
    errors.push("O projeto informado é inválido.");
  }
  if (value.version !== 1) errors.push("A versão da biblioteca de mídia é inválida.");
  if (!Array.isArray(value.categories) || value.categories.length > 40) {
    errors.push("A lista de categorias é inválida.");
  }
  if (!Array.isArray(value.items) || value.items.length > 400) {
    errors.push("A lista de mídias é inválida.");
  }

  const categories = Array.isArray(value.categories) ? value.categories : [];
  const categoryIds = new Set<string>();
  for (const category of categories) {
    if (!isRecord(category)) {
      errors.push("Existe uma categoria inválida.");
      continue;
    }
    const id = typeof category.id === "string" ? category.id : "";
    if (!safeCategoryId.test(id) || id === "all" || categoryIds.has(id)) {
      errors.push("Existe uma categoria duplicada ou com identificação inválida.");
    }
    categoryIds.add(id);
    if (typeof category.label !== "string" || category.label.trim().length < 1 || category.label.length > 80) {
      errors.push("Revise o nome das categorias.");
    }
    if (!Number.isInteger(category.order) || typeof category.visible !== "boolean") {
      errors.push("Revise a ordem e a visibilidade das categorias.");
    }
  }

  const items = Array.isArray(value.items) ? value.items : [];
  const assetIds = new Set<string>();
  let primaryVideos = 0;
  let featuredImages = 0;
  for (const item of items) {
    if (!isRecord(item)) {
      errors.push("Existe uma mídia inválida.");
      continue;
    }
    const assetId = typeof item.assetId === "string" ? item.assetId : "";
    if (!assetId || assetIds.has(assetId)) errors.push("Existe uma mídia duplicada.");
    assetIds.add(assetId);
    if (availableAssetIds && !availableAssetIds.has(assetId)) {
      errors.push("Uma das mídias não pertence a este projeto.");
    }
    if (item.type !== "image" && item.type !== "video") errors.push("Tipo de mídia inválido.");
    if (typeof item.title !== "string" || item.title.length > 180) errors.push("Revise os títulos das mídias.");
    if (typeof item.caption !== "string" || item.caption.length > 1200) errors.push("Revise as legendas das mídias.");
    if (typeof item.alt !== "string" || item.alt.length > 500) errors.push("Revise os textos alternativos.");
    if (item.categoryId !== null && (typeof item.categoryId !== "string" || !categoryIds.has(item.categoryId))) {
      errors.push("Uma mídia está associada a uma categoria inválida.");
    }
    if (!Number.isInteger(item.order)) errors.push("Revise a ordem das mídias.");
    if (typeof item.active !== "boolean" || typeof item.featured !== "boolean") {
      errors.push("Revise a visibilidade das mídias.");
    }
    if (!Array.isArray(item.specificUse) || item.specificUse.some((entry) => typeof entry !== "string" || entry.length > 80)) {
      errors.push("Revise os usos específicos das mídias.");
    }
    if (item.type === "video" && item.active === true && item.isPrimary === true) primaryVideos += 1;
    if (item.type === "image" && item.active === true && item.featured === true) featuredImages += 1;
  }
  if (primaryVideos > 1) errors.push("Apenas um vídeo principal pode ficar ativo por projeto.");

  if (featuredImages > 1) errors.push("Apenas uma imagem de destaque pode ficar ativa por projeto.");

  const initialCount = value.galleryInitialCount;
  if (
    initialCount !== null &&
    (!Number.isInteger(initialCount) || Number(initialCount) < 1 || Number(initialCount) > 100)
  ) {
    errors.push("A quantidade inicial da galeria deve ficar entre 1 e 100.");
  }

  for (const item of items) {
    if (!isRecord(item) || item.posterAssetId === null) continue;
    if (typeof item.posterAssetId !== "string" || !assetIds.has(item.posterAssetId)) {
      errors.push("Um vídeo está usando uma capa inválida.");
    }
  }

  return errors.length > 0
    ? { ok: false, errors: [...new Set(errors)] }
    : { ok: true, config: value as MediaLibraryConfig };
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

function replacePublishedPaths<T>(value: T, replacements: Map<string, string>): T {
  const next = clone(value);
  const visit = (entry: unknown): void => {
    if (Array.isArray(entry)) {
      entry.forEach(visit);
      return;
    }
    if (!isRecord(entry)) return;
    for (const [key, child] of Object.entries(entry)) {
      if (typeof child === "string" && replacements.has(child) && ["src", "url"].includes(key)) {
        if (key === "src") entry.fallbackSrc = child;
        if (key === "url") entry.fallbackUrl = child;
        entry[key] = replacements.get(child)!;
      } else {
        visit(child);
      }
    }
  };
  visit(next);
  return next;
}

function applyChacaraMedia(
  content: PropertyContent,
  config: MediaLibraryConfig,
): PropertyContent {
  const activeItems = config.items.filter((item) => item.active);
  const replacements = new Map(
    activeItems
      .filter((item) => item.fallbackPath && item.publicUrl)
      .map((item) => [item.fallbackPath!, item.publicUrl]),
  );
  const next = replacePublishedPaths(content, replacements);
  const gallery = activeItems
    .filter((item) => item.type === "image" && item.specificUse.includes("gallery") && item.categoryId)
    .sort((a, b) => a.order - b.order)
    .map((item) => ({
      id: item.contentId,
      src: item.publicUrl,
      fallbackSrc: item.fallbackPath ?? undefined,
      alt: item.alt,
      caption: item.caption,
      isPlaceholder: false,
      category: item.categoryId as PropertyContent["gallery"]["items"][number]["category"],
      order: item.order,
      visible: item.active,
    }));
  next.gallery.items = gallery;
  next.gallery.categories = [
    { id: "all", label: "Todas" },
    ...config.categories
      .filter((category) => category.visible)
      .sort((a, b) => a.order - b.order)
      .map((category) => ({
        id: category.id as PropertyContent["gallery"]["categories"][number]["id"],
        label: category.label,
      })),
  ];

  const videos = activeItems
    .filter((item) => item.type === "video")
    .sort((a, b) => a.order - b.order)
    .map((item) => {
      const poster = item.posterAssetId
        ? activeItems.find((candidate) => candidate.assetId === item.posterAssetId && candidate.type === "image")
        : null;
      return {
        id: item.contentId,
        title: item.title,
        description: item.caption,
        url: item.publicUrl,
        fallbackUrl: item.fallbackPath ?? undefined,
        coverImage: poster
          ? {
              src: poster.publicUrl,
              fallbackSrc: poster.fallbackPath ?? undefined,
              alt: poster.alt,
              caption: poster.caption,
              isPlaceholder: false,
              fit: "cover" as const,
            }
          : null,
        role: item.isPrimary ? ("main" as const) : ("short" as const),
        format: item.format ?? ("vertical" as const),
        duration: item.duration ?? "",
        order: item.order,
        visible: item.active,
      };
    });
  next.videos.items = videos;

  const featured = activeItems.find((item) => item.type === "image" && item.featured);
  if (featured) {
    next.hero.mainImage = {
      src: featured.publicUrl,
      fallbackSrc: featured.fallbackPath ?? undefined,
      alt: featured.alt,
      caption: featured.caption,
      isPlaceholder: false,
      fit: "cover",
    };
  }
  return next;
}

function applyEspacoMedia(
  content: EspacoFernandesContent,
  config: MediaLibraryConfig,
): EspacoFernandesContent {
  const activeItems = config.items.filter((item) => item.active);
  const replacements = new Map(
    activeItems
      .filter((item) => item.fallbackPath && item.publicUrl)
      .map((item) => [item.fallbackPath!, item.publicUrl]),
  );
  const next = replacePublishedPaths(content, replacements);
  next.gallery.initialVisibleCount = config.galleryInitialCount ?? 12;
  next.gallery.categories = [
    { id: "all", label: "Todas" },
    ...config.categories
      .filter((category) => category.visible)
      .sort((a, b) => a.order - b.order)
      .map((category) => ({
        id: category.id as EspacoFernandesContent["gallery"]["categories"][number]["id"],
        label: category.label,
      })),
  ];
  const gallery = activeItems
    .filter((item) => item.type === "image" && item.specificUse.includes("gallery") && item.categoryId)
    .sort((a, b) => a.order - b.order)
    .map((item) => ({
      id: item.contentId,
      title: item.title,
      caption: item.caption,
      category: item.categoryId as EspacoFernandesContent["gallery"]["items"][number]["category"],
      order: item.order,
      visible: item.active,
      src: item.publicUrl,
      fallbackSrc: item.fallbackPath ?? undefined,
      alt: item.alt,
      width: item.width ?? 1600,
      height: item.height ?? 1200,
    }));
  next.gallery.items = gallery;

  const featured = activeItems.find((item) => item.type === "image" && item.featured);
  if (featured) {
    next.structure.featuredImage = {
      src: featured.publicUrl,
      fallbackSrc: featured.fallbackPath ?? undefined,
      alt: featured.alt,
      width: featured.width ?? 1600,
      height: featured.height ?? 1200,
    };
  }

  const primary = activeItems.find(
    (item) => item.type === "video" && item.isPrimary,
  );
  if (primary) {
    const poster = primary.posterAssetId
      ? activeItems.find((candidate) => candidate.assetId === primary.posterAssetId)
      : null;
    next.hero.video = {
      title: primary.title,
      description: primary.caption,
      src: primary.publicUrl,
      fallbackSrc: primary.fallbackPath ?? undefined,
      poster: poster
        ? {
            src: poster.publicUrl,
            fallbackSrc: poster.fallbackPath ?? undefined,
            alt: poster.alt,
            width: poster.width ?? 720,
            height: poster.height ?? 1280,
          }
        : next.hero.video.poster,
      duration: primary.duration ?? next.hero.video.duration,
      format: "vertical",
      visible: primary.active,
    };
  }
  return next;
}

export function applyPublishedMedia<S extends EditableSiteSlug>(
  siteSlug: S,
  content: SiteContentMap[S],
  config: MediaLibraryConfig | null,
): SiteContentMap[S] {
  if (!config || config.siteSlug !== siteSlug) return content;
  return (siteSlug === "chacara-alto-dos-torres"
    ? applyChacaraMedia(content as PropertyContent, config)
    : applyEspacoMedia(content as EspacoFernandesContent, config)) as SiteContentMap[S];
}
