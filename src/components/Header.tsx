"use client";

import { Menu, X } from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import type {
  PropertyContent,
  PropertyStatus,
  StatusContent,
} from "@/src/content/property";
import { WhatsAppButton } from "@/src/components/WhatsAppButton";

export interface HeaderProps {
  propertyName: string;
  content: PropertyContent["header"];
  status: PropertyStatus;
  statusContent: StatusContent;
  whatsappHref: string | null;
  unavailableContactLabel: string;
}

const focusableSelector =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Header({
  propertyName,
  content,
  status,
  statusContent,
  whatsappHref,
  unavailableContactLabel,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const menu = mobileMenuRef.current;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const firstFocusable = menu?.querySelector<HTMLElement>(focusableSelector);
    firstFocusable?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab" || !menu) {
        return;
      }

      const focusableElements = Array.from(
        menu.querySelectorAll<HTMLElement>(focusableSelector),
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

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;

      if (
        target instanceof Node &&
        !menu?.contains(target) &&
        !menuButtonRef.current?.contains(target)
      ) {
        setIsMenuOpen(false);
      }
    }

    function handleDesktopViewport(event: MediaQueryListEvent) {
      if (event.matches) {
        setIsMenuOpen(false);
      }
    }

    const desktopViewport = window.matchMedia("(min-width: 1280px)");

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    desktopViewport.addEventListener("change", handleDesktopViewport);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
      desktopViewport.removeEventListener("change", handleDesktopViewport);
    };
  }, [isMenuOpen]);

  function handleMenuButtonKeyDown(
    event: ReactKeyboardEvent<HTMLButtonElement>,
  ) {
    if (event.key === "ArrowDown" && !isMenuOpen) {
      event.preventDefault();
      setIsMenuOpen(true);
    }
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0d293c]/97 text-white backdrop-blur">
      <div className="mx-auto flex min-h-18 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-3 xl:flex-none">
          <span className="truncate text-base font-semibold tracking-[-0.01em] text-white sm:text-lg">
            {propertyName}
          </span>
          {status !== "available" ? (
            <span
              className="shrink-0 rounded-full border border-[#b8793e]/35 bg-[#b8793e]/10 px-2.5 py-1 text-xs font-semibold text-[#72471f]"
              title={statusContent.message ?? undefined}
            >
              {statusContent.label}
            </span>
          ) : null}
        </div>

        <nav
          aria-label={content.navigationLabel}
          className="ml-auto hidden items-center gap-1 xl:flex"
        >
          {content.navigation.map((item) => (
            <a
              className="inline-flex min-h-11 items-center rounded-lg px-2.5 py-2 text-[0.95rem] font-semibold text-white/78 outline-none motion-safe:transition hover:bg-white/[0.07] hover:text-white focus-visible:ring-2 focus-visible:ring-[#ff9a4d] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d293c]"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden xl:block">
          <WhatsAppButton
            href={whatsappHref}
            label={content.contactLabel}
            status={status}
            statusContent={statusContent}
            unavailableLabel={unavailableContactLabel}
            variant="header"
          />
        </div>

        <button
          aria-controls={menuId}
          aria-expanded={isMenuOpen}
          aria-label={
            isMenuOpen ? content.closeMenuLabel : content.openMenuLabel
          }
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white outline-none motion-safe:transition hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-[#ff9a4d] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d293c] xl:hidden"
          onClick={() => setIsMenuOpen((current) => !current)}
          onKeyDown={handleMenuButtonKeyDown}
          ref={menuButtonRef}
          type="button"
        >
          {isMenuOpen ? (
            <X aria-hidden="true" className="size-5" />
          ) : (
            <Menu aria-hidden="true" className="size-5" />
          )}
        </button>

        <div
          className="absolute inset-x-0 top-full border-b border-white/10 bg-[#0d293c] px-4 py-5 shadow-[0_18px_38px_rgba(13,41,60,0.28)] sm:px-6 xl:hidden"
          hidden={!isMenuOpen}
          id={menuId}
          ref={mobileMenuRef}
        >
          <nav
            aria-label={content.navigationLabel}
            className="mx-auto flex max-w-7xl flex-col gap-1"
          >
            {content.navigation.map((item) => (
              <a
                className="flex min-h-12 items-center rounded-xl px-4 py-3 text-base font-semibold text-white/85 outline-none motion-safe:transition hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-[#ff9a4d]"
                href={item.href}
                key={item.href}
                onClick={closeMenu}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="mx-auto mt-4 max-w-7xl border-t border-white/10 pt-4">
            <WhatsAppButton
              className="w-full"
              href={whatsappHref}
              label={content.contactLabel}
              onClick={closeMenu}
              status={status}
              statusContent={statusContent}
              unavailableLabel={unavailableContactLabel}
              variant="primary"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
