export type VideoProvider = "youtube" | "vimeo" | "instagram" | "mp4";

export interface SafeVideoSource {
  provider: VideoProvider;
  sourceUrl: string;
  title: string;
}

const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const VIMEO_ID_PATTERN = /^\d{6,12}$/;
const INSTAGRAM_CODE_PATTERN = /^[A-Za-z0-9_-]{5,30}$/;

function parseUrl(value: string): URL | null {
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" || url.protocol === "http:" ? url : null;
  } catch {
    return null;
  }
}

function extractYouTubeId(url: URL): string | null {
  const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
  let candidate: string | null = null;

  if (hostname === "youtu.be") {
    candidate = url.pathname.split("/").filter(Boolean)[0] ?? null;
  } else if (
    hostname === "youtube.com" ||
    hostname === "m.youtube.com" ||
    hostname === "music.youtube.com" ||
    hostname === "youtube-nocookie.com"
  ) {
    if (url.pathname === "/watch") {
      candidate = url.searchParams.get("v");
    } else {
      const segments = url.pathname.split("/").filter(Boolean);
      if (["embed", "shorts", "live"].includes(segments[0] ?? "")) {
        candidate = segments[1] ?? null;
      }
    }
  }

  return candidate && YOUTUBE_ID_PATTERN.test(candidate) ? candidate : null;
}

function extractVimeoId(url: URL): string | null {
  const hostname = url.hostname.toLowerCase().replace(/^www\./, "");

  if (hostname !== "vimeo.com" && hostname !== "player.vimeo.com") {
    return null;
  }

  const segments = url.pathname.split("/").filter(Boolean);
  return [...segments].reverse().find((segment) => VIMEO_ID_PATTERN.test(segment)) ?? null;
}

function getInstagramEmbed(url: URL): string | null {
  const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
  if (hostname !== "instagram.com") return null;

  const [kind, code] = url.pathname.split("/").filter(Boolean);
  if (!["p", "reel", "tv"].includes(kind ?? "") || !code) return null;
  if (!INSTAGRAM_CODE_PATTERN.test(code)) return null;

  return `https://www.instagram.com/${kind}/${code}/embed/captioned/`;
}

function getLocalMp4(value: string): string | null {
  const normalized = value.trim();
  if (!normalized.startsWith("/") || normalized.startsWith("//")) return null;
  if (normalized.includes("..") || normalized.includes("\\")) return null;
  return /\.mp4(?:[?#].*)?$/i.test(normalized) ? normalized : null;
}

function getRemoteMp4(value: string): string | null {
  const url = parseUrl(value);
  if (!url || url.protocol !== "https:") return null;
  if (!/\.mp4(?:[?#].*)?$/i.test(url.pathname + url.search)) return null;
  return url.toString();
}

/**
 * Aceita somente fontes conhecidas e recria URLs externas sem parâmetros
 * fornecidos pelo usuário. Arquivos MP4 devem estar na pasta `public`.
 */
export function getSafeVideoSource(value: string, title: string): SafeVideoSource | null {
  const localMp4 = getLocalMp4(value);
  if (localMp4) {
    return { provider: "mp4", sourceUrl: localMp4, title };
  }

  const remoteMp4 = getRemoteMp4(value);
  if (remoteMp4) {
    return { provider: "mp4", sourceUrl: remoteMp4, title };
  }

  const url = parseUrl(value);
  if (!url) return null;

  const youtubeId = extractYouTubeId(url);
  if (youtubeId) {
    return {
      provider: "youtube",
      sourceUrl: `https://www.youtube-nocookie.com/embed/${youtubeId}`,
      title,
    };
  }

  const vimeoId = extractVimeoId(url);
  if (vimeoId) {
    return {
      provider: "vimeo",
      sourceUrl: `https://player.vimeo.com/video/${vimeoId}`,
      title,
    };
  }

  const instagramEmbed = getInstagramEmbed(url);
  if (instagramEmbed) {
    return { provider: "instagram", sourceUrl: instagramEmbed, title };
  }

  return null;
}
