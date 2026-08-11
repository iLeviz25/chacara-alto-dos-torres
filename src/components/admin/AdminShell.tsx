import { ChevronDown, LogOut, Menu, ShieldCheck } from "lucide-react";
import { logout } from "@/app/admin/actions";
import type { AdminIdentity } from "@/src/lib/admin-auth";
import { AdminNavigation } from "./AdminNavigation";

type AdminShellProps = {
  identity: AdminIdentity;
  children: React.ReactNode;
};

export function AdminShell({ identity, children }: AdminShellProps) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-brand-mark" aria-hidden="true">
            <ShieldCheck size={22} />
          </span>
          <span>
            <strong>Painel dos sites</strong>
            <small>Administração</small>
          </span>
        </div>
        <AdminNavigation />
        <div className="admin-sidebar-note">
          <span className="admin-status-dot" aria-hidden="true" />
          Base segura conectada
        </div>
      </aside>

      <div className="admin-workspace">
        <header className="admin-topbar">
          <details className="admin-mobile-menu">
            <summary aria-label="Abrir menu administrativo">
              <Menu aria-hidden="true" size={21} />
              <span>Menu</span>
            </summary>
            <div className="admin-mobile-menu-panel">
              <AdminNavigation />
            </div>
          </details>

          <div className="admin-topbar-spacer" />

          <details className="admin-user-menu">
            <summary>
              <span className="admin-avatar" aria-hidden="true">
                {identity.displayName.slice(0, 1).toUpperCase()}
              </span>
              <span className="admin-user-copy">
                <strong>{identity.displayName}</strong>
                <small>{identity.email}</small>
              </span>
              <ChevronDown aria-hidden="true" size={16} />
            </summary>
            <div className="admin-user-popover">
              <p>Conta administrativa</p>
              <form action={logout}>
                <button type="submit">
                  <LogOut aria-hidden="true" size={17} />
                  Sair
                </button>
              </form>
            </div>
          </details>
        </header>

        <main className="admin-main" id="conteudo-admin">
          {children}
        </main>
      </div>
    </div>
  );
}
