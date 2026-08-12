import { espacoFernandes } from "../../content/espacoFernandes";
import { property, type ContentImage } from "../../content/property";
import type { EditableSiteSlug } from "../content/site-content";
import type { MediaLibraryConfig, MediaLibraryItem } from "./library";

function safeId(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 90);
}

function assetId(site: EditableSiteSlug, type: "image" | "video", path: string) {
  return `legacy-${site}-${type}-${safeId(path.replace(/^\//, ""))}`;
}

function imageItem(
  site: EditableSiteSlug,
  image: ContentImage | { src: string; alt: string; width?: number; height?: number },
  options: Partial<MediaLibraryItem> & Pick<MediaLibraryItem, "contentId" | "title" | "order">,
): MediaLibraryItem {
  const originalName = image.src.split("/").pop() ?? "imagem.webp";
  return {
    assetId: assetId(site, "image", image.src),
    contentId: options.contentId,
    type: "image",
    storagePath: "",
    publicUrl: image.src,
    fallbackPath: image.src,
    originalName,
    mimeType: originalName.endsWith(".png") ? "image/png" : "image/webp",
    sizeBytes: 0,
    title: options.title,
    caption: options.caption ?? ("caption" in image ? image.caption ?? "" : ""),
    alt: options.alt ?? image.alt,
    categoryId: options.categoryId ?? null,
    order: options.order,
    active: options.active ?? true,
    featured: options.featured ?? false,
    specificUse: options.specificUse ?? [],
    posterAssetId: null,
    isPrimary: false,
    duration: null,
    format: null,
    width: "width" in image ? image.width : undefined,
    height: "height" in image ? image.height : undefined,
  };
}

function mergeImage(items: MediaLibraryItem[], incoming: MediaLibraryItem) {
  const existing = items.find((item) => item.assetId === incoming.assetId);
  if (!existing) {
    items.push(incoming);
    return incoming;
  }
  existing.specificUse = [...new Set([...existing.specificUse, ...incoming.specificUse])];
  existing.featured ||= incoming.featured;
  return existing;
}

export function buildStaticMediaLibrary(site: EditableSiteSlug): MediaLibraryConfig {
  if (site === "chacara-alto-dos-torres") {
    const items: MediaLibraryItem[] = property.gallery.items.map((item) =>
      imageItem(site, item, {
        contentId: item.id,
        title: item.caption ?? item.id,
        caption: item.caption ?? "",
        categoryId: item.category,
        order: item.order,
        active: item.visible,
        specificUse: ["gallery"],
      }),
    );
    const hero = items.find((item) => item.fallbackPath === property.hero.mainImage.src);
    if (hero) {
      hero.specificUse.push("hero-image");
      hero.featured = true;
    }
    for (const crop of property.crops.items) {
      if (!crop.image) continue;
      mergeImage(items, imageItem(site, crop.image, {
        contentId: `crop-${crop.id}`,
        title: crop.name,
        order: items.length + 1,
        active: crop.visible,
        specificUse: [`crop-${crop.id}`],
      }));
    }
    if (property.contact.ownerImage) {
      mergeImage(items, imageItem(site, property.contact.ownerImage, {
        contentId: "owner-image",
        title: "Foto do proprietário",
        order: items.length + 1,
        specificUse: ["owner-profile"],
      }));
    }
    for (const video of property.videos.items) {
      let posterId: string | null = null;
      if (video.coverImage) {
        const poster = mergeImage(items, imageItem(site, video.coverImage, {
          contentId: `poster-${video.id}`,
          title: `Capa — ${video.title}`,
          order: items.length + 1,
          active: true,
          specificUse: ["video-poster"],
        }));
        posterId = poster.assetId;
      }
      const originalName = video.url.split("/").pop() ?? `${video.id}.mp4`;
      items.push({
        assetId: assetId(site, "video", video.url),
        contentId: video.id,
        type: "video",
        storagePath: "",
        publicUrl: video.url,
        fallbackPath: video.url,
        originalName,
        mimeType: "video/mp4",
        sizeBytes: 0,
        title: video.title,
        caption: video.description,
        alt: "",
        categoryId: null,
        order: video.order,
        active: video.visible,
        featured: video.role === "main",
        specificUse: video.role === "main" ? ["hero-video"] : ["video-gallery"],
        posterAssetId: posterId,
        isPrimary: video.role === "main",
        duration: video.duration,
        format: video.format,
      });
    }
    return {
      version: 1,
      siteSlug: site,
      galleryInitialCount: null,
      categories: property.gallery.categories
        .filter((category) => category.id !== "all")
        .map((category, index) => ({
          id: category.id,
          label: category.label,
          order: index + 1,
          visible: property.gallery.items.some(
            (item) => item.category === category.id && item.visible,
          ),
        })),
      items,
    };
  }

  const items: MediaLibraryItem[] = espacoFernandes.gallery.items.map((item) =>
    imageItem(site, item, {
      contentId: item.id,
      title: item.title,
      caption: item.caption,
      categoryId: item.category,
      order: item.order,
      active: item.visible,
      specificUse: ["gallery"],
    }),
  );
  const featured = items.find(
    (item) => item.fallbackPath === espacoFernandes.structure.featuredImage.src,
  );
  if (featured) {
    featured.specificUse.push("featured-image");
    featured.featured = true;
  }
  const chalet = items.find((item) => item.fallbackPath === espacoFernandes.chalet.image.src);
  if (chalet) chalet.specificUse.push("chalet-image");
  const poster = mergeImage(items, imageItem(site, espacoFernandes.hero.video.poster, {
    contentId: "poster-apresentacao-principal",
    title: "Capa — Conheça o Espaço Fernandes",
    caption: espacoFernandes.hero.video.description,
    order: items.length + 1,
    active: true,
    specificUse: ["video-poster"],
  }));
  const videoPath = espacoFernandes.hero.video.src;
  items.push({
    assetId: assetId(site, "video", videoPath),
    contentId: "apresentacao-principal",
    type: "video",
    storagePath: "",
    publicUrl: videoPath,
    fallbackPath: videoPath,
    originalName: videoPath.split("/").pop() ?? "apresentacao-principal.mp4",
    mimeType: "video/mp4",
    sizeBytes: 0,
    title: espacoFernandes.hero.video.title,
    caption: espacoFernandes.hero.video.description,
    alt: "",
    categoryId: null,
    order: 1,
    active: espacoFernandes.hero.video.visible,
    featured: true,
    specificUse: ["hero-video"],
    posterAssetId: poster.assetId,
    isPrimary: true,
    duration: espacoFernandes.hero.video.duration,
    format: "vertical",
  });
  return {
    version: 1,
    siteSlug: site,
    galleryInitialCount: 12,
    categories: espacoFernandes.gallery.categories
      .filter((category) => category.id !== "all")
      .map((category, index) => ({
        id: category.id,
        label: category.label,
        order: index + 1,
        visible: true,
      })),
    items,
  };
}
