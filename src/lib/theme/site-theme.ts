import type { CSSProperties } from "react";
import {
  EDITABLE_SITE_SLUGS,
  type EditableSiteSlug,
} from "@/src/lib/content/site-content";

export const HEADING_FONT_OPTIONS = [
  { value: "editorial", label: "Editorial clássico" },
  { value: "modern", label: "Moderno e direto" },
  { value: "friendly", label: "Acolhedor" },
] as const;

export const BODY_FONT_OPTIONS = [
  { value: "system", label: "Sistema (padrão)" },
  { value: "humanist", label: "Humanista" },
  { value: "classic", label: "Clássico" },
] as const;

export const CARD_RADIUS_OPTIONS = [
  { value: "none", label: "Sem arredondamento" },
  { value: "soft", label: "Discreto" },
  { value: "rounded", label: "Arredondado" },
  { value: "large", label: "Bem arredondado" },
] as const;

export const BUTTON_RADIUS_OPTIONS = [
  { value: "none", label: "Reto" },
  { value: "soft", label: "Discreto" },
  { value: "rounded", label: "Arredondado" },
  { value: "pill", label: "Cápsula" },
] as const;

export const SHADOW_OPTIONS = [
  { value: "none", label: "Sem sombras" },
  { value: "soft", label: "Suaves" },
  { value: "medium", label: "Médias" },
  { value: "strong", label: "Marcantes" },
] as const;

type HeadingFont = (typeof HEADING_FONT_OPTIONS)[number]["value"];
type BodyFont = (typeof BODY_FONT_OPTIONS)[number]["value"];
type CardRadius = (typeof CARD_RADIUS_OPTIONS)[number]["value"];
type ButtonRadius = (typeof BUTTON_RADIUS_OPTIONS)[number]["value"];
type ShadowIntensity = (typeof SHADOW_OPTIONS)[number]["value"];

export type SiteTheme = {
  colors: {
    primary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  };
  fonts: {
    heading: HeadingFont;
    body: BodyFont;
  };
  radius: {
    cards: CardRadius;
    buttons: ButtonRadius;
  };
  shadows: ShadowIntensity;
  animations: boolean;
};

export const DEFAULT_SITE_THEMES: Record<EditableSiteSlug, SiteTheme> = {
  "chacara-alto-dos-torres": {
    colors: {
      primary: "#0d293c",
      accent: "#f47f20",
      background: "#f7f2e8",
      surface: "#ffffff",
      text: "#1d2930",
    },
    fonts: { heading: "editorial", body: "system" },
    radius: { cards: "rounded", buttons: "pill" },
    shadows: "soft",
    animations: true,
  },
  "espaco-fernandes": {
    colors: {
      primary: "#242423",
      accent: "#f3904f",
      background: "#f5f1ea",
      surface: "#ffffff",
      text: "#292928",
    },
    fonts: { heading: "editorial", body: "system" },
    radius: { cards: "large", buttons: "pill" },
    shadows: "medium",
    animations: true,
  },
};

