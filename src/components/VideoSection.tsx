"use client";

import { useState } from "react";
import type { PropertyContent } from "@/src/content/property";
import { getSafeVideoSource } from "@/src/lib/media";
import { PropertyVideoPlayer } from "@/src/components/PropertyVideoPlayer";
import { SectionHeading } from "@/src/components/SectionHeading";

interface VideoSectionProps {
  content: PropertyContent["videos"];
}

export function VideoSection({ content }: VideoSectionProps) {
  const [loadedVideoId, setLoadedVideoId] = useState<string | null>(null);
  const videos = content.items
    .filter((item) => item.visible && item.role === "short")
    .filter((item) => getSafeVideoSource(item.url, item.title) !== null)
    .sort((first, second) => first.order - second.order);

  if (videos.length === 0) return null;

  return (
    <section id={content.id} className="section-space bg-[#f7f2e8]">
      <div className="site-container">
        <SectionHeading
          description={<p>{content.description}</p>}
          eyebrow={content.eyebrow}
          title={content.title}
        />

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {videos.map((video) => {
            const descriptionId = `${video.id}-description`;

            return (
              <article
                className="overflow-hidden rounded-2xl border border-[#0d293c]/10 bg-white shadow-sm"
                key={video.id}
              >
                <PropertyVideoPlayer
                  className="mx-auto w-full max-w-sm rounded-none"
                  describedBy={descriptionId}
                  loaded={loadedVideoId === video.id}
                  onLoadRequest={() => setLoadedVideoId(video.id)}
                  playLabel={content.playLabel}
                  sizes="(max-width: 767px) 100vw, 384px"
                  video={video}
                />
                <div className="p-6">
                  <h3 className="text-xl font-extrabold text-[#0d293c]">{video.title}</h3>
                  <p id={descriptionId} className="mt-3 leading-7 text-[#59645c]">
                    {video.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
