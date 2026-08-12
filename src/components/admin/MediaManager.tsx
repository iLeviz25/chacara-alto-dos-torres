"use client";

import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Eye,
  EyeOff,
  Film,
  ImageIcon,
  LoaderCircle,
  Plus,
  Save,
  Send,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { EditableSiteSlug } from "@/src/lib/content/site-content";
import type {
  MediaEditorState,
} from "@/src/lib/media/admin-media";
import type {
  MediaCategory,
  MediaLibraryConfig,
  MediaLibraryItem,
  ManagedMediaType,
} from "@/src/lib/media/library";

type EditableConfig = MediaLibraryConfig & { pendingDeletion?: string[] };
type UploadEntry = {
  id: string;
  name: string;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  message?: string;
};

const projectPaths: Record<EditableSiteSlug, string> = {
  "chacara-alto-dos-torres": "/chacara-alto-dos-torres",
  "espaco-fernandes": "/espaco-fernandes",
};

function clone<T>(value: T): T {
  return structuredClone(value);
}

function formatBytes(value: number) {
  if (value < 1024 * 1024) return `${Math.max(1, Math.round(value / 1024))} KB`;
  return `${(value / 1024 / 1024).toFixed(1)} MB`;
}

function safeCategoryId(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 58);
}

function MediaPreview({
  item,
  poster,
  onClose,
}: {
  item: MediaLibraryItem;
  poster: MediaLibraryItem | null;
  onClose: () => void;
}) {
  return (
    <div
      aria-label={`Visualização: ${item.title}`}
      aria-modal="true"
      className="admin-media-modal"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="dialog"
    >
      <div className="admin-media-modal-card">
        <header>
          <div>
            <strong>{item.title || item.originalName}</strong>
            <small>{item.originalName}</small>
          </div>
          <button aria-label="Fechar visualização" onClick={onClose} type="button">
            <X aria-hidden="true" />
          </button>
        </header>
        {item.type === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element -- visualização direta da biblioteca do administrador.
          <img alt={item.alt || item.title} src={item.publicUrl} />
        ) : (
          <video controls playsInline poster={poster?.publicUrl} preload="metadata" src={item.publicUrl} />
        )}
      </div>
    </div>
  );
}

