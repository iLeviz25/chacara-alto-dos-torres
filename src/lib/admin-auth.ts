import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";

export type AdminIdentity = {
  userId: string;
  email: string;
  displayName: string;
  lastSignInAt: string | null;
};

export async function getAdminIdentity(): Promise<AdminIdentity | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data: admin, error: adminError } = await supabase
    .from("admin_users")
    .select("email, display_name")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (adminError || !admin) {
    return null;
  }

  const email = admin.email || user.email || "Administrador";

  return {
    userId: user.id,
    email,
    displayName: admin.display_name || email.split("@")[0],
    lastSignInAt: user.last_sign_in_at ?? null,
  };
}

export async function requireAdmin(): Promise<AdminIdentity> {
  const identity = await getAdminIdentity();

  if (!identity) {
    redirect("/admin/login?motivo=sem-permissao");
  }

  return identity;
}
