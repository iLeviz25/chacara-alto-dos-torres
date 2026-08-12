"use client";

import { Play } from "lucide-react";
import { useRef, useState } from "react";
import { SiteImage } from "@/src/components/SiteImage";
import type { PropertyVideo } from "@/src/content/property";
import { trackAnalyticsEvent } from "@/src/lib/analytics/client";
import { getSafeVideoSource } from "@/src/lib/media";

interface PropertyVideoPlayerProps {
  video: PropertyVideo;
  playLabel: string;
  sizes: string;
  className?: string;
  describedBy?: string;
  priority?: boolean;
  loaded?: boolean;
  onLoadRequest?: () => void;
  analyticsOrigin: string;
}

export function PropertyVideoPlayer({
  video,
  playLabel,
  sizes,
  className = "",
  describedBy,
  priority = false,
  loaded,
  onLoadRequest,
  analyticsOrigin,
}: PropertyVideoPlayerProps) {
  const [isInternallyLoaded, setIsInternallyLoaded] = useState(false);
  const hasTrackedPlay = useRef(false);
  const isLoaded = loaded ?? isInternallyLoaded;
  const source = getSafeVideoSource(video.url, video.title);

  const requestLoad = () => {
    if (onLoadRequest) {
      onLoadRequest();
      return;
    }

    setIsInternallyLoaded(true);
  };

  if (!source) return null;

  const trackPlay = () => {
    if (hasTrackedPlay.current) return;
    hasTrackedPlay.current = true;
    trackAnalyticsEvent({
      site: "chacara-alto-dos-torres",
      eventName: "video_play",
      origin: analyticsOrigin,
    });
  };

  return (
    <div
      className={[
        "relative overflow-hidden rounded-[1.75rem] bg-[#0d293c]",
        video.format === "vertical" ? "aspect-[9/16]" : "aspect-video",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-video-id={video.id}
    >
      {isLoaded ? (
        source.provider === "mp4" ? (
          <video
            aria-describedby={describedBy}
            aria-label={source.title}
            autoFocus
            className="absolute inset-0 size-full bg-black object-contain"
            controls
            playsInline
            poster={video.coverImage?.src}
            preload="none"
            src={source.sourceUrl}
            onPlay={trackPlay}
            onError={(event) => {
              if (video.fallbackUrl && event.currentTarget.src !== new URL(video.fallbackUrl, window.location.origin).href) {
                event.currentTarget.src = video.fallbackUrl;
                event.currentTarget.load();
              }
            }}
          />
        ) : (
          <iframe
            allow="clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 size-full border-0"
            loading="lazy"
            src={source.sourceUrl}
            title={source.title}
          />
        )
      ) : (
        <button
          aria-describedby={describedBy}
          aria-label={`${playLabel}: ${video.title} (${video.duration})`}
          className="group absolute inset-0 size-full text-white outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#ff9a4d]"
          onClick={() => {
            requestLoad();
            trackPlay();
          }}
          type="button"
        >
          {video.coverImage ? (
            <SiteImage
              alt={video.coverImage.alt}
              className={`${video.coverImage.fit === "contain" ? "object-contain" : "object-cover"} opacity-72 transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100`}
              fill
              fallbackSrc={video.coverImage.fallbackSrc}
              priority={priority}
              sizes={sizes}
              src={video.coverImage.src}
            />
          ) : (
            <span className="absolute inset-0 bg-[radial-gradient(circle_at_72%_25%,#315f40_0%,#0d293c_56%,#081f30_100%)]" />
          )}
          <span className="absolute inset-0 bg-black/15" />
          <span className="absolute right-4 bottom-4 rounded-full bg-[#0d293c]/90 px-3 py-1 text-sm font-extrabold shadow-lg">
            {video.duration}
          </span>
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-5 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-[#f47f20] text-[#0d293c] shadow-xl transition-transform group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
              <Play aria-hidden="true" className="ml-1" fill="currentColor" size={26} />
            </span>
            <span className="rounded-full bg-[#0d293c]/84 px-4 py-2 font-bold shadow-lg">
              {playLabel}
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
