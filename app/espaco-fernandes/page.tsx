import type { Metadata } from "next";
import { EspacoFernandesPlaceholder } from "@/src/components/EspacoFernandesPlaceholder";
import { hub } from "@/src/content/hub";

const canonicalUrl = hub.seo.canonicalUrl
  ? `${hub.seo.canonicalUrl.replace(/\/$/, "")}${hub.routes.espacoFernandes}`
  : undefined;

export const metadata: Metadata = {
  title: hub.espacoFernandes.seoTitle,
  description: hub.espacoFernandes.seoDescription,
  alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    title: hub.espacoFernandes.seoTitle,
    description: hub.espacoFernandes.seoDescription,
    url: canonicalUrl,
    images: [
      {
        url: hub.projects[1].logo?.src ?? hub.seo.favicon,
        width: 500,
        height: 500,
        alt: hub.projects[1].logo?.alt ?? "Espaço Fernandes",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: hub.espacoFernandes.seoTitle,
    description: hub.espacoFernandes.seoDescription,
    images: [hub.projects[1].logo?.src ?? hub.seo.favicon],
  },
};

export default function EspacoFernandesPage() {
  return <EspacoFernandesPlaceholder content={hub} />;
}
