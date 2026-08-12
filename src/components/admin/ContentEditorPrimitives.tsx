"use client";

import { ArrowDown, ArrowUp, ExternalLink, Plus, Trash2 } from "lucide-react";
import { useActionState, useEffect, useId } from "react";
import { useRouter } from "next/navigation";
import { updateSiteContent } from "@/app/admin/content-actions";
import type { ContentActionState } from "@/app/admin/content-actions";
import type { EditableSiteSlug } from "@/src/lib/content/site-content";

const initialContentActionState: ContentActionState = {
  status: "idle",
  message: "",
};

export function EditorField({
  label,
  value,
  onChange,
  textarea = false,
  required = false,
  maxLength = 500,
  type = "text",
  hint,
  inputId,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
  required?: boolean;
  maxLength?: number;
  type?: "text" | "email" | "url" | "tel" | "number";
  hint?: string;
  inputId?: string;
}) {
  const generatedId = useId();
  const id = inputId ?? `field-${generatedId.replace(/:/g, "")}`;
  return (
    <label className="admin-editor-field" htmlFor={id}>
      <span>{label}{required ? " *" : ""}</span>
      {textarea ? (
        <textarea
          id={id}
          maxLength={maxLength}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          rows={4}
          value={value}
        />
      ) : (
        <input
          id={id}
          maxLength={maxLength}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          type={type}
          value={value}
        />
      )}
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

export function EditorToggle({
  label,
  checked,
  onChange,
  description,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}) {
  return (
    <label className="admin-editor-toggle">
      <input
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
      />
      <span aria-hidden="true" />
      <strong>{label}</strong>
      {description ? <small>{description}</small> : null}
    </label>
  );
}

export function EditorSection({
  title,
  description,
  children,
  open = false,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  open?: boolean;
}) {
  return (
    <details className="admin-editor-section" open={open}>
      <summary>
        <span>
          <strong>{title}</strong>
          {description ? <small>{description}</small> : null}
        </span>
        <span className="admin-editor-section-indicator" aria-hidden="true">+</span>
      </summary>
      <div className="admin-editor-section-body">{children}</div>
    </details>
  );
}

export function ReorderButtons({
  index,
  length,
  onMove,
  onRemove,
}: {
  index: number;
  length: number;
  onMove: (direction: -1 | 1) => void;
  onRemove?: () => void;
}) {
  return (
    <div className="admin-editor-item-actions">
      <button aria-label="Mover para cima" disabled={index === 0} onClick={() => onMove(-1)} type="button">
        <ArrowUp size={16} />
      </button>
      <button aria-label="Mover para baixo" disabled={index === length - 1} onClick={() => onMove(1)} type="button">
        <ArrowDown size={16} />
      </button>
      {onRemove ? (
        <button aria-label="Remover item" className="is-danger" onClick={onRemove} type="button">
          <Trash2 size={16} />
        </button>
      ) : null}
    </div>
  );
}

export function StringListEditor({
  items,
  onChange,
  addLabel,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  addLabel: string;
}) {
  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="admin-editor-list">
      {items.map((item, index) => (
        <div className="admin-editor-list-row" key={`${index}-${item}`}>
          <input
            aria-label={`Item ${index + 1}`}
            maxLength={120}
            onChange={(event) => {
              const next = [...items];
              next[index] = event.target.value;
              onChange(next);
            }}
            value={item}
          />
          <ReorderButtons
            index={index}
            length={items.length}
            onMove={(direction) => move(index, direction)}
            onRemove={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
          />
        </div>
      ))}
      <button className="admin-editor-add" onClick={() => onChange([...items, ""])} type="button">
        <Plus size={17} /> {addLabel}
      </button>
    </div>
  );
}

export type EditableFaqItem = {
  id: string;
  question: string;
  answer: string;
  order: number;
  visible: boolean;
};

export function FaqEditor({
  items,
  onChange,
}: {
  items: EditableFaqItem[];
  onChange: (items: EditableFaqItem[]) => void;
}) {
  function normalize(next: EditableFaqItem[]) {
    onChange(next.map((item, index) => ({ ...item, order: index + 1 })));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    normalize(next);
  }

  return (
    <div className="admin-editor-list admin-editor-faq-list">
      {items.map((item, index) => (
        <article className="admin-editor-item-card" key={item.id}>
          <header>
            <strong>Pergunta {index + 1}</strong>
            <ReorderButtons
              index={index}
              length={items.length}
              onMove={(direction) => move(index, direction)}
              onRemove={() => normalize(items.filter((_, itemIndex) => itemIndex !== index))}
            />
          </header>
          <EditorField
            label="Pergunta"
            maxLength={180}
            onChange={(value) => {
              const next = [...items];
              next[index] = { ...item, question: value };
              onChange(next);
            }}
            required
            value={item.question}
          />
          <EditorField
            label="Resposta"
            maxLength={1200}
            onChange={(value) => {
              const next = [...items];
              next[index] = { ...item, answer: value };
              onChange(next);
            }}
            required
            textarea
            value={item.answer}
          />
          <EditorToggle
            checked={item.visible}
            label="Pergunta ativa"
            onChange={(checked) => {
              const next = [...items];
              next[index] = { ...item, visible: checked };
              onChange(next);
            }}
          />
        </article>
      ))}
      <button
        className="admin-editor-add"
        onClick={() =>
          normalize([
            ...items,
            {
              id: `faq-${Date.now().toString(36)}`,
              question: "",
              answer: "",
              visible: true,
              order: items.length + 1,
            },
          ])
        }
        type="button"
      >
        <Plus size={17} /> Adicionar pergunta
      </button>
    </div>
  );
}

function formatDate(value: string | null) {
  if (!value) return "Ainda não registrada";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(value));
}

export function ContentEditorFrame({
  siteSlug,
  title,
  description,
  content,
  hasDraft,
  publishedAt,
  draftUpdatedAt,
  children,
}: {
  siteSlug: EditableSiteSlug;
  title: string;
  description: string;
  content: unknown;
  hasDraft: boolean;
  publishedAt: string | null;
  draftUpdatedAt: string | null;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    updateSiteContent,
    initialContentActionState,
  );

  useEffect(() => {
    if (state.status !== "success") return;
    if (state.completedIntent === "discard") {
      window.location.reload();
      return;
    }
    router.refresh();
  }, [router, state]);

  return (
    <form action={formAction} className="admin-page-stack admin-editor-page">
      <input name="siteSlug" type="hidden" value={siteSlug} />
      <input name="content" type="hidden" value={JSON.stringify(content)} />

      <header className="admin-editor-header">
        <div>
          <p>Editor de conteúdo</p>
          <h1>{title}</h1>
          <span>{description}</span>
        </div>
        <a href={`/${siteSlug}`} rel="noreferrer" target="_blank">
          Visualizar site <ExternalLink size={17} />
        </a>
      </header>

      <div className="admin-editor-status-grid">
        <div>
          <span className={hasDraft ? "is-draft" : "is-published"}>
            {hasDraft ? "Alterações ainda não publicadas" : "Conteúdo publicado"}
          </span>
          <small>{hasDraft ? `Rascunho salvo em ${formatDate(draftUpdatedAt)}` : "Nenhum rascunho pendente"}</small>
        </div>
        <div>
          <strong>Última publicação</strong>
          <small>{formatDate(publishedAt)}</small>
        </div>
      </div>

      {state.status !== "idle" ? (
        <div className={`admin-editor-feedback is-${state.status}`} role="status">
          <strong>{state.message}</strong>
          {state.errors?.length ? (
            <ul>{state.errors.map((error) => <li key={error}>{error}</li>)}</ul>
          ) : null}
        </div>
      ) : null}

      <div className="admin-editor-sections">{children}</div>

      <div className="admin-editor-actionbar">
        <div>
          <strong>Pronto para continuar?</strong>
          <small>Salvar rascunho não altera o site público.</small>
        </div>
        <div>
          {hasDraft ? (
            <button className="admin-editor-button is-secondary" disabled={pending} name="intent" type="submit" value="discard">
              Descartar alterações
            </button>
          ) : null}
          <button className="admin-editor-button is-secondary" disabled={pending} name="intent" type="submit" value="save">
            Salvar rascunho
          </button>
          <button
            className="admin-editor-button is-primary"
            disabled={pending}
            name="intent"
            onClick={(event) => {
              if (!window.confirm("Publicar estas alterações no site?")) event.preventDefault();
            }}
            type="submit"
            value="publish"
          >
            Publicar alterações
          </button>
        </div>
      </div>
    </form>
  );
}
