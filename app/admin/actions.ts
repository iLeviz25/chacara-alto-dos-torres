"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";

type LoginState = {
  error: string | null;
};

export async function login(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return { error: "Preencha o e-mail e a senha." };
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    return { error: "Preencha o e-mail e a senha." };
  }

  const supabase = await createClient();
  const { error: loginError } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });

  if (loginError) {
    return { error: "E-mail ou senha inválidos." };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    await supabase.auth.signOut();
    return { error: "Sua sessão não pôde ser validada. Tente novamente." };
  }

  const { data: admin, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (adminError || !admin) {
    await supabase.auth.signOut();
    return {
      error: "Esta conta não possui permissão para acessar o painel.",
    };
  }

  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login?motivo=saiu");
}
