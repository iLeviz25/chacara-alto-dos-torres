"use client";

import {
  Check,
  Eye,
  ExternalLink,
  Monitor,
  Palette,
  RotateCcw,
  Smartphone,
} from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  updateSiteTheme,
  type ThemeActionState,
} from "@/app/admin/theme-actions";
import type { SiteThemeEditorState } from "@/src/lib/theme/admin-theme";
import {
  BODY_FONT_OPTIONS,
  BUTTON_RADIUS_OPTIONS,
  CARD_RADIUS_OPTIONS,
  DEFAULT_SITE_THEMES,
  HEADING_FONT_OPTIONS,
  SHADOW_OPTIONS,
  themeCssProperties,
  themesAreEqual,
  type SiteTheme,
} from "@/src/lib/theme/site-theme";

const initialActionState: ThemeActionState = { status: "idle", message: "" };

function cloneTheme(theme: SiteTheme) {
  return structuredClone(theme);
}

function formatDate(value: string | null) {
  if (!value) return "Ainda não registrada";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(value));
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="admin-theme-color-field">
      <span>{label}</span>
      <span>
        <input
          aria-label={`Selecionar ${label.toLowerCase()}`}
          onChange={(event) => onChange(event.target.value.toLowerCase())}
          type="color"
          value={value}
        />
        <input
          maxLength={7}
          onChange={(event) => onChange(event.target.value.toLowerCase())}
          pattern="#[0-9a-fA-F]{6}"
          spellCheck={false}
          type="text"
          value={value}
        />
      </span>
    </label>
  );
}

function ThemePreview({
  site,
  theme,
  device,
}: {
  site: SiteThemeEditorState;
  theme: SiteTheme;
  device: "desktop" | "mobile";
}) {
  const isChacara = site.siteSlug === "chacara-alto-dos-torres";
  return (
    <div
      className={`admin-theme-preview-canvas is-${device}`}
      data-animations={theme.animations ? "on" : "off"}
      style={themeCssProperties(theme)}
    >
      <div className="admin-theme-preview-sitebar">
        <span aria-hidden="true" />
        <strong>{site.displayName}</strong>
        <small>{isChacara ? "À venda" : "Locação por diária"}</small>
      </div>
      <div className="admin-theme-preview-hero">
        <p>{isChacara ? "Serra de Uibaí" : "Formosa, Uibaí"}</p>
        <h3>{isChacara ? "Natureza, produção e tranquilidade" : "Seu dia merece um espaço especial"}</h3>
        <span>Esta prévia mostra cores, fontes, botões, cards e sombras.</span>
        <button type="button">Botão principal</button>
      </div>
      <div className="admin-theme-preview-cards">
        <article><Check size={17} /><strong>Primeiro destaque</strong><span>Informação apresentada com clareza.</span></article>
        <article><Check size={17} /><strong>Segundo destaque</strong><span>Superfície e sombra do tema.</span></article>
      </div>
    </div>
  );
}

