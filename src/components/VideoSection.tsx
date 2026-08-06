"use client";

import { Play } from "lucide-react";
import { useMemo, useState } from "react";
import type { PropertyContent } from "@/src/content/property";
import { getSafeVideoSource } from "@/src/lib/media";
import { SectionHeading } from "@/src/components/SectionHeading";
import { SiteImage } from "@/src/components/SiteImage";

interface VideoSectionProps {
  content: PropertyContent["videos"];
}

export function VideoSection({ content }: VideoSectionProps) {
  const videos = useMemo(
    () =>
      content.items
        .filter((item) => item.visible)
        .map((item) => ({ ...item, source: getSafeVideoSource(item.url, item.title) }))
        .filter((item) => item.source !== null)
        .sort((first, second) => {
          if (first.role !== second.role) return first.role === "main" ? -1 : 1;
          return first.order - second.order;
        }),
    [content.items],
  );
  const [loadedId, setLoadedId] = useState<string | null>(null);

  if (videos.length === 0) return null;

  const mainVideo = videos.find((video) => video.role === "main") ?? videos[0];
  const shortVideos = videos.filter((video) => video.id !== mainVideo.id);

  const renderVideo = (video: (typeof videos)[number], isMain: boolean) => {
    const isLoaded = loadedId === video.id;
    const isVertical = video.format === "vertical";
    const mediaSizes = isMain
      ? isVertical
        ? "(max-width: 1023px) 100vw, 416px"
        : "(max-width: 1023px) 100vw, 50vw"
      : isVertical
        ? "(max-width: 767px) 100vw, 384px"
        : "(max-width: 767px) 100vw, 33vw";
    const descriptionId = `${video.id}-description`;

    return (
      <article
        className={[
          "overflow-hidden rounded-2xl border border-[#0d293c]/10 bg-white shadow-sm",
          isMain ? "lg:grid lg:grid-cols-[minmax(20rem,26rem)_1fr] lg:items-center" : "",
        ].filter(Boolean).join(" ")}
        key={video.id}
      >
        <div
          className={[
            "relative overflow-hidden bg-[#0d293c]",
            isVertical
              ? `mx-auto aspect-[9/16] w-full ${isMain ? "max-w-[26rem]" : "max-w-sm"}`
              : "aspect-video",
          ].join(" ")}
        >
          {isLoaded && video.source ? (
            video.source.provider === "mp4" ? (
              <video
                aria-describedby={descriptionId}
                aria-label={video.source.title}
                className="absolute inset-0 size-full bg-black object-contain"
                controls
                playsInline
                poster={video.coverImage?.src}
                preload="none"
                src={video.source.sourceUrl}
              />
            ) : (
              <iframe
                allow="clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 size-full border-0"
                loading="lazy"
                src={video.source.sourceUrl}
                title={video.source.title}
              />
            )
          ) : (
            <button
              aria-describedby={descriptionId}
              aria-label={`${content.playLabel}: ${video.title} (${video.duration})`}
              className="group absolute inset-0 size-full text-white outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#ff9a4d]"
              onClick={() => setLoadedId(video.id)}
              type="button"
            >
              {video.coverImage ? (
                <SiteImage
                  src={video.coverImage.src}
                  alt={video.coverImage.alt}
                  fill
                  sizes={mediaSizes}
                  className={`${video.coverImage.fit === "contain" ? "object-contain" : "object-cover"} opacity-70 transition-transform duration-500 group-hover:scale-[1.02]`}
                />
              ) : (
                <span className="absolute inset-0 bg-[radial-gradient(circle_at_72%_25%,#315f40_0%,#0d293c_56%,#081f30_100%)]" />
              )}
              <span className="absolute inset-0 bg-black/15" />
              <span className="absolute right-4 bottom-4 rounded-full bg-[#0d293c]/90 px-3 py-1 text-sm font-extrabold shadow-lg">
                {video.duration}
              </span>
              <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
                <span className="grid size-16 place-items-center rounded-full bg-[#f47f20] text-[#0d293c] shadow-xl transition-transform group-hover:scale-105">
                  <Play aria-hidden="true" className="ml-1" size={26} fill="currentColor" />
                </span>
                <span className="rounded-full bg-[#0d293c]/80 px-4 py-2 font-bold shadow-lg">
                  {content.playLabel}
                </span>
              </span>
            </button>
          )}
        </div>
        <div className={isMain ? "p-7 md:p-9 lg:p-10" : "p-6"}>
          {isMain ? (
            <p className="text-xs font-extrabold tracking-[0.14em] text-[#a96531] uppercase">
              Vídeo principal
            </p>
          ) : null}
          <h3 className={`${isMain ? "mt-3 text-2xl md:text-3xl" : "text-xl"} font-extrabold text-[#0d293c]`}>
            {video.title}
          </h3>
          <p id={descriptionId} className="mt-3 leading-7 text-[#59645c]">
            {video.description}
          </p>
        </div>
      </article>
    );
  };

  return (
    <section id={content.id} className="section-space bg-[#f7f2e8]">
      <div className="site-container">
        <SectionHeading
          eyebrow={content.eyebrow}
          title={content.title}
          description={<p>{content.description}</p>}
        />

        <div className="mt-10">{renderVideo(mainVideo, true)}</div>

        {shortVideos.length > 0 ? (
          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {shortVideos.map((video) => renderVideo(video, false))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
