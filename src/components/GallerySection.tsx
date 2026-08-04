"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  GalleryCategoryOption,
  GalleryItem,
  PropertyContent,
} from "@/src/content/property";
import { SectionHeading } from "@/src/components/SectionHeading";

export interface GallerySectionProps {
  content: PropertyContent["gallery"];
  className?: string;
}

const modalFocusableSelector =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function GallerySection({
  content,
  className = "",
}: GallerySectionProps) {
  const sortedItems = useMemo(
    () =>
      content.items
        .filter((item) => item.visible)
        .sort((first, second) => first.order - second.order),
    [content.items],
  );

  const availableCategories = useMemo(
    () =>
      content.categories.filter(
        (category) =>
          category.id === "all" ||
          sortedItems.some((item) => item.category === category.id),
      ),
    [content.categories, sortedItems],
  );

  const defaultCategory =
    availableCategories.find((category) => category.id === "all")?.id ??
    availableCategories[0]?.id ??
    "all";

  const [selectedCategory, setSelectedCategory] =
    useState<GalleryCategoryOption["id"]>(defaultCategory);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const activeCategory = availableCategories.some(
    (category) => category.id === selectedCategory,
  )
    ? selectedCategory
    : defaultCategory;

  const filteredItems = useMemo(
    () =>
      activeCategory === "all"
        ? sortedItems
        : sortedItems.filter((item) => item.category === activeCategory),
    [activeCategory, sortedItems],
  );

  const selectedItem =
    filteredItems.find((item) => item.id === selectedItemId) ?? null;
  const selectedItemIndex = selectedItem
    ? filteredItems.findIndex((item) => item.id === selectedItem.id)
    : -1;
  const isModalOpen = selectedItem !== null;

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  const closeModal = useCallback(() => {
    setSelectedItemId(null);

    window.requestAnimationFrame(() => {
      if (previouslyFocusedElement.current?.isConnected) {
        previouslyFocusedElement.current.focus();
      }
    });
  }, []);

  const showItemAtOffset = useCallback(
    (offset: number) => {
      if (filteredItems.length < 2) {
        return;
      }

      setSelectedItemId((currentItemId) => {
        const currentIndex = filteredItems.findIndex(
          (item) => item.id === currentItemId,
        );
        const safeCurrentIndex = currentIndex < 0 ? 0 : currentIndex;
        const nextIndex =
          (safeCurrentIndex + offset + filteredItems.length) %
          filteredItems.length;

        return filteredItems[nextIndex].id;
      });
    },
    [filteredItems],
  );

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isModalOpen]);

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    function handleDialogKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeModal();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showItemAtOffset(-1);
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        showItemAtOffset(1);
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) {
        return;
      }

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          modalFocusableSelector,
        ),
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", handleDialogKeyDown);

    return () => {
      document.removeEventListener("keydown", handleDialogKeyDown);
    };
  }, [closeModal, isModalOpen, showItemAtOffset]);

  if (sortedItems.length === 0) {
    return null;
  }

  function openModal(item: GalleryItem) {
    previouslyFocusedElement.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setSelectedItemId(item.id);
  }

  return (
    <section
      className={["bg-white py-20 sm:py-24 lg:py-28", className]
        .filter(Boolean)
        .join(" ")}
      id={content.id}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          description={<p>{content.description}</p>}
          eyebrow={content.eyebrow}
          title={content.title}
        />

        {availableCategories.length > 1 ? (
          <div
            aria-label={content.eyebrow}
            className="mt-8 flex flex-wrap gap-2"
            role="group"
          >
            {availableCategories.map((category) => {
              const isActive = activeCategory === category.id;

              return (
                <button
                  aria-pressed={isActive}
                  className={[
                    "min-h-11 rounded-full border px-4 py-2 text-sm font-semibold outline-none motion-safe:transition focus-visible:ring-2 focus-visible:ring-[#b8793e] focus-visible:ring-offset-2",
                    isActive
                      ? "border-[#173f2b] bg-[#173f2b] text-white"
                      : "border-[#173f2b]/15 bg-[#f5f1e8] text-[#364239] hover:border-[#173f2b]/35 hover:bg-white",
                  ].join(" ")}
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setSelectedItemId(null);
                  }}
                  type="button"
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        ) : null}

        {filteredItems.length > 0 ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item, index) => (
              <button
                aria-label={content.controls.openImageLabel + ": " + item.alt}
                className={[
                  "group relative min-h-48 overflow-hidden rounded-2xl bg-[#e8e2d6] text-left shadow-sm outline-none motion-safe:transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-[#b8793e] focus-visible:ring-offset-2",
                  index === 0
                    ? "sm:col-span-2 lg:row-span-2 lg:min-h-[30rem]"
                    : "aspect-[4/3]",
                ].join(" ")}
                key={item.id}
                onClick={() => openModal(item)}
                type="button"
              >
                <Image
                  alt={item.alt}
                  className="object-cover motion-safe:transition-transform motion-safe:duration-500 group-hover:scale-[1.025]"
                  fill
                  sizes={
                    index === 0
                      ? "(max-width: 639px) 100vw, (max-width: 1023px) 100vw, 66vw"
                      : "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  }
                  src={item.src}
                />
                <span
                  aria-hidden="true"
                  className="absolute right-3 top-3 inline-flex size-10 items-center justify-center rounded-full bg-white/90 text-[#173f2b] shadow-sm backdrop-blur"
                >
                  <Expand className="size-4" />
                </span>
                {item.caption ? (
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-4 pb-4 pt-12 text-sm font-medium text-white">
                    {item.caption}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        ) : (
          <p
            aria-live="polite"
            className="mt-8 rounded-2xl border border-[#173f2b]/10 bg-[#f5f1e8] p-6 text-[#4b5149]"
          >
            {content.controls.emptyLabel}
          </p>
        )}
      </div>

      {selectedItem ? (
        <div
          aria-label={content.controls.dialogLabel}
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#101b14]/95 p-3 sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
          ref={dialogRef}
          role="dialog"
        >
          <div className="relative flex h-full max-h-[56rem] w-full max-w-6xl flex-col">
            <div className="mb-3 flex justify-end">
              <button
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#173f2b] outline-none motion-safe:transition hover:bg-[#f5f1e8] focus-visible:ring-2 focus-visible:ring-[#d89b60] focus-visible:ring-offset-2 focus-visible:ring-offset-[#101b14]"
                onClick={closeModal}
                ref={closeButtonRef}
                type="button"
              >
                <X aria-hidden="true" className="size-5" />
                <span>{content.controls.closeLabel}</span>
              </button>
            </div>

            <figure className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-black">
              <div className="relative min-h-0 flex-1">
                <Image
                  alt={selectedItem.alt}
                  className="object-contain"
                  fill
                  priority
                  sizes="100vw"
                  src={selectedItem.src}
                />
              </div>
              {selectedItem.caption ? (
                <figcaption className="bg-black px-5 py-4 text-center text-sm text-white sm:text-base">
                  {selectedItem.caption}
                </figcaption>
              ) : null}
            </figure>

            {filteredItems.length > 1 ? (
              <>
                <button
                  aria-label={content.controls.previousLabel}
                  className="absolute left-2 top-1/2 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#173f2b] shadow-lg outline-none motion-safe:transition hover:bg-white focus-visible:ring-2 focus-visible:ring-[#d89b60] focus-visible:ring-offset-2 focus-visible:ring-offset-[#101b14] sm:left-4"
                  onClick={() => showItemAtOffset(-1)}
                  type="button"
                >
                  <ChevronLeft aria-hidden="true" className="size-6" />
                </button>
                <button
                  aria-label={content.controls.nextLabel}
                  className="absolute right-2 top-1/2 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#173f2b] shadow-lg outline-none motion-safe:transition hover:bg-white focus-visible:ring-2 focus-visible:ring-[#d89b60] focus-visible:ring-offset-2 focus-visible:ring-offset-[#101b14] sm:right-4"
                  onClick={() => showItemAtOffset(1)}
                  type="button"
                >
                  <ChevronRight aria-hidden="true" className="size-6" />
                </button>
              </>
            ) : null}

            <span aria-live="polite" className="sr-only">
              {selectedItemIndex + 1} / {filteredItems.length}
            </span>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default GallerySection;
