import type { MetadataRoute } from "next";
import { property } from "@/src/content/property";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!property.seo.canonicalUrl) {
    return [];
  }

  return [
    {
      url: property.seo.canonicalUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
