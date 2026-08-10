import { ArrowRight, Instagram, MessageCircle } from "lucide-react";
import type { HubContent, HubProject } from "@/src/content/hub";
import { SiteImage } from "@/src/components/SiteImage";
import { buildWhatsAppLink } from "@/src/lib/whatsapp";

interface ProjectHubProps {
  content: HubContent;
}

function ChacaraPanel({ project }: { project: HubProject }) {
  return (
    <article className="group relative isolate flex min-h-[44rem] overflow-hidden bg-[#0d293c] text-white lg:min-h-screen">
      {project.image ? (
        <SiteImage
          alt={project.image.alt}
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.035] group-hover:brightness-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          fill
          priority
          sizes="(max-width: 1023px) 100vw, 50vw"
          src={project.image.src}
        />
      ) : null}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,41,60,0.2)_0%,rgba(13,41,60,0.66)_46%,rgba(8,31,48,0.96)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#f47f20] via-[#e2b07c] to-transparent"
      />
      <div className="relative z-10 flex w-full flex-col justify-end p-7 sm:p-10 lg:p-14 xl:p-16">
        <p className="mb-5 text-xs font-extrabold tracking-[0.18em] text-[#ffb476] uppercase sm:text-sm">
          {project.name}
        </p>
        <h2 className="max-w-2xl font-serif text-[clamp(2.65rem,5.2vw,5.5rem)] leading-[0.98] font-semibold tracking-[-0.045em] text-white">
          {project.purpose}
        </h2>
        <p className="mt-6 max-w-xl text-base leading-7 text-white/76 sm:text-lg sm:leading-8">
          {project.description}
        </p>
        <a
          className="mt-8 inline-flex min-h-13 w-fit items-center justify-center gap-2 rounded-full bg-[#f47f20] px-6 py-3 text-sm font-extrabold text-[#081f30] shadow-[0_16px_34px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5 hover:bg-[#ff9a4d] focus-visible:outline-white motion-reduce:transform-none motion-reduce:transition-none"
          href={project.route}
        >
          {project.buttonLabel}
          <ArrowRight aria-hidden="true" size={18} />
        </a>
      </div>
    </article>
  );
}

function EspacoFernandesPanel({ project }: { project: HubProject }) {
  return (
    <article className="group relative isolate flex min-h-[44rem] overflow-hidden border-white/10 bg-[#343433] text-white lg:min-h-screen lg:border-l">
      {project.image ? (
        <SiteImage
          alt={project.image.alt}
          className="object-cover opacity-65 transition duration-700 ease-out group-hover:scale-[1.025] group-hover:opacity-75 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          fill
          priority
          sizes="(max-width: 1023px) 100vw, 50vw"
          src={project.image.src}
        />
      ) : null}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_72%_20%,rgba(243,144,79,0.2),transparent_32%),linear-gradient(180deg,rgba(35,35,34,0.36)_0%,rgba(35,35,34,0.72)_42%,rgba(26,26,25,0.97)_100%)] transition duration-700 group-hover:brightness-110 motion-reduce:transition-none"
      />
      <div
        aria-hidden="true"
        className="absolute -right-32 top-20 size-80 rounded-full border-[52px] border-[#f3904f]/8 transition-transform duration-700 group-hover:-translate-x-3 motion-reduce:transform-none motion-reduce:transition-none"
      />
      <div className="relative z-10 flex w-full flex-col p-7 sm:p-10 lg:p-14 xl:p-16">
        {project.logo ? (
          <div className="mb-auto w-40 overflow-hidden rounded-full border border-white/10 bg-[#343433] shadow-[0_22px_55px_rgba(0,0,0,0.28)] sm:w-48 lg:w-52">
            <SiteImage
              alt={project.logo.alt}
              className="aspect-square size-full object-contain transition-transform duration-700 group-hover:scale-[1.025] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              height={500}
              sizes="(max-width: 639px) 160px, (max-width: 1023px) 192px, 208px"
              src={project.logo.src}
              width={500}
            />
          </div>
        ) : null}
        <div className="mt-12">
          <p className="mb-5 text-xs font-extrabold tracking-[0.18em] text-[#f5a36e] uppercase sm:text-sm">
            {project.name}
          </p>
          <h2 className="max-w-xl font-serif text-[clamp(2.65rem,5.2vw,5.5rem)] leading-[0.98] font-semibold tracking-[-0.045em] text-white">
            {project.purpose}
          </h2>
          <p className="mt-6 max-w-lg text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
            {project.description}
          </p>
          <a
            className="mt-8 inline-flex min-h-13 w-fit items-center justify-center gap-2 rounded-full bg-[#f47f20] px-6 py-3 text-sm font-extrabold text-[#081f30] shadow-[0_16px_34px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5 hover:bg-[#ff9a4d] focus-visible:outline-white motion-reduce:transform-none motion-reduce:transition-none"
            href={project.route}
          >
            {project.buttonLabel}
            <ArrowRight aria-hidden="true" size={18} />
          </a>
        </div>
      </div>
    </article>
  );
}

export function ProjectHub({ content }: ProjectHubProps) {
  const whatsappHref = buildWhatsAppLink(content.contact.whatsapp);
  const [chacara, espacoFernandes] = content.projects;

  return (
    <div className="min-h-screen bg-[#20201f] text-white">
      <a className="skip-link" href="#projetos">
        Ir para os projetos
      </a>
      <main id="projetos">
        <h1 className="sr-only">{content.accessibilityTitle}</h1>
        <section
          aria-label={content.projectsLabel}
          className="grid lg:grid-cols-2"
        >
          <ChacaraPanel project={chacara} />
          <EspacoFernandesPanel project={espacoFernandes} />
        </section>
      </main>
      <footer className="border-t border-white/10 bg-[#181817] px-6 py-8 text-white/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-extrabold tracking-[0.15em] text-white/55 uppercase">
            {content.contact.title}
          </p>
          <div className="flex flex-col gap-4 text-sm font-bold sm:flex-row sm:items-center sm:gap-7">
            {whatsappHref ? (
              <a
                className="inline-flex items-center gap-2 underline-offset-4 hover:text-white hover:underline"
                href={whatsappHref}
                rel="noreferrer"
                target="_blank"
              >
                <MessageCircle aria-hidden="true" size={18} />
                {content.contact.whatsappLabel}
              </a>
            ) : null}
            <a
              className="inline-flex items-center gap-2 underline-offset-4 hover:text-[#f5a36e] hover:underline"
              href={content.contact.instagramUrl}
              rel="noreferrer"
              target="_blank"
            >
              <Instagram aria-hidden="true" size={18} />
              {content.contact.instagramLabel}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ProjectHub;
