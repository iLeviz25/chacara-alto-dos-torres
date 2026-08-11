"use client";

import { Menu, MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { SiteImage } from "@/src/components/SiteImage";
import type { EspacoFernandesContent } from "@/src/content/espacoFernandes";

interface EspacoFernandesHeaderProps {
  content: Pick<
    EspacoFernandesContent,
    "brand" | "navigation" | "hero"
  >;
  whatsappHref: string | null;
}

export function EspacoFernandesHeader({
  content,
  whatsappHref,
}: EspacoFernandesHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#242423]/94 text-white shadow-[0_8px_30px_rgba(0,0,0,0.16)] backdrop-blur-xl">
      <div className="mx-auto flex min-h-18 w-full max-w-7xl items-center gap-5 px-4 sm:px-6 lg:px-8">
        <a
          aria-label="Espaço Fernandes — voltar ao início"
          className="flex min-w-0 items-center gap-3"
          href="#inicio"
        >
          <SiteImage
            alt=""
            aria-hidden="true"
            className="size-11 shrink-0 rounded-full border border-white/10 object-cover"
            height={44}
            priority
            src={content.brand.logo.src}
            width={44}
          />
          <span className="truncate text-sm font-extrabold tracking-[0.04em] sm:text-base">
            {content.brand.name}
          </span>
        </a>

        <nav
          aria-label="Navegação principal"
          className="ml-auto hidden items-center gap-0.5 xl:flex"
        >
          {content.navigation.map((item) => (
            <a
              className="rounded-full px-3 py-2 text-sm font-bold text-white/72 transition hover:bg-white/8 hover:text-white"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {whatsappHref ? (
          <a
            className="ml-auto hidden min-h-11 items-center justify-center gap-2 rounded-full bg-[#f3904f] px-4 py-2 text-sm font-extrabold text-[#242423] transition hover:bg-[#ffa56d] xl:ml-3 xl:inline-flex"
            data-analytics-event="whatsapp_click"
            data-analytics-origin="cabecalho"
            href={whatsappHref}
            rel="noreferrer"
            target="_blank"
          >
            <MessageCircle aria-hidden="true" size={18} />
            {content.hero.primaryButton}
          </a>
        ) : null}

        <button
          aria-controls="menu-espaco-fernandes"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          className="ml-auto grid size-11 place-items-center rounded-full border border-white/14 bg-white/5 text-white xl:hidden"
          onClick={() => setIsOpen((current) => !current)}
          type="button"
        >
          {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      <div
        className={[
          "border-t border-white/10 bg-[#242423] px-4 pb-5 xl:hidden",
          isOpen ? "block" : "hidden",
        ].join(" ")}
        id="menu-espaco-fernandes"
      >
        <nav aria-label="Navegação móvel" className="mx-auto max-w-7xl pt-3">
          <div className="grid sm:grid-cols-2">
            {content.navigation.map((item) => (
              <a
                className="min-h-12 rounded-xl px-4 py-3 font-bold text-white/78 hover:bg-white/7 hover:text-white"
                href={item.href}
                key={item.href}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
          {whatsappHref ? (
            <a
              className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#f3904f] px-5 py-3 font-extrabold text-[#242423] sm:w-auto"
              data-analytics-event="whatsapp_click"
              data-analytics-origin="cabecalho"
              href={whatsappHref}
              rel="noreferrer"
              target="_blank"
            >
              <MessageCircle aria-hidden="true" size={18} />
              {content.hero.primaryButton}
            </a>
          ) : null}
        </nav>
      </div>
    </header>
  );
}

export default EspacoFernandesHeader;
