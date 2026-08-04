"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { useMemo, useState } from "react";
import type { PropertyContent } from "@/src/content/property";
import { getSafeVideoEmbed } from "@/src/lib/media";
import { SectionHeading } from "@/src/components/SectionHeading";

interface VideoSectionProps {
  content: PropertyContent["videos"];
}

export function VideoSection({ content }: VideoSectionProps) {
  const videos = useMemo(
    () =>
      content.items
        .filter((item) => item.visible)
        .map((item) => ({ ...item, embed: getSafeVideoEmbed(item.url, item.title) }))
        .filter((item) => item.embed !== null),
    [content.items],
  );
  const [playingId, setPlayingId] = useState<string | null>(null);

  if (videos.length === 0) return null;

  return (
    <section id={content.id} className="section-space bg-[#f5f1e8]">
      <div className="site-container">
        <SectionHeading
          eyebrow={content.eyebrow}
          title={content.title}
          description={<p>{content.description}</p>}
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {videos.map((video) => {
            const isPlaying = playingId === video.id;
            return (
              <article key={video.id} className="overflow-hidden rounded-2xl border border-[#173f2b]/10 bg-white shadow-sm">
                <div className="relative aspect-video overflow-hidden bg-[#173f2b]">
                  {isPlaying && video.embed ? (
                    <iframe
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="absolute inset-0 size-full border-0"
                      loading="lazy"
                      src={`${video.embed.embedUrl}?autoplay=1`}
                      title={video.embed.title}
                    />
                  ) : (
                    <button
                      className="group absolute inset-0 size-full text-white outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#d8b48d]"
                      onClick={() => setPlayingId(video.id)}
                      type="button"
                    >
                      {video.coverImage ? (
                        <Image
                          src={video.coverImage.src}
                          alt={video.coverImage.alt}
                          fill
                          sizes="(max-width: 1023px) 100vw, 50vw"
                          className="object-cover opacity-65 transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                      ) : (
                        <span className="absolute inset-0 bg-[radial-gradient(circle_at_72%_25%,#55764c_0%,#173f2b_52%,#10301f_100%)]" />
                      )}
                      <span className="absolute inset-0 bg-black/15" />
                      <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
                        <span className="grid size-16 place-items-center rounded-full bg-white text-[#173f2b] shadow-xl transition-transform group-hover:scale-105">
                          <Play aria-hidden="true" className="ml-1" size={26} fill="currentColor" />
                        </span>
                        <span className="font-bold">{content.playLabel}</span>
                      </span>
                    </button>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-extrabold text-[#173f2b]">{video.title}</h3>
                  <p className="mt-2 leading-7 text-[#60675e]">{video.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
