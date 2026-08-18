import Link from "next/link";
import {
  Activity,
  AtSign,
  BarChart3,
  CheckCircle2,
  Database,
  ExternalLink,
  Globe2,
  HardDrive,
  Instagram,
  LogOut,
  MessageCircle,
  Settings2,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { logout } from "@/app/admin/actions";
import { requireAdmin } from "@/src/lib/admin-auth";
import { getAnalyticsSummary } from "@/src/lib/analytics/admin";
import { getSiteEditorState } from "@/src/lib/content/admin-site-content";
import { getAdminSystemStatus } from "@/src/lib/admin/system-status";

function formatDate(value: string | null) {
  if (!value) return "Não disponível";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(value));
}

function StatusItem({
  icon: Icon,
  label,
  value,
  healthy = true,
}: {
  icon: typeof Database;
  label: string;
  value: string;
  healthy?: boolean;
}) {
  return (
    <div className="admin-settings-status-item">
      <span aria-hidden="true"><Icon size={19} /></span>
      <div><strong>{label}</strong><small>{value}</small></div>
      <em className={healthy ? "is-healthy" : "is-warning"}>
        {healthy ? "Ativo" : "Verificar"}
      </em>
    </div>
  );
}

export default async function SettingsAdminPage() {
  const identity = await requireAdmin();
  const [chacaraState, espacoState, analytics, system] = await Promise.all([
    getSiteEditorState("chacara-alto-dos-torres"),
    getSiteEditorState("espaco-fernandes"),
    getAnalyticsSummary("all"),
    getAdminSystemStatus(),
  ]);

  const chacara = chacaraState.publishedContent;
  const espaco = espacoState.publishedContent;
  const sites = [
    {
      name: chacaraState.displayName,
      route: "/chacara-alto-dos-torres",
      url: chacara.seo.canonicalUrl,
      publishedAt: chacaraState.publishedAt,
      editor: "/admin/chacara-alto-dos-torres",
    },
    {
      name: espacoState.displayName,
      route: "/espaco-fernandes",
      url: espaco.seo.canonicalUrl,
      publishedAt: espacoState.publishedAt,
      editor: "/admin/espaco-fernandes",
    },
  ];

  const contacts = [
    {
      name: chacaraState.displayName,
      whatsapp: `+${chacara.contact.whatsapp.countryCode} ${chacara.contact.whatsapp.number}`,
      email: chacara.contact.email,
      instagram: null,
      editor: "/admin/chacara-alto-dos-torres",
    },
    {
      name: espacoState.displayName,
      whatsapp: `+${espaco.contact.whatsapp.countryCode} ${espaco.contact.whatsapp.number}`,
      email: espaco.contact.email.address,
      instagram: espaco.contact.instagram.url,
      editor: "/admin/espaco-fernandes",
    },
  ];

  const totalEvents = analytics.summary.totals.reduce((sum, row) => sum + row.count, 0);

  return (
    <div className="admin-page-stack admin-settings-page">
      <header className="admin-page-header">
        <p>Configurações</p>
        <h1>Central do sistema</h1>
        <span>Consulte os projetos, contatos, métricas e serviços conectados em um só lugar.</span>
      </header>

      <section className="admin-settings-section" aria-labelledby="settings-sites">
        <header><span aria-hidden="true"><Globe2 size={20} /></span><div><p>Sites</p><h2 id="settings-sites">Projetos publicados</h2></div></header>
        <div className="admin-settings-site-grid">
          {sites.map((site) => (
            <article key={site.route}>
              <div className="admin-settings-card-heading">
                <span className="admin-settings-live"><CheckCircle2 size={15} /> Publicado</span>
                <small>Atualizado em {formatDate(site.publishedAt)}</small>
              </div>
              <h3>{site.name}</h3>
              <code>{site.url ?? site.route}</code>
              <div className="admin-settings-links">
                <Link href={site.route} target="_blank">Visualizar <ExternalLink size={15} /></Link>
                <Link href={site.editor}>Editar conteúdo</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-settings-section" aria-labelledby="settings-contacts">
        <header><span aria-hidden="true"><AtSign size={20} /></span><div><p>Contatos</p><h2 id="settings-contacts">Canais publicados</h2></div></header>
        <p className="admin-settings-intro">Estes dados vêm diretamente do conteúdo publicado. Para alterá-los, abra o editor do projeto correspondente.</p>
        <div className="admin-settings-contact-list">
          {contacts.map((contact) => (
            <article key={contact.name}>
              <div><h3>{contact.name}</h3><Link href={contact.editor}>Abrir editor</Link></div>
              <dl>
                <div><dt><MessageCircle size={16} /> WhatsApp</dt><dd>{contact.whatsapp}</dd></div>
                {contact.email ? <div><dt><AtSign size={16} /> E-mail</dt><dd>{contact.email}</dd></div> : null}
                {contact.instagram ? <div><dt><Instagram size={16} /> Instagram</dt><dd><a href={contact.instagram} rel="noreferrer" target="_blank">Abrir perfil</a></dd></div> : null}
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-settings-section admin-settings-analytics" aria-labelledby="settings-analytics">
        <header><span aria-hidden="true"><BarChart3 size={20} /></span><div><p>Analytics</p><h2 id="settings-analytics">Métricas dos sites</h2></div></header>
        <div className="admin-settings-summary-card">
          <div><Activity size={22} /><span><strong>{new Intl.NumberFormat("pt-BR").format(totalEvents)}</strong><small>eventos registrados no total</small></span></div>
          <ul aria-label="Eventos acompanhados"><li>Visualizações</li><li>WhatsApp</li><li>Vídeos</li><li>Galeria</li><li>Instagram</li></ul>
          <Link href="/admin/metricas">Ver painel de métricas <ExternalLink size={16} /></Link>
        </div>
        {!analytics.available ? <p className="admin-data-notice">As métricas estão temporariamente indisponíveis.</p> : null}
      </section>

      <div className="admin-settings-two-columns">
        <section className="admin-settings-section" aria-labelledby="settings-administration">
          <header><span aria-hidden="true"><ShieldCheck size={20} /></span><div><p>Administração</p><h2 id="settings-administration">Sua conta</h2></div></header>
          <div className="admin-settings-account">
            <span className="admin-settings-account-avatar" aria-hidden="true"><UserRound size={24} /></span>
            <div><strong>{identity.displayName}</strong><a href={`mailto:${identity.email}`}>{identity.email}</a><small>Último acesso: {formatDate(identity.lastSignInAt)}</small></div>
          </div>
          <p className="admin-settings-intro">A estrutura está pronta para mais administradores, sempre com autorização individual e sem cadastro público.</p>
          <form action={logout}><button className="admin-settings-logout" type="submit"><LogOut size={17} /> Sair do painel</button></form>
        </section>

        <section className="admin-settings-section" aria-labelledby="settings-system">
          <header><span aria-hidden="true"><Settings2 size={20} /></span><div><p>Sistema</p><h2 id="settings-system">Serviços conectados</h2></div></header>
          <div className="admin-settings-status-list">
            <StatusItem healthy={system.database} icon={Database} label="Supabase" value="Banco de dados e autenticação" />
            <StatusItem healthy={system.storage} icon={HardDrive} label="Storage" value="Biblioteca de imagens e vídeos" />
            <StatusItem icon={Globe2} label="Ambiente" value={system.environment} />
            <StatusItem icon={Settings2} label="Versão" value={`${system.version}${system.deploy ? ` · deploy ${system.deploy}` : ""}`} />
          </div>
          <p className="admin-settings-security-note"><ShieldCheck size={16} /> Nenhuma chave privada ou credencial é exibida nesta página.</p>
        </section>
      </div>
    </div>
  );
}
