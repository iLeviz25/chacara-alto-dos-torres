import { createClient } from "@/src/lib/supabase/server";

export type AdminSystemStatus = {
  database: boolean;
  storage: boolean;
  environment: string;
  version: string;
  deploy: string | null;
};

export async function getAdminSystemStatus(): Promise<AdminSystemStatus> {
  const supabase = await createClient();
  const [{ error: databaseError }, { error: storageError }] = await Promise.all([
    supabase.from("site_content").select("site_slug", { head: true, count: "exact" }),
    supabase.storage.from("site-media").list("", { limit: 1 }),
  ]);

  const vercelEnvironment = process.env.VERCEL_ENV;
  const environment = vercelEnvironment === "production"
    ? "Produção"
    : vercelEnvironment === "preview"
      ? "Prévia"
      : "Desenvolvimento";

  return {
    database: !databaseError,
    storage: !storageError,
    environment,
    version: process.env.npm_package_version ?? "0.1.0",
    deploy: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
  };
}
