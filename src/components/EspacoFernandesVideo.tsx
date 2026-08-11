"use client";

import { Play } from "lucide-react";
import { useRef, useState } from "react";
import { SiteImage } from "@/src/components/SiteImage";
import type { EspacoFernandesContent } from "@/src/content/espacoFernandes";
import { trackAnalyticsEvent } from "@/src/lib/analytics/client";

interface EspacoFernandesVideoProps {
  video: EspacoFernandesContent["hero"]["video"];
}

export function EspacoFernandesVideo({ video }: EspacoFernandesVideoProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const hasTrackedPlay = useRef(false);

  const trackPlay = () => {
    if (hasTrackedPlay.current) return;
    hasTrackedPlay.current = true;
    trackAnalyticsEvent({
      site: "espaco-fernandes",
      eventName: "video_play",
      origin: "hero-video",
    });
  };

  if (!video.visible) return null;

  return (
    <figure className="mx-auto w-full max-w-[25rem]">
      <div className="relative aspect-[9/16] overflow-hidden rounded-[2rem] border border-white/12 bg-black shadow-[0_32px_90px_rgba(0,0,0,0.45)]">
        {isLoaded ? (
          <video
            aria-label={video.title}
            className="absolute inset-0 size-full bg-black object-contain"
            controls
            playsInline
            poster={video.poster.src}
            preload="none"
            src={video.src}
            onPlay={trackPlay}
          />
        ) : (
          <button
            aria-label={`Reproduzir vídeo: ${video.title} (${video.duration})`}
            className="group absolute inset-0 size-full text-white outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#f3904f]"
            onClick={() => {
              setIsLoaded(true);
              trackPlay();
            }}
            type="button"
          >
            <SiteImage
              alt={video.poster.alt}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.018] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              fill
              priority
              sizes="(max-width: 1023px) min(88vw, 400px), 400px"
              src={video.poster.src}
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-black/15" />
            <span className="absolute right-4 bottom-4 rounded-full bg-black/75 px-3 py-1 text-xs font-extrabold backdrop-blur">
              {video.duration}
            </span>
            <span className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
              <span className="grid size-18 place-items-center rounded-full bg-[#f3904f] text-[#242423] shadow-2xl transition-transform group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
                <Play aria-hidden="true" className="ml-1" fill="currentColor" size={30} />
              </span>
              <span className="rounded-full bg-black/72 px-4 py-2 text-sm font-extrabold shadow-lg backdrop-blur">
                Assistir apresentação
              </span>
            </span>
          </button>
        )}
      </div>
      <figcaption className="mt-4 text-center text-sm leading-6 text-white/55">
        {video.description}
      </figcaption>
    </figure>
  );
}

export default EspacoFernandesVideo;
