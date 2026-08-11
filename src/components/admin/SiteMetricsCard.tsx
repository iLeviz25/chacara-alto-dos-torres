import { Eye, Images, MessageCircle, Play } from "lucide-react";
import type {
  AnalyticsEventName,
  AnalyticsSite,
  AnalyticsSummary,
} from "@/src/lib/analytics/types";

const formatter = new Intl.NumberFormat("pt-BR");

export function getMetricCount(
  summary: AnalyticsSummary,
  site: AnalyticsSite,
  eventName: AnalyticsEventName,
) {
  return (
    summary.totals.find(
      (row) => row.site === site && row.event_name === eventName,
    )?.count ?? 0
  );
}

export function SiteMetricsCard({
  summary,
  site,
  name,
  tone,
}: {
  summary: AnalyticsSummary;
  site: AnalyticsSite;
  name: string;
  tone: "green" | "orange";
}) {
  const items = [
    { label: "Visualizações", event: "page_view" as const, icon: Eye },
    {
      label: "Cliques no WhatsApp",
      event: "whatsapp_click" as const,
      icon: MessageCircle,
    },
    { label: "Reproduções de vídeo", event: "video_play" as const, icon: Play },
    { label: "Aberturas da galeria", event: "gallery_open" as const, icon: Images },
  ];

  return (
    <article className={`admin-site-metrics admin-site-metrics-${tone}`}>
      <header>
        <p>Desempenho</p>
        <h2>{name}</h2>
      </header>
      <div className="admin-site-metric-grid">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.event}>
              <Icon aria-hidden="true" size={18} />
              <strong>{formatter.format(getMetricCount(summary, site, item.event))}</strong>
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </article>
  );
}
