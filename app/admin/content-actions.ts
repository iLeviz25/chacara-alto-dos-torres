"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin } from "@/src/lib/admin-auth";
import { validateAndMergeEditableContent } from "@/src/lib/content/editable-content";
import {
  EDITABLE_SITE_SLUGS,
  siteContentTag,
  type EditableSiteSlug,
  type SiteContentMap,
} from "@/src/lib/content/site-content";
import { createClient } from "@/src/lib/supabase/server";

export type ContentActionState = {
  status: "idle" | "success" | "error";
  message: string;
  errors?: string[];
  completedIntent?: "save" | "publish" | "discard";
};

function validSiteSlug(value: FormDataEntryValue | null): value is EditableSiteSlug {
  return typeof value === "string" && EDITABLE_SITE_SLUGS.includes(value as EditableSiteSlug);
}

function refreshContentRoutes(siteSlug: EditableSiteSlug) {
  revalidatePath(`/admin/${siteSlug}`);
  revalidatePath(`/${siteSlug}`);
  revalidateTag(siteContentTag(siteSlug), "max");
}

export async function updateSiteContent(
  _previousState: ContentActionState,
  formData: FormData,
): Promise<ContentActionState> {
  const identity = await requireAdmin();
  const siteSlugValue = formData.get("siteSlug");
  const intentValue = formData.get("intent");

  if (!validSiteSlug(siteSlugValue)) {
    return { status: "error", message: "Site inválido." };
  }

  if (!(["save", "publish", "discard"] as const).includes(intentValue as "save" | "publish" | "discard")) {
    return { status: "error", message: "Ação inválida." };
  }

  const siteSlug = siteSlugValue;
  const intent = intentValue as "save" | "publish" | "discard";
  const supabase = await createClient();

  if (intent === "discard") {
    const { error } = await supabase
      .from("site_content_drafts")
      .delete()
      .eq("site_slug", siteSlug);

    if (error) {
      return { status: "error", message: "Não foi possível descartar o rascunho." };
    }

    refreshContentRoutes(siteSlug);
    return {
      status: "success",
      message: "Rascunho descartado. O editor voltou ao conteúdo publicado.",
      completedIntent: "discard",
    };
  }

  const serializedContent = formData.get("content");
  if (typeof serializedContent !== "string" || serializedContent.length > 300_000) {
    return { status: "error", message: "O conteúdo enviado é inválido." };
  }

  let candidate: unknown;
  try {
    candidate = JSON.parse(serializedContent);
  } catch {
    return { status: "error", message: "O conteúdo enviado não pôde ser lido." };
  }

  const { data: current, error: currentError } = await supabase
    .from("site_content")
    .select("published_content")
    .eq("site_slug", siteSlug)
    .single();

  if (currentError || !current) {
    return { status: "error", message: "Não foi possível carregar a versão publicada." };
  }

  const base = current.published_content as SiteContentMap[typeof siteSlug];
  const validated = validateAndMergeEditableContent(siteSlug, base, candidate);
  if (!validated.ok) {
    return {
      status: "error",
      message: "Revise os campos indicados antes de continuar.",
      errors: validated.errors,
    };
  }

  const { error: draftError } = await supabase.from("site_content_drafts").upsert(
    {
      site_slug: siteSlug,
      draft_content: validated.content,
      updated_at: new Date().toISOString(),
      updated_by: identity.userId,
    },
    { onConflict: "site_slug" },
  );

  if (draftError) {
    return { status: "error", message: "Não foi possível salvar o rascunho." };
  }

  if (intent === "publish") {
    const { error: publishError } = await supabase.rpc("publish_site_content", {
      p_site_slug: siteSlug,
    });

    if (publishError) {
      return { status: "error", message: "O rascunho foi salvo, mas não pôde ser publicado." };
    }

    refreshContentRoutes(siteSlug);
    return {
      status: "success",
      message: "Alterações publicadas com sucesso.",
      completedIntent: "publish",
    };
  }

  revalidatePath(`/admin/${siteSlug}`);
  return {
    status: "success",
    message: "Rascunho salvo. O site público continua sem alterações.",
    completedIntent: "save",
  };
}
