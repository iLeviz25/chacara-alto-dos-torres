import { ArrowLeft, Instagram, MessageCircle } from "lucide-react";
import type { HubContent } from "@/src/content/hub";
import { SiteImage } from "@/src/components/SiteImage";
import { buildWhatsAppLink } from "@/src/lib/whatsapp";

interface EspacoFernandesPlaceholderProps {
  content: HubContent;
}

export function EspacoFernandesPlaceholder({
  content,
}: EspacoFernandesPlaceholderProps) {
  const project = content.projects[1];
  const whatsappHref = buildWhatsAppLink({
    ...content.contact.whatsapp,
    message: content.espacoFernandes.whatsappMessage,
  });

  return (
    <main className="relative isolate flex min-h-screen overflow-hidden bg-[#343433] px-5 py-8 text-white sm:px-8 sm:py-10">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(243,144,79,0.2),transparent_30%),linear-gradient(150deg,#3a3a39_0%,#30302f_52%,#20201f_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-44 -right-40 size-[28rem] rounded-full border-[74px] border-[#f3904f]/8"
      />
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col">
        <a
          className="inline-flex w-fit items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2 text-sm font-bold text-white/75 transition-colors hover:bg-white/10 hover:text-white"
          href={content.routes.home}
        >
          <ArrowLeft aria-hidden="true" size={17} />
          {content.espacoFernandes.homeLabel}
        </a>

        <div className="flex flex-1 flex-col items-center justify-center py-14 text-center sm:py-20">
          {project.logo ? (
            <div className="w-48 overflow-hidden rounded-full border border-white/10 bg-[#343433] shadow-[0_24px_70px_rgba(0,0,0,0.35)] sm:w-60">
              <SiteImage
                alt={project.logo.alt}
                className="aspect-square size-full object-contain"
                height={500}
                priority
                sizes="(max-width: 639px) 192px, 240px"
                src={project.logo.src}
                width={500}
              />
            </div>
          ) : null}
          <p className="mt-8 text-xs font-extrabold tracking-[0.18em] text-[#f5a36e] uppercase">
            {content.espacoFernandes.eyebrow}
          </p>
          <h1 className="mt-4 font-serif text-[clamp(3rem,8vw,6.2rem)] leading-none font-semibold tracking-[-0.05em]">
            {content.espacoFernandes.pageTitle}
          </h1>
          <p className="mt-4 text-lg font-bold text-white/78 sm:text-xl">
            {content.espacoFernandes.purpose}
          </p>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/62 sm:text-lg sm:leading-8">
            {content.espacoFernandes.message}
          </p>

          <div className="mt-9 flex w-full max-w-xl flex-col justify-center gap-3 sm:flex-row">
            {whatsappHref ? (
              <a
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-[#f3904f] px-6 py-3 text-sm font-extrabold text-[#262625] transition hover:bg-[#ffa369]"
                href={whatsappHref}
                rel="noreferrer"
                target="_blank"
              >
                <MessageCircle aria-hidden="true" size={18} />
                {content.espacoFernandes.whatsappLabel}
              </a>
            ) : null}
            <a
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-white/18 bg-white/5 px-6 py-3 text-sm font-extrabold text-white transition hover:border-[#f3904f]/60 hover:bg-[#f3904f]/10"
              href={content.contact.instagramUrl}
              rel="noreferrer"
              target="_blank"
            >
              <Instagram aria-hidden="true" size={18} />
              {content.espacoFernandes.instagramLabel}
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

export default EspacoFernandesPlaceholder;
