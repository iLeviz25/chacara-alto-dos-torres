"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin } from "@/src/lib/admin-auth";
import { createClient } from "@/src/lib/supabase/server";
import {
  isEditableSiteSlug,
  validateSiteTheme,
} from "@/src/lib/theme/site-theme";
import { siteThemeTag } from "@/src/lib/theme/published-theme";

export type ThemeActionState = {
  status: "idle" | "success" | "error";
  message: string;
  errors?: string[];
  completedIntent?: "save" | "publish" | "discard";
};

function refreshThemeRoutes(siteSlug: "chacara-alto-dos-torres" | "espaco-fernandes") {
  revalidatePath("/admin/aparencia");
  revalidatePath(`/${siteSlug}`);
  revalidateTag(siteThemeTag(siteSlug), "max");
}

export async function updateSiteTheme(
  _previousState: ThemeActionState,
  formData: FormData,
): Promise<ThemeActionState> {
  const identity = await requireAdmin();
  const siteSlugValue = formData.get("siteSlug");
  const intentValue = formData.get("intent");

  if (!isEditableSiteSlug(siteSlugValue)) {
    return { status: "error", message: "Site inválido." };
  }

  if (!(intentValue === "save" || intentValue === "publish" || intentValue === "discard")) {
    return { status: "error", message: "Ação inválida." };
  }

  const siteSlug = siteSlugValue;
  const intent = intentValue;
  const supabase = await createClient();

  if (intent === "discard") {
    const { error } = await supabase
      .from("site_theme_drafts")
      .delete()
      .eq("site_slug", siteSlug);

    if (error) {
      return { status: "error", message: "Não foi possível descartar o rascunho." };
    }

    refreshThemeRoutes(siteSlug);
    return {
      status: "success",
      message: "Rascunho descartado. O editor voltou ao tema publicado.",
      completedIntent: "discard",
    };
  }

  const serializedTheme = formData.get("theme");
  if (typeof serializedTheme !== "string" || serializedTheme.length > 20_000) {
    return { status: "error", message: "O tema enviado é inválido." };
  }

  let candidate: unknown;
  try {
    candidate = JSON.parse(serializedTheme);
  } catch {
    return { status: "error", message: "O tema enviado não pôde ser lido." };
  }

  const validated = validateSiteTheme(candidate);
  if (!validated.ok) {
    return {
      status: "error",
      message: "Revise as opções indicadas antes de continuar.",
      errors: validated.errors,
    };
  }

  const { error: draftError } = await supabase.from("site_theme_drafts").upsert(
    {
      site_slug: siteSlug,
      draft_theme: validated.theme,
      updated_at: new Date().toISOString(),
      updated_by: identity.userId,
    },
    { onConflict: "site_slug" },
  );

  if (draftError) {
    return { status: "error", message: "Não foi possível salvar o rascunho do tema." };
  }

  if (intent === "publish") {
    const { error: publishError } = await supabase.rpc("publish_site_theme", {
      p_site_slug: siteSlug,
    });

    if (publishError) {
      return {
        status: "error",
        message: "O rascunho foi salvo, mas não pôde ser publicado.",
      };
    }

    refreshThemeRoutes(siteSlug);
    return {
      status: "success",
      message: "Tema publicado com sucesso.",
      completedIntent: "publish",
    };
  }

  revalidatePath("/admin/aparencia");
  return {
    status: "success",
    message: "Rascunho salvo. O site público continua sem alterações.",
    completedIntent: "save",
  };
}
