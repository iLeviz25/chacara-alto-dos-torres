export type VideoProvider = "youtube" | "vimeo";

export interface SafeVideoEmbed {
  provider: VideoProvider;
  videoId: string;
  embedUrl: string;
  title: string;
}

const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const VIMEO_ID_PATTERN = /^\d{6,12}$/;

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
  const candidate = [...segments].reverse().find((segment) => VIMEO_ID_PATTERN.test(segment));

  return candidate ?? null;
}

/**
 * Aceita somente URLs conhecidas e recria o endereço de incorporação sem parâmetros externos.
 */
export function getSafeVideoEmbed(value: string, title: string): SafeVideoEmbed | null {
  const url = parseUrl(value);

  if (!url) {
    return null;
  }

  const youtubeId = extractYouTubeId(url);
  if (youtubeId) {
    return {
      provider: "youtube",
      videoId: youtubeId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${youtubeId}`,
      title,
    };
  }

  const vimeoId = extractVimeoId(url);
  if (vimeoId) {
    return {
      provider: "vimeo",
      videoId: vimeoId,
      embedUrl: `https://player.vimeo.com/video/${vimeoId}`,
      title,
    };
  }

  return null;
}
