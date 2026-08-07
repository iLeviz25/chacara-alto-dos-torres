import type { MetadataRoute } from "next";
import { hub } from "@/src/content/hub";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!hub.seo.canonicalUrl) {
    return [];
  }

  const canonicalUrl = hub.seo.canonicalUrl.replace(/\/$/, "");

  return [
    {
      url: canonicalUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${canonicalUrl}${hub.routes.chacara}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${canonicalUrl}${hub.routes.espacoFernandes}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
