"use client";

import { ChevronDown } from "lucide-react";
import {
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import type { PropertyContent } from "@/src/content/property";
import { SectionHeading } from "@/src/components/SectionHeading";

export interface FAQSectionProps {
  content: PropertyContent["faq"];
  className?: string;
}

export function FAQSection({
  content,
  className = "",
}: FAQSectionProps) {
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

  if (items.length === 0) {
    return null;
  }

  function handleAccordionKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    itemIndex: number,
  ) {
    let targetIndex: number | null = null;

    if (event.key === "ArrowDown") {
      targetIndex = (itemIndex + 1) % items.length;
    } else if (event.key === "ArrowUp") {
      targetIndex = (itemIndex - 1 + items.length) % items.length;
    } else if (event.key === "Home") {
      targetIndex = 0;
    } else if (event.key === "End") {
      targetIndex = items.length - 1;
    }

    if (targetIndex !== null) {
      event.preventDefault();
      buttonRefs.current[targetIndex]?.focus();
    }
  }

  return (
    <section
      className={["bg-[#f5f1e8] py-20 sm:py-24 lg:py-28", className]
        .filter(Boolean)
        .join(" ")}
      id={content.id}
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16 lg:px-8">
        <SectionHeading eyebrow={content.eyebrow} title={content.title} />

        <div className="overflow-hidden rounded-2xl border border-[#173f2b]/10 bg-white shadow-sm">
          {items.map((item, index) => {
            const isOpen = openItemId === item.id;
            const buttonId =
              accordionId + "-button-" + index.toString();
            const panelId =
              accordionId + "-panel-" + index.toString();

            return (
              <div
                className="border-b border-[#173f2b]/10 last:border-b-0"
                key={item.id}
              >
                <h3>
                  <button
                    aria-controls={panelId}
                    aria-expanded={isOpen}
                    className="flex min-h-16 w-full items-center justify-between gap-5 px-5 py-5 text-left text-base font-semibold leading-6 text-[#0d293c] outline-none motion-safe:transition hover:bg-[#f8f6f0] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#f47f20] sm:px-6 sm:text-lg"
                    id={buttonId}
                    onClick={() =>
                      setOpenItemId((currentItemId) =>
                        currentItemId === item.id ? null : item.id,
                      )
                    }
                    onKeyDown={(event) =>
                      handleAccordionKeyDown(event, index)
                    }
                    ref={(element) => {
                      buttonRefs.current[index] = element;
                    }}
                    type="button"
                  >
                    <span>{item.question}</span>
                    <ChevronDown
                      aria-hidden="true"
                      className={[
                        "size-5 shrink-0 text-[#e66f12] motion-safe:transition-transform",
                        isOpen ? "rotate-180" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    />
                  </button>
                </h3>
                <div
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  id={panelId}
                  role="region"
                >
                  <p className="px-5 pb-6 text-base leading-7 text-[#50574f] sm:px-6">
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

export default FAQSection;
