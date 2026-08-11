import Link from "next/link";
import { BarChart3, Eye, Images, Instagram, MessageCircle, MonitorSmartphone, Play } from "lucide-react";
import { getMetricCount } from "@/src/components/admin/SiteMetricsCard";
import {
  analyticsPeriodOptions,
  getAnalyticsSummary,
  type AnalyticsPeriod,
} from "@/src/lib/analytics/admin";
import type { AnalyticsSite } from "@/src/lib/analytics/types";

const formatter = new Intl.NumberFormat("pt-BR");
const percentFormatter = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 1,
});

const siteNames: Record<AnalyticsSite, string> = {
  "chacara-alto-dos-torres": "Chácara",
  "espaco-fernandes": "Espaço Fernandes",
  hub: "Hub",
};

const originNames: Record<string, string> = {
  hero: "Hero",
  contato: "Contato",
  "cta-final": "CTA final",
  "botao-flutuante": "Botão flutuante",
  cabecalho: "Cabeçalho",
  rodape: "Rodapé",
};

function conversion(clicks: number, views: number) {
  return views > 0 ? clicks / views : 0;
}

function countWithLabel(count: number, singular: string, plural: string) {
  return `${formatter.format(count)} ${count === 1 ? singular : plural}`;
}

function aggregate<T>(rows: T[], key: (row: T) => string, value: (row: T) => number) {
  const totals = new Map<string, number>();
  rows.forEach((row) => totals.set(key(row), (totals.get(key(row)) || 0) + value(row)));
  return [...totals.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((first, second) => second.count - first.count);
}

function BarList({
  rows,
  emptyLabel,
}: {
  rows: Array<{ label: string; count: number; detail?: string }>;
  emptyLabel: string;
}) {
  const maximum = Math.max(...rows.map((row) => row.count), 1);
  if (rows.length === 0) return <p className="admin-chart-empty">{emptyLabel}</p>;

  return (
    <div className="admin-bar-list">
      {rows.map((row) => (
        <div className="admin-bar-row" key={`${row.label}-${row.detail || ""}`}>
          <div>
            <span>{row.label}</span>
            {row.detail ? <small>{row.detail}</small> : null}
            <strong>{formatter.format(row.count)}</strong>
          </div>
          <span className="admin-bar-track" aria-hidden="true">
            <span style={{ width: `${Math.max((row.count / maximum) * 100, 2)}%` }} />
          </span>
        </div>
      ))}
    </div>
  );
}

export default async function MetricsPage({
  searchParams,
}: {
  searchParams: Promise<{ periodo?: string }>;
}) {
  const params = await searchParams;
  const requested = params.periodo as AnalyticsPeriod | undefined;
  const period = analyticsPeriodOptions.some((option) => option.value === requested)
    ? requested!
    : "30d";
  const { summary, available } = await getAnalyticsSummary(period);

  const sites: AnalyticsSite[] = ["chacara-alto-dos-torres", "espaco-fernandes"];
  const comparison = sites.map((site) => {
    const views = getMetricCount(summary, site, "page_view");
    const whatsapp = getMetricCount(summary, site, "whatsapp_click");
    return { site, views, whatsapp, rate: conversion(whatsapp, views) };
  });

  const overall = {
    views: comparison.reduce((total, item) => total + item.views, 0),
    whatsapp: comparison.reduce((total, item) => total + item.whatsapp, 0),
    video: sites.reduce((total, site) => total + getMetricCount(summary, site, "video_play"), 0),
    gallery: sites.reduce((total, site) => total + getMetricCount(summary, site, "gallery_open"), 0),
    instagram: sites.reduce((total, site) => total + getMetricCount(summary, site, "instagram_click"), 0),
  };

  const devices = aggregate(summary.devices, (row) => row.device, (row) => row.count).map(
    (row) => ({
      ...row,
      label: { mobile: "Celular", tablet: "Tablet", desktop: "Computador" }[row.label] || row.label,
    }),
  );
  const referrers = aggregate(summary.referrers, (row) => row.referrer, (row) => row.count);
  const origins = aggregate(
    summary.whatsappOrigins,
    (row) => row.origin,
    (row) => row.count,
  ).map((row) => ({ ...row, label: originNames[row.label] || row.label }));
  const campaigns = summary.campaigns.map((row) => ({
    label: row.utm_campaign,
    detail: `${row.utm_source} · ${row.utm_medium} · ${siteNames[row.site]}`,
    count: row.count,
  }));

  const overviewCards = [
    { label: "Visualizações", value: overall.views, icon: Eye },
    { label: "Cliques no WhatsApp", value: overall.whatsapp, icon: MessageCircle },
    { label: "Conversão para WhatsApp", value: conversion(overall.whatsapp, overall.views), icon: BarChart3, percentage: true },
    { label: "Reproduções de vídeo", value: overall.video, icon: Play },
    { label: "Aberturas da galeria", value: overall.gallery, icon: Images },
    { label: "Cliques no Instagram", value: overall.instagram, icon: Instagram },
  ];

  return (
    <div className="admin-page-stack">
      <header className="admin-page-header admin-metrics-header">
        <div>
          <p>Métricas</p>
          <h1>Desempenho dos sites</h1>
          <span>Visualizações e interações anônimas, sem armazenamento de IP bruto.</span>
        </div>
        <nav aria-label="Período das métricas" className="admin-period-filter">
          {analyticsPeriodOptions.map((option) => (
            <Link
              className={period === option.value ? "is-active" : ""}
              href={`/admin/metricas?periodo=${option.value}`}
              key={option.value}
            >
              {option.label}
            </Link>
          ))}
        </nav>
      </header>

      {!available ? (
        <p className="admin-data-notice" role="status">
          As métricas estão temporariamente indisponíveis. Tente novamente em instantes.
        </p>
      ) : null}

      <section className="admin-kpi-grid" aria-label="Indicadores principais">
        {overviewCards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.label}>
              <span aria-hidden="true"><Icon size={19} /></span>
              <p>{card.label}</p>
              <strong>
                {card.percentage
                  ? percentFormatter.format(card.value)
                  : formatter.format(card.value)}
              </strong>
            </article>
          );
        })}
      </section>

      <section className="admin-comparison-panel">
        <header>
          <p>Comparação dos sites</p>
          <h2>Qual página está gerando mais contatos?</h2>
        </header>
        <div className="admin-comparison-grid">
          {comparison.map((item) => (
            <article key={item.site}>
              <span>{siteNames[item.site]}</span>
              <strong>{countWithLabel(item.views, "visualização", "visualizações")}</strong>
              <p>{countWithLabel(item.whatsapp, "clique", "cliques")} no WhatsApp</p>
              <em>{percentFormatter.format(item.rate)} de conversão</em>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-chart-grid">
        <article className="admin-chart-card">
          <header><MonitorSmartphone aria-hidden="true" size={20} /><h2>Dispositivos</h2></header>
          <BarList rows={devices} emptyLabel="Nenhum dispositivo registrado no período." />
        </article>
        <article className="admin-chart-card">
          <header><Eye aria-hidden="true" size={20} /><h2>Origem dos visitantes</h2></header>
          <BarList rows={referrers} emptyLabel="Nenhuma origem registrada no período." />
        </article>
        <article className="admin-chart-card">
          <header><MessageCircle aria-hidden="true" size={20} /><h2>Origem dos cliques no WhatsApp</h2></header>
          <BarList rows={origins} emptyLabel="Nenhum clique no WhatsApp no período." />
        </article>
        <article className="admin-chart-card">
          <header><BarChart3 aria-hidden="true" size={20} /><h2>Campanhas UTM</h2></header>
          <BarList rows={campaigns} emptyLabel="Nenhuma campanha UTM registrada no período." />
        </article>
      </section>

      <section className="admin-site-table-card">
        <h2>Indicadores por site</h2>
        <div className="admin-table-scroll">
          <table>
            <thead>
              <tr><th>Site</th><th>Visualizações</th><th>WhatsApp</th><th>Conversão</th><th>Vídeo</th><th>Galeria</th><th>Instagram</th></tr>
            </thead>
            <tbody>
              {sites.map((site) => {
                const views = getMetricCount(summary, site, "page_view");
                const whatsapp = getMetricCount(summary, site, "whatsapp_click");
                return (
                  <tr key={site}>
                    <th>{siteNames[site]}</th>
                    <td>{formatter.format(views)}</td>
                    <td>{formatter.format(whatsapp)}</td>
                    <td>{percentFormatter.format(conversion(whatsapp, views))}</td>
                    <td>{formatter.format(getMetricCount(summary, site, "video_play"))}</td>
                    <td>{formatter.format(getMetricCount(summary, site, "gallery_open"))}</td>
                    <td>{formatter.format(getMetricCount(summary, site, "instagram_click"))}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
