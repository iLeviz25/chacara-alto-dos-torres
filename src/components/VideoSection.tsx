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
          if (first.role === second.role) return 0;
          return first.role === "main" ? -1 : 1;
        }),
    [content.items],
  );
  const [loadedId, setLoadedId] = useState<string | null>(null);

  if (videos.length === 0) return null;

  return (
    <section id={content.id} className="section-space bg-[#f7f2e8]">
      <div className="site-container">
        <SectionHeading
          eyebrow={content.eyebrow}
          title={content.title}
          description={<p>{content.description}</p>}
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {videos.map((video) => {
            const isLoaded = loadedId === video.id;
            const isVertical = video.format === "vertical";
            const isMain = video.role === "main";

            return (
              <article
                className={[
                  "overflow-hidden rounded-2xl border border-[#0d293c]/10 bg-white shadow-sm",
                  isMain ? "lg:col-span-2" : "",
                ].filter(Boolean).join(" ")}
                key={video.id}
              >
                <div
                  className={[
                    "relative overflow-hidden bg-[#0d293c]",
                    isVertical ? "mx-auto aspect-[9/16] w-full max-w-sm" : "aspect-video",
                  ].join(" ")}
                >
                  {isLoaded && video.source ? (
                    video.source.provider === "mp4" ? (
                      <video
                        aria-label={video.source.title}
                        className="absolute inset-0 size-full bg-black object-contain"
                        controls
                        playsInline
                        preload="metadata"
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
                      className="group absolute inset-0 size-full text-white outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#ff9a4d]"
                      onClick={() => setLoadedId(video.id)}
                      type="button"
                    >
                      {video.coverImage ? (
                        <SiteImage
                          src={video.coverImage.src}
                          alt={video.coverImage.alt}
                          fill
                          sizes={isVertical ? "384px" : "(max-width: 1023px) 100vw, 74rem"}
                          className="object-cover opacity-65 transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                      ) : (
                        <span className="absolute inset-0 bg-[radial-gradient(circle_at_72%_25%,#315f40_0%,#0d293c_56%,#081f30_100%)]" />
                      )}
                      <span className="absolute inset-0 bg-black/15" />
                      <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
                        <span className="grid size-16 place-items-center rounded-full bg-[#f47f20] text-[#0d293c] shadow-xl transition-transform group-hover:scale-105">
                          <Play aria-hidden="true" className="ml-1" size={26} fill="currentColor" />
                        </span>
                        <span className="font-bold">{content.playLabel}</span>
                      </span>
                    </button>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-extrabold text-[#0d293c]">{video.title}</h3>
                  <p className="mt-2 leading-7 text-[#59645c]">{video.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
