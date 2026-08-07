import type { Metadata } from "next";
import { PropertyLandingPage } from "@/src/components/PropertyLandingPage";
import { property } from "@/src/content/property";
import { buildWhatsAppLink } from "@/src/lib/whatsapp";

export const metadata: Metadata = {
  title: property.seo.title,
  description: property.seo.description,
  keywords: property.seo.keywords,
  alternates: property.seo.canonicalUrl
    ? { canonical: property.seo.canonicalUrl }
    : undefined,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    title: property.seo.openGraph.title,
    description: property.seo.openGraph.description,
    url: property.seo.canonicalUrl ?? undefined,
    siteName: property.propertyName,
    images: [
      {
        url: property.seo.openGraph.image,
        width: 1536,
        height: 1024,
        alt: property.seo.openGraph.imageAlt,
      },
    ],
  },
  twitter: {
    card: property.seo.twitter.card,
    title: property.seo.twitter.title,
    description: property.seo.twitter.description,
    images: [property.seo.twitter.image],
  },
  robots: {
    index: property.seo.robots.index,
    follow: property.seo.robots.follow,
  },
};

export default function ChacaraAltoDosTorresPage() {
  const whatsappHref = buildWhatsAppLink(property.contact.whatsapp);
  const structuredData = property.seo.structuredData.enabled
    ? {
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        name: property.seo.title,
        description: property.seo.description,
        url: property.seo.canonicalUrl ?? undefined,
        about: {
          "@type": "Place",
          name: property.seo.structuredData.propertyType,
          description: property.shortDescription,
        },
      }
    : null;

  return (
    <>
      {structuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
      ) : null}
      <PropertyLandingPage content={property} whatsappHref={whatsappHref} />
    </>
  );
}
