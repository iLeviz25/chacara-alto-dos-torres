import type { PropertyContent } from "@/src/content/property";
import { FAQSection } from "@/src/components/FAQSection";
import { GallerySection } from "@/src/components/GallerySection";
import { Header } from "@/src/components/Header";
import {
  CropsSection,
  FinalCTASection,
  Footer,
  HeroSection,
  InfrastructureSection,
  LocationSection,
  OverviewSection,
  OwnerContactSection,
  ProductivePotentialSection,
  PropertyDetailsSection,
  SupportHouseSection,
} from "@/src/components/StaticSections";
import { VideoSection } from "@/src/components/VideoSection";
import { WhatsAppButton } from "@/src/components/WhatsAppButton";
import { AnalyticsTracker } from "@/src/components/AnalyticsTracker";

interface PropertyLandingPageProps {
  content: PropertyContent;
  whatsappHref: string | null;
}

export function PropertyLandingPage({
  content,
  whatsappHref,
}: PropertyLandingPageProps) {
  const statusContent = content.statusContent[content.status];
  const visibleCrops = content.crops.items.some((item) => item.visible);
  const visiblePotential = content.productivePotential.items.some((item) => item.visible);
  const visibleInfrastructure = content.infrastructure.items.some((item) => item.visible);
  const visibleGallery = content.gallery.items.some((item) => item.visible);
  const mainVideo =
    content.videos.items.find((item) => item.visible && item.role === "main") ?? null;
  const visibleVideos = content.videos.items.some(
    (item) => item.visible && item.role === "short",
  );
  const visibleFaq = content.faq.items.some((item) => item.visible);
  const visibleSectionIds = new Set<string>();

  if (content.sections.overview) visibleSectionIds.add(content.overview.id);
  if (content.sections.crops && visibleCrops) visibleSectionIds.add(content.crops.id);
  if (content.sections.productivePotential && visiblePotential) {
    visibleSectionIds.add(content.productivePotential.id);
  }
  if (content.sections.infrastructure && visibleInfrastructure) {
    visibleSectionIds.add(content.infrastructure.id);
  }
  if (content.sections.propertyDetails) visibleSectionIds.add(content.propertyDetails.id);
  if (content.sections.gallery && visibleGallery) visibleSectionIds.add(content.gallery.id);
  if (content.sections.videos && visibleVideos) visibleSectionIds.add(content.videos.id);
  if (content.sections.supportHouse) visibleSectionIds.add(content.supportHouse.id);
  if (content.sections.location) visibleSectionIds.add(content.location.id);
  if (content.sections.contact) visibleSectionIds.add(content.contact.id);
  if (content.sections.faq && visibleFaq) visibleSectionIds.add(content.faq.id);
  if (content.sections.finalCta) visibleSectionIds.add(content.finalCta.id);

  const headerContent = {
    ...content.header,
    navigation: content.header.navigation.filter((item) =>
      visibleSectionIds.has(item.href.replace(/^#/, "")),
    ),
  };

  const contactButton = (
    label: string,
    origin: string,
    variant: "primary" | "secondary" = "primary",
  ) => (
    <WhatsAppButton
      analyticsOrigin={origin}
      href={whatsappHref}
      label={label}
      status={content.status}
      statusContent={statusContent}
      unavailableLabel={content.contact.unavailableButtonLabel}
      variant={variant}
    />
  );

  return (
    <div id="inicio">
      <AnalyticsTracker site="chacara-alto-dos-torres" />
      <a className="skip-link" href="#conteudo-principal">
        Ir para o conteúdo principal
      </a>
      <Header
        propertyName={content.propertyName}
        content={headerContent}
        status={content.status}
        statusContent={statusContent}
        whatsappHref={whatsappHref}
        unavailableContactLabel={content.contact.unavailableButtonLabel}
      />

      <main id="conteudo-principal">
        <HeroSection
          content={content.hero}
          mainVideo={mainVideo}
          status={content.status}
          statusContent={statusContent}
          contactAction={contactButton(content.hero.primaryActionLabel, "hero")}
        />

        {content.sections.propertyDetails ? (
          <PropertyDetailsSection content={content.propertyDetails} area={content.area} />
        ) : null}

        {content.sections.gallery && visibleGallery ? (
          <GallerySection content={content.gallery} />
        ) : null}

        {content.sections.overview ? (
          <OverviewSection
            overview={content.overview}
            highlights={content.highlights}
            showHighlights={content.sections.highlights}
          />
        ) : null}

        {content.sections.supportHouse ? (
          <SupportHouseSection content={content.supportHouse} />
        ) : null}

        {content.sections.infrastructure && visibleInfrastructure ? (
          <InfrastructureSection content={content.infrastructure} />
        ) : null}

        {content.sections.crops && visibleCrops ? (
          <CropsSection content={content.crops} />
        ) : null}

        {content.sections.productivePotential && visiblePotential ? (
          <ProductivePotentialSection content={content.productivePotential} />
        ) : null}

        {content.sections.videos && visibleVideos ? (
          <VideoSection content={content.videos} />
        ) : null}

        {content.sections.location ? (
          <LocationSection content={content.location} />
        ) : null}

        {content.sections.contact ? (
          <OwnerContactSection
            content={content.contact}
            statusContent={statusContent}
            contactAction={contactButton(content.contact.buttonLabel, "contato")}
          />
        ) : null}

        {content.sections.faq && visibleFaq ? <FAQSection content={content.faq} /> : null}

        {content.sections.finalCta ? (
          <FinalCTASection
            content={content.finalCta}
            statusContent={statusContent}
            contactAction={contactButton(
              content.finalCta.buttonLabel,
              "cta-final",
              "secondary",
            )}
          />
        ) : null}
      </main>

      <Footer
        brandLogo={content.brand.logo}
        propertyName={content.propertyName}
        content={content.footer}
        location={content.location}
        whatsappHref={whatsappHref}
        status={content.status}
        contactUnavailableLabel={content.contact.unavailableButtonLabel}
      />

      <WhatsAppButton
        analyticsOrigin="botao-flutuante"
        href={whatsappHref}
        label={content.contact.floatingButtonLabel}
        status={content.status}
        statusContent={statusContent}
        unavailableLabel={content.contact.unavailableButtonLabel}
        variant="floating"
      />
    </div>
  );
}
