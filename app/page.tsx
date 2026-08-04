import { PropertyLandingPage } from "@/src/components/PropertyLandingPage";
import { property } from "@/src/content/property";
import { buildWhatsAppLink } from "@/src/lib/whatsapp";

export default function Home() {
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