function SiteMediaEditor({ state }: { state: MediaEditorState }) {
  const [config, setConfig] = useState<EditableConfig>(() => clone(state.config));
  const [publishedConfig, setPublishedConfig] = useState<EditableConfig>(() => clone(state.publishedConfig));
  const [activeType, setActiveType] = useState<ManagedMediaType>("image");
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [hasServerDraft, setHasServerDraft] = useState(state.hasDraft);
  const [uploads, setUploads] = useState<UploadEntry[]>([]);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const imageInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);
  const posterInput = useRef<HTMLInputElement>(null);

  const items = useMemo(
    () => config.items.filter((item) => item.type === activeType).sort((a, b) => a.order - b.order),
    [activeType, config.items],
  );
  const images = useMemo(() => config.items.filter((item) => item.type === "image"), [config.items]);
  const preview = config.items.find((item) => item.assetId === previewId) ?? null;
  const isUploading = uploads.some((entry) => entry.status === "pending" || entry.status === "uploading");
  const previewPoster = preview?.posterAssetId
    ? config.items.find((item) => item.assetId === preview.posterAssetId) ?? null
    : null;

  function mutate(updater: (next: EditableConfig) => void) {
    setConfig((current) => {
      const next = clone(current);
      updater(next);
      return next;
    });
    setIsDirty(true);
    setFeedback(null);
  }

  function updateItem(assetId: string, updater: (item: MediaLibraryItem, next: EditableConfig) => void) {
    mutate((next) => {
      const item = next.items.find((candidate) => candidate.assetId === assetId);
      if (item) updater(item, next);
    });
  }

  function moveItem(assetId: string, offset: number) {
    mutate((next) => {
      const ordered = next.items
        .filter((item) => item.type === activeType)
        .sort((a, b) => a.order - b.order);
      const index = ordered.findIndex((item) => item.assetId === assetId);
      const target = index + offset;
      if (index < 0 || target < 0 || target >= ordered.length) return;
      [ordered[index], ordered[target]] = [ordered[target], ordered[index]];
      ordered.forEach((item, position) => { item.order = position + 1; });
    });
  }

  function toggleActive(item: MediaLibraryItem) {
    if (item.active && (item.isPrimary || item.featured)) {
      setFeedback({
        kind: "error",
        text: item.isPrimary
          ? "Escolha outro vídeo principal antes de ocultar este arquivo."
          : "Escolha outra imagem de destaque antes de ocultar este arquivo.",
      });
      return;
    }
    updateItem(item.assetId, (target) => { target.active = !target.active; });
  }

  function toggleFeatured(assetId: string) {
    updateItem(assetId, (target, next) => {
      if (target.featured) {
        target.featured = false;
        return;
      }
      next.items.forEach((candidate) => {
        if (candidate.type === "image") candidate.featured = false;
      });
      target.featured = true;
      target.active = true;
    });
  }

  function deleteItem(item: MediaLibraryItem) {
    const usedAsPoster = config.items.some((candidate) => candidate.posterAssetId === item.assetId);
    if (item.isPrimary || item.featured || usedAsPoster) {
      setFeedback({
        kind: "error",
        text: usedAsPoster
          ? "Esta imagem é capa de um vídeo. Escolha outra capa antes de excluí-la."
          : "Remova primeiro o uso principal ou de destaque desta mídia antes de excluí-la.",
      });
      return;
    }
    if (!window.confirm("Tem certeza de que deseja excluir esta mídia?")) return;
    mutate((next) => {
      next.items = next.items.filter((candidate) => candidate.assetId !== item.assetId);
      next.pendingDeletion = [...new Set([...(next.pendingDeletion ?? []), item.assetId])];
    });
  }

  async function persist(intent: "save" | "publish" | "discard", silent = false) {
    setIsSaving(true);
    if (!silent) setFeedback(null);
    try {
      const response = await fetch("/api/admin/media/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteSlug: state.siteSlug, intent, config }),
      });
      const result = await response.json() as { error?: string; message?: string };
      if (!response.ok) throw new Error(result.error || "Não foi possível concluir a ação.");
      if (intent === "discard") {
        setConfig(clone(publishedConfig));
      }
      if (intent === "publish") {
        const justPublished = clone(config);
        delete justPublished.pendingDeletion;
        setPublishedConfig(justPublished);
        setConfig(justPublished);
      }
      setHasServerDraft(intent !== "discard" && intent !== "publish");
      setIsDirty(false);
      if (!silent) setFeedback({ kind: "success", text: result.message || "Alterações salvas." });
      return true;
    } catch (error) {
      setFeedback({ kind: "error", text: error instanceof Error ? error.message : "Ocorreu um erro." });
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function uploadFiles(files: File[], mediaType: ManagedMediaType, usage = "gallery") {
    if (files.length === 0 || isSaving || isUploading) return;
    const saved = await persist("save", true);
    if (!saved) return;
    const entries: UploadEntry[] = files.map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random()}`,
      name: file.name,
      progress: 0,
      status: "pending",
    }));
    setUploads((current) => [...entries, ...current]);
    let failedUploads = 0;
    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      const entry = entries[index];
      const metadata = {
        siteSlug: state.siteSlug,
        mediaType,
        usage,
        originalName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
      };
      let ticket: { signedUrl?: string; storagePath?: string; error?: string };
      try {
        const ticketResponse = await fetch("/api/admin/media/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "ticket", ...metadata }),
        });
        ticket = await ticketResponse.json() as typeof ticket;
        if (!ticketResponse.ok || !ticket.signedUrl || !ticket.storagePath) {
          throw new Error(ticket.error || "Não foi possível autorizar o envio.");
        }
      } catch (error) {
        failedUploads += 1;
        setUploads((current) => current.map((candidate) => candidate.id === entry.id
          ? { ...candidate, status: "error", message: error instanceof Error ? error.message : "Falha no upload." }
          : candidate));
        continue;
      }
      const uploadResult = await new Promise<{ ok: true } | { ok: false; error: string }>((resolve) => {
        const xhr = new XMLHttpRequest();
        const data = new FormData();
        data.append("cacheControl", "31536000");
        data.append("", file);
        xhr.open("PUT", ticket.signedUrl!);
        xhr.setRequestHeader("x-upsert", "false");
        xhr.upload.onprogress = (event) => {
          if (!event.lengthComputable) return;
          setUploads((current) => current.map((candidate) => candidate.id === entry.id
            ? { ...candidate, status: "uploading", progress: Math.round((event.loaded / event.total) * 100) }
            : candidate));
        };
        xhr.onload = () => {
          let payload: { error?: string } = {};
          try { payload = JSON.parse(xhr.responseText); } catch { /* mensagem padrão */ }
          resolve(xhr.status >= 200 && xhr.status < 300
            ? { ok: true }
            : { ok: false, error: payload.error || "Falha no upload." });
        };
        xhr.onerror = () => resolve({ ok: false, error: "Falha de conexão durante o upload." });
        xhr.send(data);
      });
      let result: { ok: true; item: MediaLibraryItem } | { ok: false; error: string };
      if (!uploadResult.ok) {
        result = uploadResult;
      } else {
        try {
          const finalizeResponse = await fetch("/api/admin/media/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "finalize", storagePath: ticket.storagePath, ...metadata }),
          });
          const payload = await finalizeResponse.json() as { item?: MediaLibraryItem; error?: string };
          result = finalizeResponse.ok && payload.item
            ? { ok: true, item: payload.item }
            : { ok: false, error: payload.error || "Não foi possível finalizar o upload." };
        } catch {
          result = { ok: false, error: "Falha de conexão ao finalizar o upload." };
        }
      }
      if (result.ok) {
        setConfig((current) => ({ ...current, items: [...current.items, result.item] }));
        setUploads((current) => current.map((candidate) => candidate.id === entry.id
          ? { ...candidate, status: "success", progress: 100, message: "Enviado para o rascunho" }
          : candidate));
        setIsDirty(false);
        setHasServerDraft(true);
      } else {
        failedUploads += 1;
        setUploads((current) => current.map((candidate) => candidate.id === entry.id
          ? { ...candidate, status: "error", message: result.error }
          : candidate));
      }
    }
    setFeedback(failedUploads > 0
      ? { kind: "error", text: `${failedUploads} arquivo(s) não foram enviados. Revise os avisos acima; os demais permanecem no rascunho.` }
      : { kind: "success", text: "Upload concluído. As novas mídias continuam ocultas até você ativar e publicar." });
  }

  function addCategory() {
    const label = window.prompt("Nome da nova categoria:")?.trim();
    if (!label) return;
    const baseId = safeCategoryId(label);
    let id = baseId || "categoria";
    let suffix = 2;
    while (config.categories.some((category) => category.id === id)) id = `${baseId}-${suffix++}`;
    mutate((next) => next.categories.push({ id, label, order: next.categories.length + 1, visible: true }));
  }

  function deleteCategory(category: MediaCategory) {
    if (config.items.some((item) => item.categoryId === category.id)) {
      setFeedback({ kind: "error", text: "Mova as mídias desta categoria antes de excluí-la." });
      return;
    }
    if (!window.confirm(`Excluir a categoria “${category.label}”?`)) return;
    mutate((next) => { next.categories = next.categories.filter((candidate) => candidate.id !== category.id); });
  }

  return (
    <section className="admin-media-project">
      <header className="admin-media-project-header">
        <div>
          <p>Biblioteca de mídia</p>
          <h2>{state.displayName}</h2>
          <span>{config.items.filter((item) => item.type === "image").length} fotos · {config.items.filter((item) => item.type === "video").length} vídeos</span>
        </div>
        <a href={projectPaths[state.siteSlug]} rel="noreferrer" target="_blank">
          <Eye aria-hidden="true" size={17} /> Visualizar site
        </a>
      </header>

      <div className="admin-media-status">
        <span className={hasServerDraft || isDirty ? "is-draft" : "is-published"}>
          {hasServerDraft || isDirty ? "Rascunho em edição" : "Tudo publicado"}
        </span>
        <small>As mudanças só aparecem no site depois de “Publicar”.</small>
      </div>

      {feedback ? <p className={`admin-editor-feedback is-${feedback.kind}`}>{feedback.text}</p> : null}

      <div className="admin-media-toolbar">
        <div aria-label="Tipo de mídia" className="admin-media-tabs" role="group">
          <button className={activeType === "image" ? "is-active" : ""} onClick={() => setActiveType("image")} type="button">
            <ImageIcon aria-hidden="true" size={17} /> Fotos
          </button>
          <button className={activeType === "video" ? "is-active" : ""} onClick={() => setActiveType("video")} type="button">
            <Film aria-hidden="true" size={17} /> Vídeos
          </button>
        </div>
        <div className="admin-media-upload-actions">
          {activeType === "image" ? (
            <>
              <button disabled={isUploading || isSaving} onClick={() => imageInput.current?.click()} type="button"><Upload size={17} /> Enviar fotos</button>
              <button className="is-secondary" disabled={isUploading || isSaving} onClick={() => posterInput.current?.click()} type="button"><Plus size={17} /> Enviar capa</button>
              <input accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" hidden multiple onChange={(event) => { uploadFiles(Array.from(event.target.files ?? []), "image"); event.target.value = ""; }} ref={imageInput} type="file" />
              <input accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" hidden onChange={(event) => { uploadFiles(Array.from(event.target.files ?? []), "image", "poster"); event.target.value = ""; }} ref={posterInput} type="file" />
            </>
          ) : (
            <>
              <button disabled={isUploading || isSaving} onClick={() => videoInput.current?.click()} type="button"><Upload size={17} /> Enviar vídeo</button>
              <input accept=".mp4,.webm,video/mp4,video/webm" hidden multiple onChange={(event) => { uploadFiles(Array.from(event.target.files ?? []), "video"); event.target.value = ""; }} ref={videoInput} type="file" />
            </>
          )}
        </div>
      </div>

      {uploads.length > 0 ? (
        <div className="admin-media-upload-list">
          {uploads.map((entry) => (
            <div key={entry.id}>
              <span>{entry.status === "uploading" ? <LoaderCircle className="admin-spin" size={16} /> : entry.status === "success" ? <CheckCircle2 size={16} /> : <Upload size={16} />}{entry.name}</span>
              <div><i style={{ width: `${entry.progress}%` }} /></div>
              <small>{entry.message ?? `${entry.progress}%`}</small>
            </div>
          ))}
        </div>
      ) : null}

      {activeType === "image" ? (
        <details className="admin-media-categories">
          <summary>Organizar categorias</summary>
          <div>
            {[...config.categories].sort((a, b) => a.order - b.order).map((category, index) => (
              <div key={category.id}>
                <input aria-label="Nome da categoria" onChange={(event) => mutate((next) => { const target = next.categories.find((candidate) => candidate.id === category.id); if (target) target.label = event.target.value; })} value={category.label} />
                <button aria-label={category.visible ? "Ocultar categoria" : "Mostrar categoria"} onClick={() => mutate((next) => { const target = next.categories.find((candidate) => candidate.id === category.id); if (target) target.visible = !target.visible; })} type="button">{category.visible ? <Eye size={16} /> : <EyeOff size={16} />}</button>
                <button aria-label="Mover categoria para cima" disabled={index === 0} onClick={() => mutate((next) => { const ordered = next.categories.sort((a, b) => a.order - b.order); [ordered[index - 1], ordered[index]] = [ordered[index], ordered[index - 1]]; ordered.forEach((item, position) => { item.order = position + 1; }); })} type="button"><ArrowUp size={16} /></button>
                <button aria-label="Mover categoria para baixo" disabled={index === config.categories.length - 1} onClick={() => mutate((next) => { const ordered = next.categories.sort((a, b) => a.order - b.order); [ordered[index + 1], ordered[index]] = [ordered[index], ordered[index + 1]]; ordered.forEach((item, position) => { item.order = position + 1; }); })} type="button"><ArrowDown size={16} /></button>
                <button aria-label="Excluir categoria" className="is-danger" onClick={() => deleteCategory(category)} type="button"><Trash2 size={16} /></button>
              </div>
            ))}
            <button className="admin-editor-add" onClick={addCategory} type="button"><Plus size={16} /> Nova categoria</button>
          </div>
        </details>
      ) : null}

      {state.siteSlug === "espaco-fernandes" && activeType === "image" ? (
        <label className="admin-media-limit">
          Fotos exibidas antes de “Ver todas as fotos”
          <input max={100} min={1} onChange={(event) => mutate((next) => { next.galleryInitialCount = Number(event.target.value); })} type="number" value={config.galleryInitialCount ?? 12} />
        </label>
      ) : null}

      <div className="admin-media-grid">
        {items.map((item, index) => {
          const poster = item.posterAssetId ? images.find((image) => image.assetId === item.posterAssetId) : null;
          return (
            <article className={!item.active ? "is-inactive" : ""} key={item.assetId}>
              <button className="admin-media-thumb" onClick={() => setPreviewId(item.assetId)} type="button">
                {item.type === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element -- thumbnail do arquivo original no Storage.
                  <img alt={item.alt || item.title} loading="lazy" src={item.publicUrl} />
                ) : poster ? (
                  // eslint-disable-next-line @next/next/no-img-element -- thumbnail do poster no Storage.
                  <img alt={poster.alt || `Capa de ${item.title}`} loading="lazy" src={poster.publicUrl} />
                ) : <Film aria-hidden="true" size={38} />}
                <span><Eye size={16} /> Ampliar</span>
              </button>
              <div className="admin-media-card-body">
                <header>
                  <small>{item.originalName} · {formatBytes(item.sizeBytes)}</small>
                  <div>
                    {item.isPrimary ? <em><Star size={13} /> Vídeo principal do site</em> : null}
                    {item.featured && !item.isPrimary ? <em><Star size={13} /> Destaque</em> : null}
                  </div>
                </header>
                <label>Título<input maxLength={180} onChange={(event) => updateItem(item.assetId, (target) => { target.title = event.target.value; })} value={item.title} /></label>
                <label>Legenda<textarea maxLength={1200} onChange={(event) => updateItem(item.assetId, (target) => { target.caption = event.target.value; })} value={item.caption} /></label>
                {item.type === "image" ? (
                  <>
                    <label>Texto alternativo<input maxLength={500} onChange={(event) => updateItem(item.assetId, (target) => { target.alt = event.target.value; })} value={item.alt} /></label>
                    {item.specificUse.includes("gallery") ? <label>Categoria<select onChange={(event) => updateItem(item.assetId, (target) => { target.categoryId = event.target.value || null; })} value={item.categoryId ?? ""}><option value="">Sem categoria</option>{config.categories.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}</select></label> : <p className="admin-media-use">Uso: {item.specificUse.join(", ") || "Imagem auxiliar"}</p>}
                    <label className="admin-editor-toggle"><input checked={item.featured} onChange={() => toggleFeatured(item.assetId)} type="checkbox" /><span /><strong>Imagem de destaque</strong></label>
                  </>
                ) : (
                  <>
                    <div className="admin-editor-grid">
                      <label>Duração<input maxLength={20} onChange={(event) => updateItem(item.assetId, (target) => { target.duration = event.target.value; })} placeholder="1:09" value={item.duration ?? ""} /></label>
                      <label>Formato<select onChange={(event) => updateItem(item.assetId, (target) => { target.format = event.target.value as "vertical" | "horizontal"; })} value={item.format ?? "vertical"}><option value="vertical">Vertical</option><option value="horizontal">Horizontal</option></select></label>
                    </div>
                    <label>Capa do vídeo<select onChange={(event) => updateItem(item.assetId, (target) => { target.posterAssetId = event.target.value || null; })} value={item.posterAssetId ?? ""}><option value="">Sem capa</option>{images.map((image) => <option key={image.assetId} value={image.assetId}>{image.title || image.originalName}</option>)}</select></label>
                    <label className="admin-editor-toggle"><input checked={item.isPrimary} onChange={() => updateItem(item.assetId, (target, next) => { next.items.forEach((candidate) => { if (candidate.type === "video") candidate.isPrimary = false; }); target.isPrimary = true; target.featured = true; target.active = true; target.specificUse = ["hero-video"]; })} type="radio" /><span /><strong>Vídeo principal do site</strong></label>
                  </>
                )}
                <label className="admin-editor-toggle"><input checked={item.active} onChange={() => toggleActive(item)} type="checkbox" /><span /><strong>{item.active ? "Ativa no site" : "Oculta no site"}</strong></label>
                <div className="admin-media-card-actions">
                  <button aria-label="Mover para cima" disabled={index === 0} onClick={() => moveItem(item.assetId, -1)} type="button"><ArrowUp size={16} /></button>
                  <button aria-label="Mover para baixo" disabled={index === items.length - 1} onClick={() => moveItem(item.assetId, 1)} type="button"><ArrowDown size={16} /></button>
                  <button className="is-danger" onClick={() => deleteItem(item)} type="button"><Trash2 size={16} /> Excluir</button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="admin-media-actionbar">
        <div><strong>{isDirty ? "Alterações ainda não salvas" : "Biblioteca sincronizada"}</strong><small>Salvar mantém o site inalterado; publicar aplica tudo de uma vez.</small></div>
        <div>
          <button disabled={isSaving || isUploading} onClick={() => persist("discard")} type="button"><X size={16} /> Descartar</button>
          <button disabled={isSaving || isUploading} onClick={() => persist("save")} type="button"><Save size={16} /> Salvar rascunho</button>
          <button className="is-primary" disabled={isSaving || isUploading} onClick={() => persist("publish")} type="button">{isSaving ? <LoaderCircle className="admin-spin" size={16} /> : <Send size={16} />} Publicar</button>
        </div>
      </div>
      {preview ? <MediaPreview item={preview} onClose={() => setPreviewId(null)} poster={previewPoster} /> : null}
    </section>
  );
}

export function MediaManager({ states }: { states: MediaEditorState[] }) {
  const [activeSite, setActiveSite] = useState<EditableSiteSlug>(states[0].siteSlug);
  const state = states.find((candidate) => candidate.siteSlug === activeSite) ?? states[0];
  return (
    <div className="admin-media-page">
      <header className="admin-editor-header">
        <div><p>Mídia</p><h1>Fotos e vídeos</h1><span>Organize arquivos, legendas, categorias, capas e destaques sem alterar o site até a publicação.</span></div>
      </header>
      <nav aria-label="Projetos" className="admin-media-site-switcher">
        {states.map((candidate) => <button className={candidate.siteSlug === activeSite ? "is-active" : ""} key={candidate.siteSlug} onClick={() => setActiveSite(candidate.siteSlug)} type="button">{candidate.displayName}</button>)}
      </nav>
      <SiteMediaEditor key={state.siteSlug} state={state} />
    </div>
  );
}
