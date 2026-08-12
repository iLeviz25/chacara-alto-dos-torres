import {
  ArrowLeft,
  CakeSlice,
  ChefHat,
  CircleDot,
  Dices,
  Flame,
  Handshake,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Snowflake,
  Sun,
  Tv,
  UsersRound,
  Waves,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { CopyAddressButton } from "@/src/components/CopyAddressButton";
import { EspacoFernandesFaq } from "@/src/components/EspacoFernandesFaq";
import { EspacoFernandesGallery } from "@/src/components/EspacoFernandesGallery";
import { EspacoFernandesHeader } from "@/src/components/EspacoFernandesHeader";
import { EspacoFernandesVideo } from "@/src/components/EspacoFernandesVideo";
import { AnalyticsTracker } from "@/src/components/AnalyticsTracker";
import { SiteImage } from "@/src/components/SiteImage";
import type { EspacoFernandesContent } from "@/src/content/espacoFernandes";
import { buildWhatsAppLink } from "@/src/lib/whatsapp";

interface EspacoFernandesLandingPageProps {
  content: EspacoFernandesContent;
}

const amenityIcons: Record<
  EspacoFernandesContent["structure"]["amenities"][number]["id"],
  LucideIcon
> = {
  piscina: Waves,
  "area-gourmet": ChefHat,
  churrasqueira: Flame,
  freezer: Snowflake,
  sinuca: CircleDot,
  jogos: Dices,
  tv: Tv,
  wifi: Wifi,
};

const occasionIcons: LucideIcon[] = [
  CakeSlice,
  UsersRound,
  Handshake,
  UsersRound,
  Sun,
];

function SectionIntro({
  eyebrow,
  title,
  description,
  light = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  light?: boolean;
}) {
  return (
    <div className="max-w-3xl">
      <p
        className={[
          "text-xs font-extrabold tracking-[0.18em] uppercase",
          light ? "text-[#f4a06b]" : "text-[#bd5717]",
        ].join(" ")}
      >
        {eyebrow}
      </p>
      <h2
        className={[
          "mt-4 font-serif text-[clamp(2.3rem,5vw,4.35rem)] leading-[1.01] font-semibold tracking-[-0.045em]",
          light ? "text-white" : "text-[#292928]",
        ].join(" ")}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={[
            "mt-5 max-w-2xl text-base leading-7 sm:text-lg sm:leading-8",
            light ? "text-white/62" : "text-[#646461]",
          ].join(" ")}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function EspacoFernandesLandingPage({
  content,
}: EspacoFernandesLandingPageProps) {
  const whatsappHref = buildWhatsAppLink(content.contact.whatsapp);
  const address = content.location.addressLines.join("\n");

  return (
    <div className="min-h-screen bg-[#f5f1ea] text-[#292928]">
      <AnalyticsTracker site="espaco-fernandes" />
      <a className="skip-link" href="#conteudo-espaco">
        Ir para o conteúdo
      </a>

      <EspacoFernandesHeader
        content={{
          brand: content.brand,
          navigation: content.navigation,
          hero: content.hero,
        }}
        whatsappHref={whatsappHref}
      />

      <main id="conteudo-espaco">
        <section
          className="relative isolate overflow-hidden bg-[#242423] px-4 py-14 text-white sm:px-6 sm:py-18 lg:min-h-[calc(100vh-4.5rem)] lg:py-20"
          id="inicio"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_12%_16%,rgba(243,144,79,0.2),transparent_28%),radial-gradient(circle_at_85%_75%,rgba(243,144,79,0.11),transparent_25%),linear-gradient(145deg,#30302f_0%,#242423_52%,#191918_100%)]"
          />
          <div
            aria-hidden="true"
            className="absolute -top-40 -right-28 size-[30rem] rounded-full border-[72px] border-[#f3904f]/5"
          />

          <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.68fr)] lg:gap-10 xl:gap-20">
            <div className="max-w-3xl">
              <div className="flex items-center gap-4">
                <SiteImage
                  alt={content.brand.logo.alt}
                  className="size-20 rounded-full border border-white/12 object-cover shadow-[0_16px_42px_rgba(0,0,0,0.3)] sm:size-24"
                  height={96}
                  priority
                  src={content.brand.logo.src}
                  width={96}
                />
                <p className="font-serif text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
                  {content.brand.name}
                </p>
              </div>

              <p className="mt-9 inline-flex rounded-full border border-[#f3904f]/35 bg-[#f3904f]/10 px-4 py-2 text-xs font-extrabold tracking-[0.12em] text-[#f7b285] uppercase sm:text-sm">
                {content.hero.identification}
              </p>
              <h1 className="mt-6 max-w-3xl font-serif text-[clamp(3.15rem,7.4vw,6.6rem)] leading-[0.91] font-semibold tracking-[-0.055em]">
                {content.hero.title}
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-white/68 sm:text-xl sm:leading-9">
                {content.hero.description}
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                {whatsappHref ? (
                  <a
                    className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-[#f3904f] px-6 py-3 text-sm font-extrabold text-[#242423] shadow-[0_16px_38px_rgba(0,0,0,0.25)] transition hover:-translate-y-0.5 hover:bg-[#ffa56d] motion-reduce:transform-none"
                    data-analytics-event="whatsapp_click"
                    data-analytics-origin="hero"
                    href={whatsappHref}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <MessageCircle aria-hidden="true" size={19} />
                    {content.hero.primaryButton}
                  </a>
                ) : null}
                <a
                  className="inline-flex min-h-13 items-center justify-center rounded-full border border-white/18 bg-white/5 px-6 py-3 text-sm font-extrabold text-white transition hover:border-white/36 hover:bg-white/9"
                  href={`#${content.about.id}`}
                >
                  {content.hero.secondaryButton}
                </a>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/10 pt-6 text-sm font-bold text-white/52">
                <span>Piscina</span>
                <span>Área gourmet</span>
                <span>Chalé</span>
                <span>Wi-Fi</span>
              </div>
            </div>

            <EspacoFernandesVideo video={content.hero.video} />
          </div>
        </section>

        <section className="py-20 sm:py-24 lg:py-28" id={content.about.id}>
          <div className="mx-auto grid max-w-7xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:px-8">
            <SectionIntro
              description={content.about.text}
              eyebrow={content.about.eyebrow}
              title={content.about.title}
            />
            <div className="rounded-[2rem] border border-black/8 bg-white p-6 shadow-[0_22px_65px_rgba(40,40,39,0.08)] sm:p-8">
              <p className="text-xs font-extrabold tracking-[0.17em] text-[#bd5717] uppercase">
                Ambiente familiar e privativo
              </p>
              <p className="mt-4 font-serif text-2xl leading-8 font-semibold text-[#30302f] sm:text-3xl sm:leading-10">
                Um lugar para reunir pessoas importantes e aproveitar o dia com tranquilidade.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#eee9e0] py-20 sm:py-24 lg:py-28" id={content.structure.id}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionIntro
              description={content.structure.description}
              eyebrow={content.structure.eyebrow}
              title={content.structure.title}
            />

            <div className="mt-10 grid gap-5 lg:grid-cols-[1.18fr_0.82fr]">
              <figure className="group relative min-h-[28rem] overflow-hidden rounded-[2rem] bg-[#242423] shadow-[0_24px_70px_rgba(40,40,39,0.15)] sm:min-h-[36rem]">
                <SiteImage
                  alt={content.structure.featuredImage.alt}
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  fill
                  fallbackSrc={content.structure.featuredImage.fallbackSrc}
                  sizes="(max-width: 1023px) 100vw, 60vw"
                  src={content.structure.featuredImage.src}
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/8 to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                  <span className="text-xs font-extrabold tracking-[0.16em] text-[#f6a875] uppercase">
                    Principal destaque
                  </span>
                  <span className="mt-2 block font-serif text-3xl font-semibold sm:text-4xl">
                    Piscina e área de convivência
                  </span>
                </figcaption>
              </figure>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {content.structure.amenities
                  .filter((amenity) => amenity.visible !== false)
                  .sort((first, second) => (first.order ?? 0) - (second.order ?? 0))
                  .map((amenity) => {
                  const Icon = amenityIcons[amenity.id];
                  return (
                    <article
                      className="rounded-3xl border border-black/8 bg-white p-5 shadow-[0_12px_36px_rgba(40,40,39,0.06)]"
                      key={amenity.id}
                    >
                      <span className="grid size-11 place-items-center rounded-2xl bg-[#f3904f]/12 text-[#c95e1c]">
                        <Icon aria-hidden="true" size={21} />
                      </span>
                      <h3 className="mt-4 text-lg font-extrabold text-[#30302f]">
                        {amenity.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-[#6b6b68]">
                        {amenity.description}
                      </p>
                    </article>
                  );
                  })}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f3904f] py-16 text-[#242423] sm:py-20" aria-labelledby="ocasioes-titulo">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-extrabold tracking-[0.18em] uppercase opacity-70">
              {content.occasions.eyebrow}
            </p>
            <h2 className="mt-4 max-w-3xl font-serif text-[clamp(2.2rem,5vw,4rem)] leading-none font-semibold tracking-[-0.045em]" id="ocasioes-titulo">
              {content.occasions.title}
            </h2>
            <ul className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {content.occasions.items.map((item, index) => {
                const Icon = occasionIcons[index] ?? Sun;
                return (
                  <li
                    className="flex min-h-25 items-center gap-3 rounded-2xl border border-black/10 bg-white/28 p-4 font-extrabold backdrop-blur"
                    key={item}
                  >
                    <Icon aria-hidden="true" className="shrink-0" size={22} />
                    <span>{item}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <EspacoFernandesGallery content={content.gallery} />

        <section className="bg-[#f5f1ea] py-20 sm:py-24 lg:py-28" id={content.chalet.id}>
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16 lg:px-8">
            <figure className="relative mx-auto aspect-[4/5] w-full max-w-[33rem] overflow-hidden rounded-[2rem] bg-[#ddd6cb] shadow-[0_24px_70px_rgba(40,40,39,0.13)]">
              <SiteImage
                alt={content.chalet.image.alt}
                className="object-cover"
                fill
                fallbackSrc={content.chalet.image.fallbackSrc}
                sizes="(max-width: 1023px) min(100vw, 528px), 42vw"
                src={content.chalet.image.src}
              />
            </figure>
            <SectionIntro
              description={content.chalet.text}
              eyebrow={content.chalet.eyebrow}
              title={content.chalet.title}
            />
          </div>
        </section>

        <section className="bg-[#292928] py-20 text-white sm:py-24" id={content.location.id}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[1fr_0.86fr] lg:items-center lg:gap-16">
              <SectionIntro
                eyebrow={content.location.eyebrow}
                light
                title={content.location.title}
              />
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.2)] sm:p-8">
                <MapPin aria-hidden="true" className="text-[#f3904f]" size={30} />
                <address className="mt-5 not-italic">
                  {content.location.addressLines.map((line, index) => (
                    <span
                      className={[
                        "block",
                        index === 0
                          ? "font-serif text-2xl font-semibold text-white"
                          : "mt-1 text-base text-white/68 sm:text-lg",
                      ].join(" ")}
                      key={line}
                    >
                      {line}
                    </span>
                  ))}
                </address>
                <div className="mt-7 flex flex-wrap gap-3">
                  <CopyAddressButton
                    address={address}
                    copiedLabel={content.location.copiedLabel}
                    label={content.location.copyLabel}
                  />
                  {content.location.mapUrl ? (
                    <a
                      className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 px-5 py-3 text-sm font-extrabold text-white transition hover:border-[#f3904f] hover:text-[#f4a06b]"
                      href={content.location.mapUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {content.location.mapLabel}
                    </a>
                  ) : null}
                </div>
              </div>
            </div>

            {content.location.mapEmbedUrl ? (
              <div className="mt-10 overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_28px_80px_rgba(0,0,0,0.28)] sm:mt-12">
                <iframe
                  allowFullScreen
                  className="h-[22rem] w-full border-0 sm:h-[28rem]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={content.location.mapEmbedUrl}
                  title={content.location.mapTitle}
                />
              </div>
            ) : null}
          </div>
        </section>

        <section className="relative isolate overflow-hidden bg-[#f3904f] py-20 sm:py-24" id={content.contact.id}>
          <div aria-hidden="true" className="absolute -right-32 -bottom-52 size-[28rem] rounded-full border-[70px] border-white/10" />
          <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.06fr_0.94fr] lg:items-center lg:gap-16 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-xs font-extrabold tracking-[0.18em] uppercase opacity-70">
                {content.contact.eyebrow}
              </p>
              <h2 className="mt-4 font-serif text-[clamp(2.5rem,5.7vw,5rem)] leading-[0.96] font-semibold tracking-[-0.05em]">
                {content.contact.title}
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-black/65">
                {content.contact.text}
              </p>
              {content.pricing.mostrarPreco && content.pricing.valor ? (
                <p className="mt-5 font-extrabold">{content.pricing.valor}</p>
              ) : null}
            </div>

            <div className="rounded-[2rem] bg-[#242423] p-5 text-white shadow-[0_28px_80px_rgba(56,30,14,0.25)] sm:p-7">
              {whatsappHref ? (
                <a
                  className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[#f3904f] px-6 py-3 text-center text-sm font-extrabold text-[#242423] transition hover:bg-[#ffa56d]"
                  data-analytics-event="whatsapp_click"
                  data-analytics-origin="contato"
                  href={whatsappHref}
                  rel="noreferrer"
                  target="_blank"
                >
                  <MessageCircle aria-hidden="true" size={20} />
                  {content.contact.whatsapp.label}
                </a>
              ) : null}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <a
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-3 text-sm font-extrabold text-white hover:bg-white/9"
                  data-analytics-event="instagram_click"
                  data-analytics-origin="contato"
                  href={content.contact.instagram.url}
                  rel="noreferrer"
                  target="_blank"
                >
                  <Instagram aria-hidden="true" size={18} />
                  {content.contact.instagram.label}
                </a>
                <a
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-3 text-sm font-extrabold text-white hover:bg-white/9"
                  href={`mailto:${content.contact.email.address}`}
                >
                  <Mail aria-hidden="true" size={18} />
                  {content.contact.email.label}
                </a>
              </div>
              <p className="mt-5 text-center text-sm text-white/48">
                {content.contact.email.address}
              </p>
            </div>
          </div>
        </section>

        <EspacoFernandesFaq content={content.faq} />
      </main>

      <footer className="border-t border-white/8 bg-[#20201f] px-4 py-8 text-white sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <SiteImage
              alt=""
              aria-hidden="true"
              className="size-12 rounded-full object-cover"
              height={48}
              src={content.brand.logo.src}
              width={48}
            />
            <p className="text-sm font-bold text-white/60">{content.footer.rightsText}</p>
          </div>
          <Link
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/12 px-4 py-2 text-sm font-extrabold text-white/76 hover:text-white"
            href="/"
          >
            <ArrowLeft aria-hidden="true" size={17} />
            {content.footer.backLabel}
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default EspacoFernandesLandingPage;
