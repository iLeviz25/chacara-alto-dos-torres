"use client";

import { useActionState } from "react";
import { LockKeyhole, Mail } from "lucide-react";
import { login } from "@/app/admin/actions";

const initialLoginState = {
  error: null as string | null,
};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    login,
    initialLoginState,
  );

  return (
    <form action={formAction} className="admin-login-form">
      <div className="admin-field">
        <label htmlFor="admin-email">E-mail</label>
        <div className="admin-input-wrap">
          <Mail aria-hidden="true" size={18} />
          <input
            id="admin-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="seuemail@exemplo.com"
            required
          />
        </div>
      </div>

      <div className="admin-field">
        <label htmlFor="admin-password">Senha</label>
        <div className="admin-input-wrap">
          <LockKeyhole aria-hidden="true" size={18} />
          <input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Digite sua senha"
            required
          />
        </div>
      </div>

      {state.error ? (
        <p className="admin-form-message admin-form-message-error" role="alert">
          {state.error}
        </p>
      ) : null}

      <button className="admin-primary-button" disabled={pending} type="submit">
        {pending ? "Validando acesso..." : "Entrar no painel"}
      </button>
    </form>
  );
}
