import type { ReactNode } from "react";
import {
  Armchair,
  ArrowDown,
  ArrowUp,
  Car,
  Check,
  CircleAlert,
  CloudRain,
  Clock3,
  CookingPot,
  Droplets,
  House,
  Info,
  LandPlot,
  Leaf,
  Mail,
  MapPinned,
  MessageCircle,
  Route,
  Rows3,
  Ruler,
  ShieldCheck,
  Sprout,
  Truck,
  UserRound,
  Wheat,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type {
  HighlightIcon,
  PropertyContent,
  PropertyVideo,
  PropertyStatus,
  StatusContent,
} from "@/src/content/property";
import { PropertyVideoPlayer } from "@/src/components/PropertyVideoPlayer";
import { SiteImage } from "@/src/components/SiteImage";

const iconByName: Record<HighlightIcon, LucideIcon> = {
  sprout: Sprout,
  "land-plot": LandPlot,
  house: House,
  rows: Rows3,
  leaf: Leaf,
  route: Route,
  armchair: Armchair,
  "cooking-pot": CookingPot,
  droplets: Droplets,
  "cloud-rain": CloudRain,
  zap: Zap,
};

const detailIcons: Record<string, LucideIcon> = {
  terrain: LandPlot,
  soil: Sprout,
  fences: ShieldCheck,
  water: Droplets,
  energy: Zap,
  internet: Info,
  carAccess: Car,
  truckAccess: Truck,
  distanceToCity: MapPinned,
  distanceToPavement: Route,
  internalRoads: Route,
  vegetation: Leaf,
  preservationAreas: ShieldCheck,
  other: Info,
};

interface HeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  inverse?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  inverse = false,
}: HeadingProps) {
  const alignment = align === "center" ? "mx-auto text-center" : "";

  return (
    <div className={`max-w-3xl ${alignment}`}>
      <p className={`section-kicker ${inverse ? "!text-[#ff9a4d]" : ""}`}>
        {eyebrow}
      </p>
      <h2 className={`section-title ${inverse ? "!text-white" : ""}`}>{title}</h2>
      {description ? (
        <p className={`body-large mt-5 ${inverse ? "!text-white/72" : ""}`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

function PlaceholderBadge() {
  return (
    <span className="temporary-badge">
      <CircleAlert aria-hidden="true" size={14} strokeWidth={2.2} />
      Imagem temporária
    </span>
  );
}

interface HeroSectionProps {
  content: PropertyContent["hero"];
  mainVideo: PropertyVideo | null;
  status: PropertyStatus;
  statusContent: StatusContent;
  contactAction: ReactNode;
}

export function HeroSection({
  content,
  mainVideo,
  status,
  statusContent,
  contactAction,
}: HeroSectionProps) {
  return (
    <section className="grain relative overflow-hidden bg-[#f7f2e8] pb-16 pt-8 md:pb-24 md:pt-14">
      <div
        className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-[#f47f20]/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="site-container relative grid items-center gap-10 lg:grid-cols-[minmax(0,1.12fr)_minmax(18rem,0.88fr)] lg:gap-14">
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold tracking-[0.06em] uppercase ${
                status === "available"
                  ? "border-[#315f40]/15 bg-white/70 text-[#315f40]"
                  : "border-[#a96531]/15 bg-white/70 text-[#8a471d]"
              }`}
            >
              <span
                aria-hidden="true"
                className={`size-1.5 rounded-full ${
                  status === "available" ? "bg-[#5f7f49]" : "bg-[#c86d32]"
                }`}
              />
              {statusContent.label}
            </span>
          </div>
          <h1 className="display-title max-w-3xl">{content.title}</h1>
          <p className="mt-5 max-w-2xl text-[clamp(1.15rem,2.2vw,1.55rem)] leading-[1.4] font-semibold text-[#315f40]">
            {content.supportingText}
          </p>
          <p className="body-large mt-4 max-w-2xl">{content.subtitle}</p>

          {statusContent.message ? (
            <p className="mt-5 inline-flex items-start gap-2 rounded-xl border border-[#a96531]/20 bg-[#f0dfcc]/65 px-4 py-3 text-sm font-bold text-[#6b4024]">
              <Info aria-hidden="true" className="mt-0.5 shrink-0" size={18} />
              {statusContent.message}
            </p>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            {contactAction}
            <a className="button-secondary" href={content.secondaryActionTarget}>
              {content.secondaryActionLabel}
              <ArrowDown aria-hidden="true" size={18} />
            </a>
          </div>

          {content.detailsNotice ? (
            <p className="mt-5 max-w-2xl text-sm leading-6 text-[#60675e]">
              {content.detailsNotice}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col items-center lg:justify-self-center">
          {mainVideo ? (
            <PropertyVideoPlayer
              analyticsOrigin="hero-video"
              className="w-full max-w-[19rem] border border-[#0d293c]/10 shadow-[0_24px_70px_rgba(13,41,60,0.2)] sm:max-w-[21rem] lg:max-w-[22rem]"
              playLabel={content.videoPlayLabel}
              priority
              sizes="(max-width: 639px) 304px, (max-width: 1023px) 336px, 352px"
              video={mainVideo}
            />
          ) : (
            <figure className="image-frame aspect-[4/3] w-full max-w-xl bg-[#0d293c]">
              <SiteImage
                alt={content.mainImage.alt}
                className={
                  content.mainImage.fit === "contain"
                    ? "object-contain p-4 sm:p-7"
                    : "object-cover"
                }
                fill
                fallbackSrc={content.mainImage.fallbackSrc}
                priority
                sizes="(max-width: 1023px) 100vw, 40vw"
                src={content.mainImage.src}
              />
              {content.mainImage.caption ? (
                <figcaption className="absolute inset-x-4 bottom-4 rounded-xl bg-[#10301f]/86 px-4 py-3 text-sm font-semibold text-white backdrop-blur-md">
                  {content.mainImage.caption}
                </figcaption>
              ) : null}
            </figure>
          )}

          {content.quickFacts.length > 0 ? (
            <ul className="relative z-10 mt-5 grid w-full max-w-[36rem] gap-px overflow-hidden rounded-2xl border border-[#173f2b]/10 bg-[#173f2b]/10 shadow-[0_18px_50px_rgba(23,63,43,0.13)] sm:grid-cols-2">
              {content.quickFacts.map((fact) => (
                <li
                  key={fact}
                  className="flex min-h-20 items-center gap-3 bg-white px-4 py-3 text-sm font-bold text-[#0d293c] last:sm:col-span-2"
                >
                  <Check aria-hidden="true" className="shrink-0 text-[#f47f20]" size={18} />
                  {fact}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}

interface OverviewSectionProps {
  overview: PropertyContent["overview"];
  highlights: PropertyContent["highlights"];
  showHighlights: boolean;
}

export function OverviewSection({
  overview,
  highlights,
  showHighlights,
}: OverviewSectionProps) {
  const visibleHighlights = highlights.items.filter((item) => item.visible);

  return (
    <section id={overview.id} className="section-space bg-white">
      <div className="site-container">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
          <SectionHeading eyebrow={overview.eyebrow} title={overview.title} />
          <div className="space-y-5 text-lg leading-8 text-[#4f584e]">
            {overview.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        {showHighlights && visibleHighlights.length > 0 ? (
          <ul className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleHighlights.map((item) => {
              const Icon = iconByName[item.icon];
              return (
                <li key={item.title} className="card-surface p-6">
                  <span className="mb-5 grid size-11 place-items-center rounded-xl bg-[#fff0e4] text-[#e66f12]">
                    <Icon aria-hidden="true" size={23} strokeWidth={1.8} />
                  </span>
                  <h3 className="text-lg font-extrabold text-[#0d293c]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#60675e]">{item.description}</p>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

interface CropsSectionProps {
  content: PropertyContent["crops"];
}

export function CropsSection({ content }: CropsSectionProps) {
  const items = content.items.filter((item) => item.visible);

  if (items.length === 0) return null;

  return (
    <section id={content.id} className="section-space bg-[#f5f1e8]">
      <div className="site-container">
        <SectionHeading
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.introduction}
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {items.map((crop) => {
            const details = [
              crop.quantity
                ? {
                    label: content.fieldLabels.quantity,
                    value: `${crop.quantity}${crop.unit ? ` ${crop.unit}` : ""}`,
                  }
                : null,
              crop.productionStage
                ? { label: content.fieldLabels.productionStage, value: crop.productionStage }
                : null,
              crop.harvestInfo
                ? { label: content.fieldLabels.harvest, value: crop.harvestInfo }
                : null,
            ].filter((detail): detail is { label: string; value: string } => Boolean(detail));

            return (
              <article key={crop.id} className="card-surface overflow-hidden bg-white">
                {crop.image ? (
                  <figure className="relative aspect-[4/3] overflow-hidden bg-[#e9e2d4]">
                    <SiteImage
                      src={crop.image.src}
                      alt={crop.image.alt}
                      fill
                      fallbackSrc={crop.image.fallbackSrc}
                      sizes="(max-width: 1023px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 hover:scale-[1.02]"
                    />
                  </figure>
                ) : (
                  <div
                    aria-hidden="true"
                    className="grid aspect-[4/3] place-items-center bg-[#e7eadf] text-[#315f40]"
                  >
                    <span className="grid size-20 place-items-center rounded-full border border-[#315f40]/15 bg-white/55">
                      <Wheat size={36} strokeWidth={1.5} />
                    </span>
                  </div>
                )}
                <div className="p-6 md:p-7">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-full bg-[#fff0e4] text-[#e66f12]">
                      <Wheat aria-hidden="true" size={20} />
                    </span>
                    <h3 className="font-serif text-3xl font-semibold tracking-[-0.03em] text-[#0d293c]">
                      {crop.name}
                    </h3>
                  </div>
                  <p className="leading-7 text-[#60675e]">{crop.description}</p>
                  {details.length > 0 ? (
                    <dl className="mt-6 space-y-3 border-t border-[#d7d0c2] pt-5">
                      {details.map((detail) => (
                        <div key={detail.label}>
                          <dt className="text-xs font-extrabold tracking-[0.08em] text-[#7d4927] uppercase">
                            {detail.label}
                          </dt>
                          <dd className="mt-1 font-semibold text-[#242822]">{detail.value}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
        {content.cultures.length > 0 ? (
          <div className="mt-10 rounded-3xl border border-[#0d293c]/10 bg-white p-6 shadow-sm md:p-8">
            <h3 className="font-serif text-2xl font-semibold tracking-[-0.025em] text-[#0d293c]">
              {content.culturesTitle}
            </h3>
            <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {content.cultures.map((culture) => (
                <li
                  className="flex min-h-11 items-center gap-2 rounded-xl bg-[#f7f2e8] px-3 py-2 text-sm font-bold text-[#284b37]"
                  key={culture}
                >
                  <Leaf aria-hidden="true" className="shrink-0 text-[#f47f20]" size={16} />
                  {culture}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}

interface ProductivePotentialSectionProps {
  content: PropertyContent["productivePotential"];
}

export function ProductivePotentialSection({
  content,
}: ProductivePotentialSectionProps) {
  const items = content.items.filter((item) => item.visible);
  if (items.length === 0) return null;

  return (
    <section id={content.id} className="section-space relative overflow-hidden bg-[#0d293c] text-white">
      <div className="pointer-events-none absolute -right-24 -top-32 size-[28rem] rounded-full border-[80px] border-white/[0.025]" />
      <div className="site-container relative">
        <SectionHeading
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.description}
          inverse
        />
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 lg:grid-cols-3">
          {items.map((item, index) => {
            const Icon = iconByName[item.icon];
            return (
              <article key={item.title} className="bg-[#0d293c] p-7 md:p-9">
                <div className="mb-8 flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-xl bg-white/10 text-[#ff9a4d]">
                    <Icon aria-hidden="true" size={24} strokeWidth={1.8} />
                  </span>
                  <span className="font-serif text-4xl text-white/16">0{index + 1}</span>
                </div>
                <h3 className="font-serif text-2xl font-semibold tracking-[-0.025em]">
                  {item.title}
                </h3>
                <p className="mt-3 leading-7 text-white/68">{item.description}</p>
              </article>
            );
          })}
        </div>
        <p className="mt-7 flex max-w-3xl items-start gap-3 text-sm leading-6 text-white/62">
          <ShieldCheck aria-hidden="true" className="mt-0.5 shrink-0 text-[#ff9a4d]" size={19} />
          {content.disclaimer}
        </p>
      </div>
    </section>
  );
}

interface InfrastructureSectionProps {
  content: PropertyContent["infrastructure"];
}

export function InfrastructureSection({ content }: InfrastructureSectionProps) {
  const items = content.items.filter((item) => item.visible);
  if (items.length === 0) return null;

  return (
    <section id={content.id} className="section-space bg-white">
      <div className="site-container">
        <SectionHeading
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.description}
        />
        <ul className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {items.map((item) => {
            const Icon = iconByName[item.icon];
            return (
              <li
                className="rounded-2xl border border-[#0d293c]/10 bg-[#f7f2e8] p-6"
                key={item.title}
              >
                <span className="grid size-11 place-items-center rounded-xl bg-[#0d293c] text-[#ff9a4d]">
                  <Icon aria-hidden="true" size={22} strokeWidth={1.8} />
                </span>
                <h3 className="mt-5 text-lg font-extrabold leading-6 text-[#0d293c]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#59645c]">{item.description}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

interface PropertyDetailsSectionProps {
  content: PropertyContent["propertyDetails"];
  area: PropertyContent["area"];
}

export function PropertyDetailsSection({
  content,
  area,
}: PropertyDetailsSectionProps) {
  const areaItems = [area.total, area.planted, area.free]
    .filter((item) => item.value || item.showWhenUnknown)
    .map((item) => ({
      label: item.label,
      value: item.value
        ? `${item.value}${item.unit ? ` ${item.unit}` : ""}`
        : content.unknownValueLabel,
      Icon: Ruler,
    }));

  const detailItems = content.items
    .filter((item) => item.visible && (item.value || item.showWhenUnknown))
    .map((item) => ({
      label: item.label,
      value: item.value ?? content.unknownValueLabel,
      Icon: detailIcons[item.key] ?? Info,
    }));

  const items = [...areaItems, ...detailItems];
  if (items.length === 0) return null;

  return (
    <section id={content.id} className="section-space bg-white">
      <div className="site-container">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
          <SectionHeading eyebrow={content.eyebrow} title={content.title} />
          <dl className="grid gap-3 sm:grid-cols-2">
            {items.map(({ label, value, Icon }) => (
              <div key={label} className="rounded-2xl border border-[#173f2b]/10 bg-[#f8f5ee] p-5">
                <dt className="flex items-center gap-3 text-sm font-extrabold text-[#173f2b]">
                  <span className="grid size-9 place-items-center rounded-lg bg-white text-[#a96531] shadow-sm">
                    <Icon aria-hidden="true" size={18} strokeWidth={2} />
                  </span>
                  {label}
                </dt>
                <dd className="mt-3 pl-12 text-sm leading-6 text-[#60675e]">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

interface SupportHouseSectionProps {
  content: PropertyContent["supportHouse"];
}

export function SupportHouseSection({ content }: SupportHouseSectionProps) {
  const photo = content.photos[0];
  const features = content.features.filter((item) => item.visible);
  const details = (Object.entries(content.details) as [
    keyof typeof content.details,
    string | boolean | null,
  ][]).filter(([, value]) => value !== null && value !== "");

  return (
    <section id={content.id} className="section-space bg-[#f5f1e8]">
      <div className="site-container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {photo ? (
          <figure className="image-frame aspect-[4/3]">
            <SiteImage
              src={photo.src}
              alt={photo.alt}
              fill
              fallbackSrc={photo.fallbackSrc}
              sizes="(max-width: 1023px) 100vw, 50vw"
              className="object-cover"
            />
          </figure>
        ) : null}
        <div>
          <SectionHeading eyebrow={content.eyebrow} title={content.title} />
          <div className="mt-6 space-y-4 text-lg leading-8 text-[#566055]">
            {content.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {features.length > 0 ? (
            <ul className="mt-7 space-y-3">
              {features.map((item) => {
                const Icon = iconByName[item.icon];
                return (
                  <li
                    className="flex gap-4 rounded-2xl border border-[#0d293c]/10 bg-white/80 p-4"
                    key={item.title}
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#fff0e4] text-[#e66f12]">
                      <Icon aria-hidden="true" size={20} />
                    </span>
                    <div>
                      <h3 className="font-extrabold text-[#0d293c]">{item.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-[#59645c]">{item.description}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : null}
          {details.length > 0 ? (
            <dl className="mt-7 grid gap-3 sm:grid-cols-2">
              {details.map(([key, value]) => (
                <div key={key} className="rounded-xl border border-[#173f2b]/10 bg-white/70 p-4">
                  <dt className="text-xs font-extrabold tracking-[0.08em] text-[#7d4927] uppercase">
                    {content.labels[key]}
                  </dt>
                  <dd className="mt-1 font-semibold text-[#242822]">
                    {typeof value === "boolean" ? (value ? "Sim" : "Não") : value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </div>
    </section>
  );
}

interface LocationSectionProps {
  content: PropertyContent["location"];
}

export function LocationSection({ content }: LocationSectionProps) {
  const fields = [
    [content.labels.city, content.city],
    [content.labels.state, content.state],
    [content.labels.region, content.region],
    [content.labels.community, content.community],
    [content.labels.distanceToCenter, content.distanceToCenter],
    [content.labels.estimatedTravelTime, content.estimatedTravelTime],
    [content.labels.pavedRoadDistance, content.pavedRoadDistance],
    [content.labels.dirtRoadDistance, content.dirtRoadDistance],
    [content.labels.accessCondition, content.accessCondition],
    [content.labels.entranceType, content.entranceType],
  ].filter((field): field is [string, string] => Boolean(field[1]));

  return (
    <section id={content.id} className="section-space bg-white">
      <div className="site-container">
        <SectionHeading
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.introduction}
        />
        <p className="mt-6 flex max-w-3xl items-start gap-3 rounded-2xl border border-[#a96531]/18 bg-[#f5f1e8] p-5 text-sm leading-6 text-[#665b4f]">
          <MapPinned aria-hidden="true" className="mt-0.5 shrink-0 text-[#a96531]" size={21} />
          {content.note}
        </p>

        <div className="mt-10 grid items-stretch gap-7 lg:grid-cols-[1.12fr_0.88fr] lg:gap-10">
          <figure className="image-frame aspect-[4/3] min-h-0 bg-[#0d293c]">
            <SiteImage
              alt={content.image.alt}
              className={content.image.fit === "contain" ? "object-contain" : "object-cover"}
              fill
              fallbackSrc={content.image.fallbackSrc}
              sizes="(max-width: 1023px) 100vw, 56vw"
              src={content.image.src}
            />
            {content.image.caption ? (
              <figcaption className="absolute inset-x-4 bottom-4 rounded-xl bg-[#0d293c]/88 px-4 py-3 text-sm font-semibold text-white backdrop-blur-md">
                {content.image.caption}
              </figcaption>
            ) : null}
          </figure>

          <div className="relative overflow-hidden rounded-3xl bg-[#0d293c] p-7 text-white shadow-[0_24px_70px_rgba(13,41,60,0.18)] md:p-9">
            <div className="absolute -bottom-20 -right-16 size-64 rounded-full border-[45px] border-white/5" />
            <span className="grid size-14 place-items-center rounded-2xl bg-white/10 text-[#ff9a4d]">
              <Route aria-hidden="true" size={28} />
            </span>
            {content.approximateLocation ? (
              <p className="mt-6 font-serif text-3xl font-semibold">{content.approximateLocation}</p>
            ) : (
              <p className="mt-6 font-serif text-3xl font-semibold">{content.title}</p>
            )}
            {fields.length > 0 ? (
              <dl className="relative mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {fields.map(([label, value]) => (
                  <div key={label} className="border-t border-white/15 pt-4">
                    <dt className="text-xs font-bold tracking-[0.08em] text-white/55 uppercase">
                      {label}
                    </dt>
                    <dd className="mt-1 font-semibold text-white/90">{value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="relative mt-4 max-w-md text-white/65">{content.introduction}</p>
            )}
            {content.showMap && content.mapUrl ? (
              <a
                className="button-secondary relative mt-7 !border-white/25 !bg-white/10 !text-white hover:!bg-white/15"
                href={content.mapUrl}
                target="_blank"
                rel="noreferrer"
              >
                <MapPinned aria-hidden="true" size={18} />
                {content.title}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

interface OwnerContactSectionProps {
  content: PropertyContent["contact"];
  negotiation: PropertyContent["negotiation"];
  statusContent: StatusContent;
  contactAction: ReactNode;
}

export function OwnerContactSection({
  content,
  negotiation,
  statusContent,
  contactAction,
}: OwnerContactSectionProps) {
  const visiblePrice =
    negotiation.price.showPrice && negotiation.price.amount
      ? new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: negotiation.price.currency,
          maximumFractionDigits: 0,
        }).format(negotiation.price.amount)
      : null;

  return (
    <section id={content.id} className="section-space bg-white">
      <div className="site-container overflow-hidden rounded-[2rem] border border-[#173f2b]/10 bg-[#f5f1e8] shadow-[0_24px_70px_rgba(23,63,43,0.1)]">
        <div className="grid lg:grid-cols-[0.78fr_1.22fr]">
          <div className="relative flex min-h-72 items-center justify-center overflow-hidden bg-[#0d293c] p-6 text-white sm:p-8 md:p-10">
            <div className="absolute -bottom-24 -left-20 size-72 rounded-full border-[55px] border-white/5" />
            <div className="relative text-center">
              {content.ownerImage ? (
                <div className="relative mx-auto aspect-[4/3] w-[17.5rem] max-w-full overflow-hidden rounded-[1.5rem] border border-white/15 bg-white/5 shadow-[0_18px_45px_rgba(0,0,0,0.22)]">
                  <SiteImage
                    alt={content.ownerImage.alt}
                    className="object-contain object-bottom"
                    fill
                    fallbackSrc={content.ownerImage.fallbackSrc}
                    sizes="280px"
                    src={content.ownerImage.src}
                  />
                </div>
              ) : (
                <span className="mx-auto grid size-20 place-items-center rounded-full border border-white/15 bg-white/10 text-[#ff9a4d]">
                  <UserRound aria-hidden="true" size={35} strokeWidth={1.6} />
                </span>
              )}
              <p className="mt-5 text-sm font-extrabold tracking-[0.12em] text-white/60 uppercase">
                {content.directContactLabel}
              </p>
              {content.ownerName ? (
                <p className="mt-2 font-serif text-3xl font-semibold">{content.ownerName}</p>
              ) : null}
            </div>
          </div>
          <div className="p-7 md:p-12">
            <SectionHeading eyebrow={content.eyebrow} title={content.title} />
            <p className="body-large mt-5 max-w-2xl">{content.description}</p>
            {visiblePrice ? (
              <p className="mt-6 font-serif text-3xl font-semibold text-[#173f2b]">
                {negotiation.labels.price}: {visiblePrice}
              </p>
            ) : null}
            {content.supportItems.length > 0 ? (
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {content.supportItems.map((item) => (
                  <li
                    className="flex min-h-14 items-center gap-3 rounded-xl border border-[#173f2b]/10 bg-white px-4 py-3 text-sm font-bold text-[#364239]"
                    key={item}
                  >
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#f47f20]/12 text-[#9a5227]">
                      <Check aria-hidden="true" size={16} strokeWidth={2.5} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
            {content.bestContactTime ? (
              <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#60675e]">
                <Clock3 aria-hidden="true" size={18} className="text-[#a96531]" />
                {content.bestContactTimeLabel}: {content.bestContactTime}
              </p>
            ) : null}
            {content.email ? (
              <a
                className="mt-6 inline-flex max-w-full items-center gap-3 rounded-xl border border-[#173f2b]/10 bg-white px-4 py-3 text-[#0d293c] shadow-[0_8px_24px_rgba(23,63,43,0.06)] transition-colors hover:border-[#f47f20]/35 hover:text-[#8f4816]"
                href={`mailto:${content.email}`}
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#f47f20]/12 text-[#9a5227]">
                  <Mail aria-hidden="true" size={18} strokeWidth={2.2} />
                </span>
                <span className="min-w-0 text-left">
                  <span className="block text-xs font-extrabold tracking-[0.08em] text-[#60675e] uppercase">
                    {content.emailLabel}
                  </span>
                  <span className="block break-all font-bold">{content.email}</span>
                </span>
              </a>
            ) : null}
            {statusContent.message ? (
              <p className="mt-5 text-sm font-bold text-[#7d4927]">{statusContent.message}</p>
            ) : null}
            <div className="mt-7">{contactAction}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface FinalCTASectionProps {
  content: PropertyContent["finalCta"];
  statusContent: StatusContent;
  contactAction: ReactNode;
}

export function FinalCTASection({
  content,
  statusContent,
  contactAction,
}: FinalCTASectionProps) {
  return (
    <section id={content.id} className="relative isolate overflow-hidden bg-[#0d293c] py-24 text-white md:py-32">
      <SiteImage
        src={content.backgroundImage.src}
        alt=""
        fill
        fallbackSrc={content.backgroundImage.fallbackSrc}
        sizes="100vw"
        className="-z-20 object-cover opacity-35"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(13,41,60,.98)_0%,rgba(13,41,60,.88)_55%,rgba(13,41,60,.72)_100%)]" />
      {content.backgroundImage.isPlaceholder ? <PlaceholderBadge /> : null}
      <div className="site-container">
        <div className="max-w-3xl">
          <MessageCircle aria-hidden="true" className="mb-6 text-[#ff9a4d]" size={36} strokeWidth={1.7} />
          <h2 className="font-serif text-[clamp(2.4rem,6vw,4.6rem)] leading-[1.02] font-semibold tracking-[-0.045em]">
            {content.title}
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">{content.description}</p>
          {statusContent.contactReplacement ? (
            <p className="mt-6 font-bold text-[#e2c09e]">{statusContent.contactReplacement}</p>
          ) : null}
          <div className="mt-8">{contactAction}</div>
          <p className="mt-5 text-sm font-bold tracking-[0.08em] text-white/55 uppercase">
            {content.directSaleLabel}
          </p>
        </div>
      </div>
    </section>
  );
}

interface FooterProps {
  propertyName: string;
  brandLogo: PropertyContent["brand"]["logo"];
  content: PropertyContent["footer"];
  location: PropertyContent["location"];
  whatsappHref: string | null;
  status: PropertyStatus;
  contactUnavailableLabel: string;
}

export function Footer({
  propertyName,
  brandLogo,
  content,
  location,
  whatsappHref,
  status,
  contactUnavailableLabel,
}: FooterProps) {
  const locationLabel =
    [location.city, location.state].filter(Boolean).join(" — ") ||
    location.approximateLocation;
  const canContact = Boolean(whatsappHref) && status === "available";

  return (
    <footer className="bg-[#081f30] pb-28 pt-14 text-white md:pb-10">
      <div className="site-container">
        <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-[1.15fr_0.85fr] md:items-end">
          <div>
            <div className="mb-6 w-full max-w-[16rem] overflow-hidden rounded-2xl border border-white/10 bg-[#0d293c] p-2">
              <SiteImage
                alt={brandLogo.alt}
                className="h-auto w-full object-contain"
                height={640}
                src={brandLogo.src}
                width={640}
              />
            </div>
            <p className="font-serif text-3xl font-semibold">{propertyName}</p>
            <p className="mt-2 text-sm font-bold tracking-[0.08em] text-white/48 uppercase">
              {content.propertyTypeLabel}
            </p>
            <p className="mt-5 text-sm text-white/58">
              {locationLabel || content.locationFallback}
            </p>
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            {canContact && whatsappHref ? (
              <a className="inline-flex items-center gap-2 font-bold text-[#e2c09e] underline-offset-4 hover:underline" data-analytics-event="whatsapp_click" data-analytics-origin="rodape" href={whatsappHref} target="_blank" rel="noreferrer">
                <MessageCircle aria-hidden="true" size={18} />
                {content.whatsappLabel}
              </a>
            ) : (
              <span className="text-sm text-white/45">{contactUnavailableLabel}</span>
            )}
            <a className="inline-flex items-center gap-2 text-sm font-bold text-white/65 underline-offset-4 hover:text-white hover:underline" href="#inicio">
              <ArrowUp aria-hidden="true" size={17} />
              {content.backToTopLabel}
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-3 pt-6 text-xs leading-5 text-white/42 md:flex-row md:items-center md:justify-between">
          <p>{content.updateNotice}</p>
          <p>© {new Date().getFullYear()} {propertyName}</p>
        </div>
      </div>
    </footer>
  );
}