function ThemeSiteEditor({ state, active }: { state: SiteThemeEditorState; active: boolean }) {
  const router = useRouter();
  const [theme, setTheme] = useState(() => cloneTheme(state.theme));
  const [previewVisible, setPreviewVisible] = useState(true);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [actionState, formAction, pending] = useActionState(updateSiteTheme, initialActionState);
  const defaultTheme = DEFAULT_SITE_THEMES[state.siteSlug];
  const hasLocalChanges = !themesAreEqual(theme, state.theme);

  useEffect(() => {
    if (actionState.status !== "success") return;
    if (actionState.completedIntent === "discard") {
      window.location.reload();
      return;
    }
    router.refresh();
  }, [actionState, router]);

  function update(mutator: (next: SiteTheme) => void) {
    setTheme((current) => {
      const next = cloneTheme(current);
      mutator(next);
      return next;
    });
  }

  return (
    <form action={formAction} className="admin-theme-editor" hidden={!active}>
      <input name="siteSlug" type="hidden" value={state.siteSlug} />
      <input name="theme" type="hidden" value={JSON.stringify(theme)} />

      <header className="admin-theme-site-header">
        <div>
          <p>Tema independente</p>
          <h2>{state.displayName}</h2>
          <span>As alterações abaixo só entram no site depois de publicadas.</span>
        </div>
        <a href={`/${state.siteSlug}`} rel="noreferrer" target="_blank">
          Abrir site <ExternalLink size={16} />
        </a>
      </header>

      <div className="admin-editor-status-grid">
        <div>
          <span className={state.hasDraft || hasLocalChanges ? "is-draft" : "is-published"}>
            {state.hasDraft || hasLocalChanges ? "Alterações ainda não publicadas" : "Tema publicado"}
          </span>
          <small>{state.hasDraft ? `Rascunho salvo em ${formatDate(state.draftUpdatedAt)}` : "Nenhum rascunho salvo"}</small>
        </div>
        <div><strong>Última publicação</strong><small>{formatDate(state.publishedAt)}</small></div>
      </div>

      {actionState.status !== "idle" ? (
        <div className={`admin-editor-feedback is-${actionState.status}`} role="status">
          <strong>{actionState.message}</strong>
          {actionState.errors?.length ? <ul>{actionState.errors.map((error) => <li key={error}>{error}</li>)}</ul> : null}
        </div>
      ) : null}

      <div className="admin-theme-workspace">
        <div className="admin-theme-controls">
          <section>
            <header><Palette size={19} /><div><h3>Cores</h3><p>Escolha cores sólidas e legíveis para cada função.</p></div></header>
            <div className="admin-theme-color-grid">
              <ColorField label="Cor principal" value={theme.colors.primary} onChange={(value) => update((next) => { next.colors.primary = value; })} />
              <ColorField label="Cor de destaque" value={theme.colors.accent} onChange={(value) => update((next) => { next.colors.accent = value; })} />
              <ColorField label="Fundo" value={theme.colors.background} onChange={(value) => update((next) => { next.colors.background = value; })} />
              <ColorField label="Cards e superfícies" value={theme.colors.surface} onChange={(value) => update((next) => { next.colors.surface = value; })} />
              <ColorField label="Textos" value={theme.colors.text} onChange={(value) => update((next) => { next.colors.text = value; })} />
            </div>
          </section>

          <section>
            <header><div><h3>Tipografia</h3><p>Opções testadas para títulos e textos.</p></div></header>
            <div className="admin-editor-grid">
              <label className="admin-editor-field"><span>Fonte dos títulos</span><select value={theme.fonts.heading} onChange={(event) => update((next) => { next.fonts.heading = event.target.value as SiteTheme["fonts"]["heading"]; })}>{HEADING_FONT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
              <label className="admin-editor-field"><span>Fonte dos textos</span><select value={theme.fonts.body} onChange={(event) => update((next) => { next.fonts.body = event.target.value as SiteTheme["fonts"]["body"]; })}>{BODY_FONT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
            </div>
          </section>

          <section>
            <header><div><h3>Formas e profundidade</h3><p>Ajustes controlados para manter o layout consistente.</p></div></header>
            <div className="admin-editor-grid">
              <label className="admin-editor-field"><span>Arredondamento dos cards</span><select value={theme.radius.cards} onChange={(event) => update((next) => { next.radius.cards = event.target.value as SiteTheme["radius"]["cards"]; })}>{CARD_RADIUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
              <label className="admin-editor-field"><span>Arredondamento dos botões</span><select value={theme.radius.buttons} onChange={(event) => update((next) => { next.radius.buttons = event.target.value as SiteTheme["radius"]["buttons"]; })}>{BUTTON_RADIUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
              <label className="admin-editor-field"><span>Intensidade das sombras</span><select value={theme.shadows} onChange={(event) => update((next) => { next.shadows = event.target.value as SiteTheme["shadows"]; })}>{SHADOW_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
            </div>
            <label className="admin-editor-toggle admin-theme-animation-toggle">
              <input checked={theme.animations} onChange={(event) => update((next) => { next.animations = event.target.checked; })} type="checkbox" />
              <span aria-hidden="true" /><strong>Animações ligadas</strong><small>Ao desligar, transições e movimentos decorativos são removidos.</small>
            </label>
          </section>

          <button className="admin-theme-restore" onClick={() => { if (window.confirm("Restaurar todas as opções deste site para o tema padrão?")) setTheme(cloneTheme(defaultTheme)); }} type="button"><RotateCcw size={17} /> Restaurar tema padrão</button>
        </div>

        <aside className="admin-theme-preview-panel">
          <header>
            <div><p>Prévia segura</p><h3>Visualizar alterações</h3></div>
            <button aria-expanded={previewVisible} onClick={() => setPreviewVisible((value) => !value)} type="button"><Eye size={17} /> {previewVisible ? "Ocultar" : "Mostrar"}</button>
          </header>
          {previewVisible ? (
            <>
              <div className="admin-theme-device-switch" aria-label="Tamanho da prévia" role="group">
                <button className={previewDevice === "desktop" ? "is-active" : ""} onClick={() => setPreviewDevice("desktop")} type="button"><Monitor size={16} /> Desktop</button>
                <button className={previewDevice === "mobile" ? "is-active" : ""} onClick={() => setPreviewDevice("mobile")} type="button"><Smartphone size={16} /> Celular</button>
              </div>
              <ThemePreview device={previewDevice} site={state} theme={theme} />
              <p className="admin-theme-preview-note">A prévia não altera o site público.</p>
            </>
          ) : null}
        </aside>
      </div>

      <div className="admin-editor-actionbar admin-theme-actionbar">
        <div><strong>Pronto para continuar?</strong><small>Salvar rascunho mantém o site público como está.</small></div>
        <div>
          {state.hasDraft ? <button className="admin-editor-button is-secondary" disabled={pending} name="intent" type="submit" value="discard">Descartar</button> : null}
          <button className="admin-editor-button is-secondary" disabled={pending} name="intent" type="submit" value="save">Salvar rascunho</button>
          <button className="admin-editor-button is-primary" disabled={pending} name="intent" onClick={(event) => { if (!window.confirm("Publicar este tema no site?")) event.preventDefault(); }} type="submit" value="publish">Publicar</button>
        </div>
      </div>
    </form>
  );
}

export function AppearanceEditor({ states }: { states: SiteThemeEditorState[] }) {
  const [activeSite, setActiveSite] = useState(states[0]?.siteSlug ?? "chacara-alto-dos-torres");
  return (
    <div className="admin-page-stack admin-theme-page">
      <header className="admin-page-header"><p>Aparência</p><h1>Identidade visual</h1><span>Personalize cada projeto com opções seguras. O layout e a responsividade permanecem protegidos.</span></header>
      <nav aria-label="Escolher projeto" className="admin-theme-tabs">
        {states.map((state) => <button className={activeSite === state.siteSlug ? "is-active" : ""} key={state.siteSlug} onClick={() => setActiveSite(state.siteSlug)} type="button">{state.displayName}</button>)}
      </nav>
      {states.map((state) => <ThemeSiteEditor active={activeSite === state.siteSlug} key={state.siteSlug} state={state} />)}
    </div>
  );
}
