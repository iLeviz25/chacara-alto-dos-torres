"use client";

import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SiteImage } from "@/src/components/SiteImage";
import { trackAnalyticsEvent } from "@/src/lib/analytics/client";
import type {
  EspacoFernandesContent,
  EspacoGalleryCategory,
  EspacoGalleryItem,
} from "@/src/content/espacoFernandes";

interface EspacoFernandesGalleryProps {
  content: EspacoFernandesContent["gallery"];
}

const focusableSelector =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
export function EspacoFernandesGallery({
  content,
}: EspacoFernandesGalleryProps) {
  const initialVisibleCount = content.initialVisibleCount ?? 12;
  const items = useMemo(
    () =>
      content.items
        .filter((item) => item.visible)
        .sort((first, second) => first.order - second.order),
    [content.items],
  );
  const categories = useMemo(
    () =>
      content.categories.filter(
        (category) =>
          category.id === "all" ||
          items.some((item) => item.category === category.id),
      ),
    [content.categories, items],
  );
  const [activeCategory, setActiveCategory] =
    useState<EspacoGalleryCategory>("all");
  const [showAll, setShowAll] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const filteredItems = useMemo(
    () =>
      activeCategory === "all"
        ? items
        : items.filter((item) => item.category === activeCategory),
    [activeCategory, items],
  );
  const displayedItems = useMemo(
    () =>
      activeCategory === "all" && !showAll
        ? filteredItems.slice(0, initialVisibleCount)
        : filteredItems,
    [activeCategory, filteredItems, initialVisibleCount, showAll],
  );
  const selectedItem =
    displayedItems.find((item) => item.id === selectedId) ?? null;
  const selectedIndex = selectedItem
    ? displayedItems.findIndex((item) => item.id === selectedItem.id)
    : -1;

  const closeModal = useCallback(() => {
    setSelectedId(null);
    window.requestAnimationFrame(() => previouslyFocused.current?.focus());
  }, []);

  const move = useCallback(
    (offset: number) => {
      if (displayedItems.length < 2) return;
      setSelectedId((current) => {
        const currentIndex = displayedItems.findIndex((item) => item.id === current);
        const index = currentIndex < 0 ? 0 : currentIndex;
        return displayedItems[
          (index + offset + displayedItems.length) % displayedItems.length
        ].id;
      });
    },
    [displayedItems],
  );

  useEffect(() => {
    if (!selectedItem) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [selectedItem]);

  useEffect(() => {
    if (!selectedItem) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeModal();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        move(-1);
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        move(1);
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeModal, move, selectedItem]);

  function openModal(item: EspacoGalleryItem) {
    previouslyFocused.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setSelectedId(item.id);
    trackAnalyticsEvent({
      site: "espaco-fernandes",
      eventName: "gallery_open",
      origin: "galeria-espaco",
    });
  }

  return (
    <section className="bg-[#272726] py-20 text-white sm:py-24" id={content.id}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-extrabold tracking-[0.18em] text-[#f4a06b] uppercase">
            {content.eyebrow}
          </p>
          <h2 className="mt-4 font-serif text-[clamp(2.3rem,5vw,4.2rem)] leading-none font-semibold tracking-[-0.045em]">
            {content.title}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/62 sm:text-lg sm:leading-8">
            {content.description}
          </p>
        </div>

        <div aria-label="Categorias da galeria" className="mt-8 flex flex-wrap gap-2" role="group">
          {categories.map((category) => {
            const isActive = activeCategory === category.id;
            return (
              <button
                aria-pressed={isActive}
                className={[
                  "min-h-11 rounded-full border px-4 py-2 text-sm font-extrabold outline-none transition focus-visible:ring-3 focus-visible:ring-[#f3904f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#272726]",
                  isActive
                    ? "border-[#f3904f] bg-[#f3904f] text-[#242423]"
                    : "border-white/15 bg-white/5 text-white/74 hover:border-white/35 hover:text-white",
                ].join(" ")}
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id);
                  setShowAll(false);
                  setSelectedId(null);
                }}
                type="button"
              >
                {category.label}
              </button>
            );
          })}
        </div>

        <div
          className="mt-8 grid auto-rows-[17rem] gap-4 sm:grid-cols-2 sm:auto-rows-[20rem] lg:grid-cols-3"
          id="espaco-gallery-grid"
        >
          {displayedItems.map((item, index) => (
            <button
              aria-label={`Ampliar foto: ${item.title}`}
              className={[
                "group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#1d1d1c] text-left outline-none focus-visible:ring-3 focus-visible:ring-[#f3904f] focus-visible:ring-offset-3 focus-visible:ring-offset-[#272726]",
                activeCategory === "all" && index === 0
                  ? "sm:col-span-2 lg:row-span-2 lg:min-h-[41rem]"
                  : "",
              ].join(" ")}
              key={item.id}
              onClick={() => openModal(item)}
              type="button"
            >
              <SiteImage
                alt={item.alt}
                className="object-cover transition-transform duration-500 group-hover:scale-[1.025] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                fill
                fallbackSrc={item.fallbackSrc}
                sizes={
                  activeCategory === "all" && index === 0
                    ? "(max-width: 639px) 100vw, (max-width: 1023px) 100vw, 66vw"
                    : "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                }
                src={item.src}
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/78 via-transparent to-transparent" />
              <span className="absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-black/65 text-white backdrop-blur">
                <Expand aria-hidden="true" size={17} />
              </span>
              <span className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <span className="block text-base font-extrabold text-white">{item.title}</span>
                <span className="mt-1 block text-sm leading-5 text-white/70">{item.caption}</span>
              </span>
            </button>
          ))}
        </div>

        {activeCategory === "all" && filteredItems.length > initialVisibleCount ? (
          <div className="mt-9 flex flex-col items-center gap-3">
            <button
              aria-controls="espaco-gallery-grid"
              aria-expanded={showAll}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#f3904f] bg-[#f3904f] px-6 py-3 text-sm font-extrabold text-[#242423] outline-none transition hover:bg-[#ffab74] focus-visible:ring-3 focus-visible:ring-[#f3904f] focus-visible:ring-offset-3 focus-visible:ring-offset-[#272726]"
              onClick={() => {
                setShowAll((current) => !current);
                setSelectedId(null);
              }}
              type="button"
            >
              {showAll ? "Mostrar apenas as principais" : "Ver todas as fotos"}
            </button>
            <p className="text-sm text-white/58">
              {showAll
                ? `${filteredItems.length} fotos exibidas`
                : `${displayedItems.length} de ${filteredItems.length} fotos exibidas`}
            </p>
          </div>
        ) : null}
      </div>

      {selectedItem ? (
        <div
          aria-label={content.controls.dialogLabel}
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-3 sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
          ref={dialogRef}
          role="dialog"
        >
          <div className="relative flex h-full max-h-[58rem] w-full max-w-6xl flex-col">
            <div className="mb-3 flex justify-end">
              <button
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-[#292928]"
                onClick={closeModal}
                ref={closeButtonRef}
                type="button"
              >
                <X aria-hidden="true" size={18} />
                {content.controls.closeLabel}
              </button>
            </div>
            <figure className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-black">
              <div className="relative min-h-0 flex-1">
                <SiteImage
                  alt={selectedItem.alt}
                  className="object-contain"
                  fill
                  fallbackSrc={selectedItem.fallbackSrc}
                  priority
                  sizes="100vw"
                  src={selectedItem.src}
                />
              </div>
              <figcaption className="bg-black px-5 py-4 text-center text-sm text-white/80">
                {selectedItem.caption}
              </figcaption>
            </figure>
            {displayedItems.length > 1 ? (
              <>
                <button
                  aria-label={content.controls.previousLabel}
                  className="absolute top-1/2 left-2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white text-[#292928] shadow-xl sm:left-4"
                  onClick={() => move(-1)}
                  type="button"
                >
                  <ChevronLeft aria-hidden="true" />
                </button>
                <button
                  aria-label={content.controls.nextLabel}
                  className="absolute top-1/2 right-2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white text-[#292928] shadow-xl sm:right-4"
                  onClick={() => move(1)}
                  type="button"
                >
                  <ChevronRight aria-hidden="true" />
                </button>
              </>
            ) : null}
            <span aria-live="polite" className="sr-only">
              {selectedIndex + 1} de {displayedItems.length}
            </span>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default EspacoFernandesGallery;
