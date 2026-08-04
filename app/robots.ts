import type { MetadataRoute } from "next";
import { property } from "@/src/content/property";

export default function robots(): MetadataRoute.Robots {
  const sitemap = property.seo.canonicalUrl
    ? `${property.seo.canonicalUrl.replace(/\/$/, "")}/sitemap.xml`
    : undefined;

  return {
    rules: {
      userAgent: "*",
      allow: property.seo.robots.index ? "/" : undefined,
      disallow: property.seo.robots.index ? undefined : "/",
    },
    sitemap,
  };
}
