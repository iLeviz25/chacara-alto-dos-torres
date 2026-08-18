import type { Metadata } from "next";
import { EspacoFernandesLandingPage } from "@/src/components/EspacoFernandesLandingPage";
import { getPublishedSiteContent } from "@/src/lib/content/site-content";
import { getPublishedSiteTheme } from "@/src/lib/theme/published-theme";

export async function generateMetadata(): Promise<Metadata> {
  const espacoFernandes = await getPublishedSiteContent("espaco-fernandes");

  return {
    title: espacoFernandes.seo.title,
    description: espacoFernandes.seo.description,
    alternates: { canonical: espacoFernandes.seo.canonicalUrl },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      title: espacoFernandes.seo.title,
      description: espacoFernandes.seo.description,
      url: espacoFernandes.seo.canonicalUrl,
      siteName: espacoFernandes.brand.name,
      images: [
        {
          url: espacoFernandes.seo.openGraphImage.src,
          width: espacoFernandes.seo.openGraphImage.width,
          height: espacoFernandes.seo.openGraphImage.height,
          alt: espacoFernandes.seo.openGraphImage.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: espacoFernandes.seo.title,
      description: espacoFernandes.seo.description,
      images: [espacoFernandes.seo.openGraphImage.src],
    },
  };
}

export default async function EspacoFernandesPage() {
  const [espacoFernandes, theme] = await Promise.all([
    getPublishedSiteContent("espaco-fernandes"),
    getPublishedSiteTheme("espaco-fernandes"),
  ]);
  const siteBase = new URL(espacoFernandes.seo.canonicalUrl).origin;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: espacoFernandes.brand.name,
    description: espacoFernandes.seo.description,
    url: espacoFernandes.seo.canonicalUrl,
    image: `${siteBase}${espacoFernandes.seo.openGraphImage.src}`,
    telephone: "+5574988700524",
    email: espacoFernandes.contact.email.address,
    sameAs: [espacoFernandes.contact.instagram.url],
    address: {
      "@type": "PostalAddress",
      name: espacoFernandes.location.addressLines[0],
      streetAddress: espacoFernandes.location.addressLines[1],
      addressLocality: "Formosa, Uibaí",
      addressRegion: "BA",
      addressCountry: "BR",
    },
    amenityFeature: espacoFernandes.structure.amenities
      .filter((amenity) => amenity.visible !== false)
      .map((amenity) => ({
        "@type": "LocationFeatureSpecification",
        name: amenity.title,
        value: true,
      })),
  };

  return (
    <>
      <EspacoFernandesLandingPage content={espacoFernandes} theme={theme} />
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        type="application/ld+json"
      />
    </>
  );
}
