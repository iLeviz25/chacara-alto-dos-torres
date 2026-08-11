import Link from "next/link";
import { ArrowRight, BarChart3 } from "lucide-react";
import { SiteMetricsCard, getMetricCount } from "@/src/components/admin/SiteMetricsCard";
import { getAnalyticsSummary } from "@/src/lib/analytics/admin";

const formatter = new Intl.NumberFormat("pt-BR");

export default async function AdminDashboardPage() {
  const { summary, available } = await getAnalyticsSummary("30d");
  const chacaraViews = getMetricCount(summary, "chacara-alto-dos-torres", "page_view");
  const espacoViews = getMetricCount(summary, "espaco-fernandes", "page_view");

  return (
    <div className="admin-page-stack">
      <header className="admin-page-header">
        <p>Visão geral</p>
        <h1>Desempenho dos sites</h1>
        <span>Resumo dos últimos 30 dias, com foco nas ações que geram contato.</span>
      </header>

      {!available ? (
        <p className="admin-data-notice" role="status">
          As métricas estão temporariamente indisponíveis. Tente novamente em instantes.
        </p>
      ) : null}

      <section className="admin-site-metrics-grid" aria-label="Resumo por site">
        <SiteMetricsCard
          name="Chácara Alto dos Torres"
          site="chacara-alto-dos-torres"
          summary={summary}
          tone="green"
        />
        <SiteMetricsCard
          name="Espaço Fernandes"
          site="espaco-fernandes"
          summary={summary}
          tone="orange"
        />
      </section>

      <section className="admin-comparison-compact" aria-label="Comparação de visualizações">
        <span className="admin-card-icon" aria-hidden="true"><BarChart3 size={21} /></span>
        <div>
          <p>Comparação dos sites</p>
          <strong>
            Chácara {formatter.format(chacaraViews)} × Espaço Fernandes {formatter.format(espacoViews)} visualizações
          </strong>
        </div>
        <Link href="/admin/metricas">
          Ver painel completo
          <ArrowRight aria-hidden="true" size={17} />
        </Link>
      </section>
    </div>
  );
}