const HEX_COLOR = /^#[0-9a-f]{6}$/i;
const headingFonts = new Set(HEADING_FONT_OPTIONS.map((option) => option.value));
const bodyFonts = new Set(BODY_FONT_OPTIONS.map((option) => option.value));
const cardRadii = new Set(CARD_RADIUS_OPTIONS.map((option) => option.value));
const buttonRadii = new Set(BUTTON_RADIUS_OPTIONS.map((option) => option.value));
const shadows = new Set(SHADOW_OPTIONS.map((option) => option.value));

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function relativeLuminance(color: string) {
  const channels = [color.slice(1, 3), color.slice(3, 5), color.slice(5, 7)].map((part) => {
    const value = Number.parseInt(part, 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(first: string, second: string) {
  const lighter = Math.max(relativeLuminance(first), relativeLuminance(second));
  const darker = Math.min(relativeLuminance(first), relativeLuminance(second));
  return (lighter + 0.05) / (darker + 0.05);
}

export function isEditableSiteSlug(value: unknown): value is EditableSiteSlug {
  return typeof value === "string" && EDITABLE_SITE_SLUGS.includes(value as EditableSiteSlug);
}

export function validateSiteTheme(value: unknown):
  | { ok: true; theme: SiteTheme }
  | { ok: false; errors: string[] } {
  const errors: string[] = [];
  if (!isRecord(value)) return { ok: false, errors: ["Tema inválido."] };

  const colors = value.colors;
  const fonts = value.fonts;
  const radius = value.radius;

  if (!isRecord(colors)) {
    errors.push("As cores do tema são inválidas.");
  } else {
    for (const key of ["primary", "accent", "background", "surface", "text"] as const) {
      if (typeof colors[key] !== "string" || !HEX_COLOR.test(colors[key])) {
        errors.push(`A cor ${key} deve estar no formato hexadecimal.`);
      }
    }
    if (
      ["primary", "accent", "background", "surface", "text"].every(
        (key) => typeof colors[key] === "string" && HEX_COLOR.test(colors[key] as string),
      )
    ) {
      if (contrastRatio(colors.text as string, colors.background as string) < 4.5) {
        errors.push("A cor dos textos precisa ter mais contraste com o fundo.");
      }
      if (contrastRatio(colors.text as string, colors.surface as string) < 4.5) {
        errors.push("A cor dos textos precisa ter mais contraste com os cards.");
      }
      if (contrastRatio(colors.primary as string, colors.accent as string) < 3) {
        errors.push("As cores principal e de destaque precisam ter mais contraste.");
      }
    }
  }

  if (
    !isRecord(fonts) ||
    typeof fonts.heading !== "string" ||
    !headingFonts.has(fonts.heading as HeadingFont) ||
    typeof fonts.body !== "string" ||
    !bodyFonts.has(fonts.body as BodyFont)
  ) {
    errors.push("Selecione fontes disponíveis na lista.");
  }

  if (
    !isRecord(radius) ||
    typeof radius.cards !== "string" ||
    !cardRadii.has(radius.cards as CardRadius) ||
    typeof radius.buttons !== "string" ||
    !buttonRadii.has(radius.buttons as ButtonRadius)
  ) {
    errors.push("Selecione arredondamentos disponíveis na lista.");
  }

  if (typeof value.shadows !== "string" || !shadows.has(value.shadows as ShadowIntensity)) {
    errors.push("Selecione uma intensidade de sombra disponível.");
  }

  if (typeof value.animations !== "boolean") {
    errors.push("A configuração de animações é inválida.");
  }

  if (errors.length) return { ok: false, errors };
  const safeColors = colors as Record<string, string>;
  const safeFonts = fonts as Record<string, string>;
  const safeRadius = radius as Record<string, string>;
  return {
    ok: true,
    theme: {
      colors: {
        primary: safeColors.primary,
        accent: safeColors.accent,
        background: safeColors.background,
        surface: safeColors.surface,
        text: safeColors.text,
      },
      fonts: {
        heading: safeFonts.heading as HeadingFont,
        body: safeFonts.body as BodyFont,
      },
      radius: {
        cards: safeRadius.cards as CardRadius,
        buttons: safeRadius.buttons as ButtonRadius,
      },
      shadows: value.shadows as ShadowIntensity,
      animations: value.animations as boolean,
    },
  };
}

export function themesAreEqual(left: SiteTheme, right: SiteTheme) {
  return JSON.stringify(left) === JSON.stringify(right);
}

const headingFontStacks: Record<HeadingFont, string> = {
  editorial: '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif',
  modern: '"Aptos Display", "Segoe UI", Helvetica, Arial, sans-serif',
  friendly: 'Trebuchet MS, "Segoe UI", Helvetica, Arial, sans-serif',
};

const bodyFontStacks: Record<BodyFont, string> = {
  system: '"Aptos", "Segoe UI", Helvetica, Arial, sans-serif',
  humanist: 'Candara, "Trebuchet MS", "Segoe UI", sans-serif',
  classic: 'Georgia, "Times New Roman", serif',
};

const cardRadiusValues: Record<CardRadius, string> = {
  none: "0px",
  soft: "0.75rem",
  rounded: "1.25rem",
  large: "2rem",
};

const buttonRadiusValues: Record<ButtonRadius, string> = {
  none: "0px",
  soft: "0.7rem",
  rounded: "1.15rem",
  pill: "999px",
};

const shadowValues: Record<ShadowIntensity, { card: string; elevated: string }> = {
  none: { card: "none", elevated: "none" },
  soft: {
    card: "0 10px 30px rgba(29, 41, 48, 0.08)",
    elevated: "0 20px 55px rgba(13, 41, 60, 0.10)",
  },
  medium: {
    card: "0 18px 55px rgba(40, 40, 39, 0.08)",
    elevated: "0 28px 80px rgba(0, 0, 0, 0.20)",
  },
  strong: {
    card: "0 20px 60px rgba(20, 31, 38, 0.17)",
    elevated: "0 34px 95px rgba(0, 0, 0, 0.30)",
  },
};

export type ThemeCssProperties = CSSProperties & Record<`--${string}`, string>;

export function themeCssProperties(theme: SiteTheme): ThemeCssProperties {
  const shadow = shadowValues[theme.shadows];
  return {
    "--site-primary": theme.colors.primary,
    "--site-accent": theme.colors.accent,
    "--site-background": theme.colors.background,
    "--site-surface": theme.colors.surface,
    "--site-text": theme.colors.text,
    "--site-heading-font": headingFontStacks[theme.fonts.heading],
    "--site-body-font": bodyFontStacks[theme.fonts.body],
    "--site-card-radius": cardRadiusValues[theme.radius.cards],
    "--site-button-radius": buttonRadiusValues[theme.radius.buttons],
    "--site-card-shadow": shadow.card,
    "--site-elevated-shadow": shadow.elevated,
  };
}
