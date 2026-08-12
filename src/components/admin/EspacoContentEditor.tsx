"use client";

import { useState } from "react";
import type { EspacoFernandesContent } from "@/src/content/espacoFernandes";
import {
  ContentEditorFrame,
  EditorField,
  EditorSection,
  EditorToggle,
  FaqEditor,
  ReorderButtons,
  StringListEditor,
} from "./ContentEditorPrimitives";

type EditorProps = {
  initialContent: EspacoFernandesContent;
  hasDraft: boolean;
  publishedAt: string | null;
  draftUpdatedAt: string | null;
};

function cloneContent(content: EspacoFernandesContent) {
  return structuredClone(content);
}

export function EspacoContentEditor({
  initialContent,
  hasDraft,
  publishedAt,
  draftUpdatedAt,
}: EditorProps) {
  const [content, setContent] = useState(() => cloneContent(initialContent));

  function update(mutator: (next: EspacoFernandesContent) => void) {
    setContent((current) => {
      const next = cloneContent(current);
      mutator(next);
      return next;
    });
  }

  function moveAmenity(index: number, direction: -1 | 1) {
    update((next) => {
      const target = index + direction;
      if (target < 0 || target >= next.structure.amenities.length) return;
      const items = next.structure.amenities;
      [items[index], items[target]] = [items[target], items[index]];
      items.forEach((item, itemIndex) => { item.order = itemIndex + 1; });
    });
  }

  return (
    <ContentEditorFrame
      content={content}
      description="Edite apresentação, estrutura, localização, contato, diária e perguntas frequentes. Fotos e vídeo permanecem protegidos."
      draftUpdatedAt={draftUpdatedAt}
      hasDraft={hasDraft}
      publishedAt={publishedAt}
      siteSlug="espaco-fernandes"
      title="Espaço Fernandes"
    >
      <EditorSection description="Nome, chamada principal e botões da primeira tela." open title="Informações principais">
        <EditorField
          label="Nome do espaço"
          maxLength={100}
          onChange={(value) => update((next) => { next.brand.name = value; })}
          required
          value={content.brand.name}
        />
        <div className="admin-editor-grid">
          <EditorField
            label="Identificação"
            maxLength={180}
            onChange={(value) => update((next) => { next.hero.identification = value; })}
            required
            value={content.hero.identification}
          />
          <EditorField
            label="Título da primeira tela"
            maxLength={180}
            onChange={(value) => update((next) => { next.hero.title = value; })}
            required
            value={content.hero.title}
          />
        </div>
        <EditorField
          label="Texto de apresentação da primeira tela"
          maxLength={500}
          onChange={(value) => update((next) => { next.hero.description = value; })}
          required
          textarea
          value={content.hero.description}
        />
        <div className="admin-editor-grid">
          <EditorField
            label="Texto do botão principal"
            maxLength={100}
            onChange={(value) => update((next) => { next.hero.primaryButton = value; })}
            required
            value={content.hero.primaryButton}
          />
          <EditorField
            label="Texto do botão secundário"
            maxLength={100}
            onChange={(value) => update((next) => { next.hero.secondaryButton = value; })}
            value={content.hero.secondaryButton}
          />
        </div>
      </EditorSection>

      <EditorSection description="Texto institucional que apresenta a proposta do local." title="Apresentação">
        <EditorField
          label="Título da seção"
          maxLength={180}
          onChange={(value) => update((next) => { next.about.title = value; })}
          required
          value={content.about.title}
        />
        <EditorField
          label="Texto da apresentação"
          maxLength={900}
          onChange={(value) => update((next) => { next.about.text = value; })}
          required
          textarea
          value={content.about.text}
        />
      </EditorSection>

      <EditorSection description="Edite, oculte e reorganize as comodidades já cadastradas." title="Estrutura e comodidades">
        <EditorField
          label="Título da seção"
          maxLength={180}
          onChange={(value) => update((next) => { next.structure.title = value; })}
          required
          value={content.structure.title}
        />
        <EditorField
          label="Descrição da estrutura"
          maxLength={900}
          onChange={(value) => update((next) => { next.structure.description = value; })}
          required
          textarea
          value={content.structure.description}
        />
        <div className="admin-editor-list">
          {content.structure.amenities.map((item, index) => (
            <article className="admin-editor-item-card" key={item.id}>
              <header>
                <strong>Comodidade {index + 1}</strong>
                <ReorderButtons
                  index={index}
                  length={content.structure.amenities.length}
                  onMove={(direction) => moveAmenity(index, direction)}
                />
              </header>
              <EditorField
                label="Nome"
                maxLength={120}
                onChange={(value) => update((next) => { next.structure.amenities[index].title = value; })}
                value={item.title}
              />
              <EditorField
                label="Descrição"
                maxLength={500}
                onChange={(value) => update((next) => { next.structure.amenities[index].description = value; })}
                textarea
                value={item.description}
              />
              <EditorToggle
                checked={item.visible !== false}
                label="Comodidade ativa"
                onChange={(checked) => update((next) => { next.structure.amenities[index].visible = checked; })}
              />
            </article>
          ))}
        </div>
      </EditorSection>

      <EditorSection description="Tipos de encontros e comemorações apresentados no site." title="Ocasiões">
        <EditorField
          label="Título da seção"
          maxLength={180}
          onChange={(value) => update((next) => { next.occasions.title = value; })}
          value={content.occasions.title}
        />
        <StringListEditor
          addLabel="Adicionar ocasião"
          items={content.occasions.items}
          onChange={(items) => update((next) => { next.occasions.items = items; })}
        />
      </EditorSection>

      <EditorSection description="Informações básicas do chalé, sem alterar a fotografia." title="Chalé">
        <EditorField
          label="Título da seção"
          maxLength={180}
          onChange={(value) => update((next) => { next.chalet.title = value; })}
          required
          value={content.chalet.title}
        />
        <EditorField
          label="Descrição do chalé"
          maxLength={900}
          onChange={(value) => update((next) => { next.chalet.text = value; })}
          required
          textarea
          value={content.chalet.text}
        />
      </EditorSection>

      <EditorSection description="Endereço exibido e links usados no mapa da página." title="Localização e mapa">
        <EditorField
          label="Título da seção"
          maxLength={180}
          onChange={(value) => update((next) => { next.location.title = value; })}
          required
          value={content.location.title}
        />
        <StringListEditor
          addLabel="Adicionar linha do endereço"
          items={content.location.addressLines}
          onChange={(items) => update((next) => { next.location.addressLines = items; })}
        />
        <EditorField
          hint="Link aberto quando o visitante escolhe ver a rota."
          label="Link do Google Maps"
          maxLength={1000}
          onChange={(value) => update((next) => { next.location.mapUrl = value || null; })}
          type="url"
          value={content.location.mapUrl ?? ""}
        />
        <EditorField
          hint="Link de incorporação do mapa exibido dentro da página."
          label="Link de incorporação do mapa"
          maxLength={2000}
          onChange={(value) => update((next) => { next.location.mapEmbedUrl = value || null; })}
          type="url"
          value={content.location.mapEmbedUrl ?? ""}
        />
      </EditorSection>

      <EditorSection description="WhatsApp, Instagram, e-mail e textos de atendimento." title="Contato">
        <EditorField
          label="Título da seção"
          maxLength={180}
          onChange={(value) => update((next) => { next.contact.title = value; })}
          required
          value={content.contact.title}
        />
        <EditorField
          label="Texto de contato"
          maxLength={900}
          onChange={(value) => update((next) => { next.contact.text = value; })}
          required
          textarea
          value={content.contact.text}
        />
        <div className="admin-editor-grid admin-editor-grid-three">
          <EditorField
            label="Código do país"
            maxLength={3}
            onChange={(value) => update((next) => { next.contact.whatsapp.countryCode = value.replace(/\D/g, ""); })}
            type="tel"
            value={content.contact.whatsapp.countryCode}
          />
          <EditorField
            label="Número do WhatsApp"
            maxLength={15}
            onChange={(value) => update((next) => { next.contact.whatsapp.number = value.replace(/\D/g, ""); })}
            type="tel"
            value={content.contact.whatsapp.number}
          />
          <EditorField
            label="Texto do botão do WhatsApp"
            maxLength={100}
            onChange={(value) => update((next) => { next.contact.whatsapp.label = value; })}
            value={content.contact.whatsapp.label}
          />
        </div>
        <EditorField
          label="Mensagem automática do WhatsApp"
          maxLength={700}
          onChange={(value) => update((next) => { next.contact.whatsapp.message = value; })}
          required
          textarea
          value={content.contact.whatsapp.message}
        />
        <div className="admin-editor-grid">
          <EditorField
            label="Instagram"
            maxLength={500}
            onChange={(value) => update((next) => { next.contact.instagram.url = value; })}
            required
            type="url"
            value={content.contact.instagram.url}
          />
          <EditorField
            label="Texto do botão do Instagram"
            maxLength={100}
            onChange={(value) => update((next) => { next.contact.instagram.label = value; })}
            value={content.contact.instagram.label}
          />
          <EditorField
            label="E-mail"
            maxLength={180}
            onChange={(value) => update((next) => { next.contact.email.address = value; })}
            required
            type="email"
            value={content.contact.email.address}
          />
          <EditorField
            label="Texto do botão de e-mail"
            maxLength={100}
            onChange={(value) => update((next) => { next.contact.email.label = value; })}
            value={content.contact.email.label}
          />
        </div>
      </EditorSection>

      <EditorSection description="Controle se o valor da diária deve aparecer para visitantes." title="Valor da diária">
        <EditorToggle
          checked={content.pricing.mostrarPreco}
          description="Quando desligado, o valor não aparece no site."
          label="Exibir valor da diária"
          onChange={(checked) => update((next) => { next.pricing.mostrarPreco = checked; })}
        />
        {content.pricing.mostrarPreco ? (
          <EditorField
            hint="Exemplo: Diária a partir de R$ 450."
            label="Texto do valor"
            maxLength={100}
            onChange={(value) => update((next) => { next.pricing.valor = value; })}
            required
            value={content.pricing.valor ?? ""}
          />
        ) : null}
      </EditorSection>

      <EditorSection description="Adicione, remova, reorganize ou oculte perguntas." title="Perguntas frequentes">
        <EditorField
          label="Título da seção"
          maxLength={180}
          onChange={(value) => update((next) => { next.faq.title = value; })}
          value={content.faq.title}
        />
        <FaqEditor
          items={content.faq.items}
          onChange={(items) => update((next) => { next.faq.items = items; })}
        />
      </EditorSection>
    </ContentEditorFrame>
  );
}
