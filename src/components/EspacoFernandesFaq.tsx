"use client";

import { ChevronDown } from "lucide-react";
import { useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import type { EspacoFernandesContent } from "@/src/content/espacoFernandes";

interface EspacoFernandesFaqProps {
  content: EspacoFernandesContent["faq"];
}

export function EspacoFernandesFaq({ content }: EspacoFernandesFaqProps) {
  const items = useMemo(
    () =>
      content.items
        .filter((item) => item.visible)
        .sort((first, second) => first.order - second.order),
    [content.items],
  );
  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const accordionId = useId();
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function handleKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let target: number | null = null;
    if (event.key === "ArrowDown") target = (index + 1) % items.length;
    if (event.key === "ArrowUp") target = (index - 1 + items.length) % items.length;
    if (event.key === "Home") target = 0;
    if (event.key === "End") target = items.length - 1;
    if (target !== null) {
      event.preventDefault();
      buttonRefs.current[target]?.focus();
    }
  }

  return (
    <section className="bg-[#f2eee7] py-20 sm:py-24" id={content.id}>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16 lg:px-8">
        <div className="max-w-xl">
          <p className="text-xs font-extrabold tracking-[0.18em] text-[#bd5717] uppercase">
            {content.eyebrow}
          </p>
          <h2 className="mt-4 font-serif text-[clamp(2.2rem,5vw,4rem)] leading-[1.02] font-semibold tracking-[-0.045em] text-[#292928]">
            {content.title}
          </h2>
        </div>

        <div className="overflow-hidden rounded-3xl border border-black/8 bg-white shadow-[0_18px_55px_rgba(38,38,37,0.08)]">
          {items.map((item, index) => {
            const isOpen = openItemId === item.id;
            const buttonId = `${accordionId}-button-${index}`;
            const panelId = `${accordionId}-panel-${index}`;

            return (
              <div className="border-b border-black/8 last:border-b-0" key={item.id}>
                <h3>
                  <button
                    aria-controls={panelId}
                    aria-expanded={isOpen}
                    className="flex min-h-17 w-full items-center justify-between gap-5 px-5 py-5 text-left text-base font-extrabold text-[#292928] outline-none transition hover:bg-[#faf8f4] focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-[#f3904f] sm:px-7 sm:text-lg"
                    id={buttonId}
                    onClick={() =>
                      setOpenItemId((current) => (current === item.id ? null : item.id))
                    }
                    onKeyDown={(event) => handleKeyDown(event, index)}
                    ref={(element) => {
                      buttonRefs.current[index] = element;
                    }}
                    type="button"
                  >
                    <span>{item.question}</span>
                    <ChevronDown
                      aria-hidden="true"
                      className={[
                        "size-5 shrink-0 text-[#d96824] transition-transform motion-reduce:transition-none",
                        isOpen ? "rotate-180" : "",
                      ].join(" ")}
                    />
                  </button>
                </h3>
                <div aria-labelledby={buttonId} hidden={!isOpen} id={panelId} role="region">
                  <p className="px-5 pb-6 text-base leading-7 text-[#60605e] sm:px-7">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default EspacoFernandesFaq;
