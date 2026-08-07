import type { MetadataRoute } from "next";
import { hub } from "@/src/content/hub";

export default function robots(): MetadataRoute.Robots {
  const sitemap = hub.seo.canonicalUrl
    ? `${hub.seo.canonicalUrl.replace(/\/$/, "")}/sitemap.xml`
    : undefined;

  return {
    rules: {
      userAgent: "*",
      allow: hub.seo.robots.index ? "/" : undefined,
      disallow: hub.seo.robots.index ? undefined : "/",
    },
    sitemap,
  };
}
