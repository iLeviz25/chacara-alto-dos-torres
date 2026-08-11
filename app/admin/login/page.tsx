import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { LoginForm } from "./LoginForm";
import { getAdminIdentity } from "@/src/lib/admin-auth";

export const metadata: Metadata = {
  title: "Login",
};

type LoginPageProps = {
  searchParams: Promise<{ motivo?: string }>;
};

const feedbackMessages: Record<string, string> = {
  saiu: "Sua sessão foi encerrada com segurança.",
  sessao: "Sua sessão expirou. Entre novamente para continuar.",
  "sem-permissao": "Esta conta não possui permissão administrativa.",
};

export default async function AdminLoginPage({
  searchParams,
}: LoginPageProps) {
  const identity = await getAdminIdentity();

  if (identity) {
    redirect("/admin");
  }

  const { motivo } = await searchParams;
  const feedback = motivo ? feedbackMessages[motivo] : null;

  return (
    <main className="admin-login-page">
      <section className="admin-login-card" aria-labelledby="admin-login-title">
        <div className="admin-login-brand" aria-hidden="true">
          <ShieldCheck size={28} />
        </div>
        <p className="admin-eyebrow">Acesso restrito</p>
        <h1 id="admin-login-title">Painel administrativo</h1>
        <p className="admin-login-intro">
          Entre com uma conta autorizada para gerenciar os projetos.
        </p>

        {feedback ? (
          <p className="admin-form-message" role="status">
            {feedback}
          </p>
        ) : null}

        <LoginForm />

        <p className="admin-login-security">
          O acesso é validado pela autenticação e pela lista privada de
          administradores.
        </p>
      </section>
    </main>
  );
}
