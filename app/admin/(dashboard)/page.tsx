import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  PartyPopper,
  ShieldCheck,
  Trees,
} from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="admin-page-stack">
      <header className="admin-page-header">
        <p>Visão geral</p>
        <h1>Bem-vindo ao painel dos sites</h1>
        <span>
          A base administrativa está pronta para receber métricas e conteúdo nas
          próximas etapas.
        </span>
      </header>

      <section className="admin-metric-preview" aria-label="Métricas futuras">
        <div>
          <span className="admin-card-icon" aria-hidden="true">
            <BarChart3 size={21} />
          </span>
          <p>Métricas</p>
          <strong>Próxima etapa</strong>
          <small>Espaço reservado para acessos, cliques e conversões.</small>
        </div>
        <div>
          <span className="admin-card-icon" aria-hidden="true">
            <ShieldCheck size={21} />
          </span>
          <p>Segurança</p>
          <strong>Acesso protegido</strong>
          <small>Sessão, lista de administradores e RLS ativos.</small>
        </div>
      </section>

      <section className="admin-project-grid" aria-label="Projetos administrados">
        <article className="admin-project-card admin-project-card-green">
          <span className="admin-project-icon" aria-hidden="true">
            <Trees size={25} />
          </span>
          <div>
            <p>Projeto público</p>
            <h2>Chácara Alto dos Torres</h2>
            <span>Página de divulgação da propriedade rural.</span>
          </div>
          <Link href="/chacara-alto-dos-torres" target="_blank">
            Abrir site
            <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
        </article>

        <article className="admin-project-card admin-project-card-orange">
          <span className="admin-project-icon" aria-hidden="true">
            <PartyPopper size={25} />
          </span>
          <div>
            <p>Projeto público</p>
            <h2>Espaço Fernandes</h2>
            <span>Página de divulgação do espaço para locação.</span>
          </div>
          <Link href="/espaco-fernandes" target="_blank">
            Abrir site
            <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
        </article>
      </section>
    </div>
  );
}
