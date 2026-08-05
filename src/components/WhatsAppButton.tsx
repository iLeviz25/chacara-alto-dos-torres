"use client";

import { MessageCircle } from "lucide-react";
import type { MouseEventHandler } from "react";
import type { PropertyStatus, StatusContent } from "@/src/content/property";

export type WhatsAppButtonVariant =
  | "primary"
  | "secondary"
  | "header"
  | "floating";

export interface WhatsAppButtonProps {
  href: string | null;
  label: string;
  unavailableLabel: string;
  status: PropertyStatus;
  statusContent: StatusContent;
  variant?: WhatsAppButtonVariant;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

const baseClassName =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full font-semibold outline-none motion-safe:transition focus-visible:ring-2 focus-visible:ring-[#ff9a4d] focus-visible:ring-offset-2";

const variantClassNames: Record<WhatsAppButtonVariant, string> = {
  primary:
    "bg-[#f47f20] px-6 py-3 text-[#102a3c] shadow-sm hover:bg-[#ff9540]",
  secondary:
    "border border-white/25 bg-white px-6 py-3 text-[#0d293c] hover:bg-[#fff4ea]",
  header:
    "bg-[#f47f20] px-5 py-2.5 text-sm text-[#102a3c] shadow-sm hover:bg-[#ff9540]",
  floating:
    "fixed bottom-4 right-4 z-30 size-14 bg-[#f47f20] p-0 text-[#102a3c] shadow-[0_12px_32px_rgba(13,41,60,0.3)] hover:bg-[#ff9540] sm:bottom-6 sm:right-6 md:hidden",
};

const disabledClassNames: Record<
  Exclude<WhatsAppButtonVariant, "floating">,
  string
> = {
  primary: "bg-[#e7e2d8] px-6 py-3 text-[#596057]",
  secondary:
    "border border-[#173f2b]/15 bg-[#f5f1e8] px-6 py-3 text-[#596057]",
  header: "bg-[#e7e2d8] px-5 py-2.5 text-sm text-[#596057]",
};

export function WhatsAppButton({
  href,
  label,
  unavailableLabel,
  status,
  statusContent,
  variant = "primary",
  className = "",
  onClick,
}: WhatsAppButtonProps) {
  const isContactAvailable = status === "available" && Boolean(href);

  if (!isContactAvailable) {
    if (variant === "floating") {
      return null;
    }

    const replacementLabel =
      status === "available"
        ? unavailableLabel
        : statusContent.contactReplacement ??
          statusContent.message ??
          statusContent.label;

    return (
      <span
        aria-disabled="true"
        className={[
          baseClassName,
          disabledClassNames[variant],
          "cursor-not-allowed",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <MessageCircle aria-hidden="true" className="size-5 shrink-0" />
        <span>{replacementLabel}</span>
      </span>
    );
  }

  return (
    <a
      aria-label={variant === "floating" ? label : undefined}
      className={[
        baseClassName,
        variantClassNames[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      href={href ?? undefined}
      onClick={onClick}
      rel="noopener noreferrer"
      target="_blank"
    >
      <MessageCircle aria-hidden="true" className="size-5 shrink-0" />
      <span className={variant === "floating" ? "sr-only" : undefined}>
        {label}
      </span>
    </a>
  );
}

export default WhatsAppButton;
