"use client";

import { useState } from "react";
import type { PropertyContent } from "@/src/content/property";
import {
  ContentEditorFrame,
  EditorField,
  EditorSection,
  EditorToggle,
  FaqEditor,
  StringListEditor,
} from "./ContentEditorPrimitives";

type EditorProps = {
  initialContent: PropertyContent;
  hasDraft: boolean;
  publishedAt: string | null;
  draftUpdatedAt: string | null;
};

function cloneContent(content: PropertyContent) {
  return structuredClone(content);
}

export function ChacaraContentEditor({
  initialContent,
  hasDraft,
  publishedAt,
  draftUpdatedAt,
}: EditorProps) {
  const [content, setContent] = useState(() => cloneContent(initialContent));

  function update(mutator: (next: PropertyContent) => void) {
    setContent((current) => {
      const next = cloneContent(current);
      mutator(next);
      return next;
    });
  }

  return (
    <ContentEditorFrame
      content={content}
      description="Edite informações comerciais, textos, características e perguntas frequentes. Fotos e vídeos permanecem protegidos."
      draftUpdatedAt={draftUpdatedAt}
      hasDraft={hasDraft}
      publishedAt={publishedAt}
      siteSlug="chacara-alto-dos-torres"
      title="Chácara Alto dos Torres"
    >
      <EditorSection
        description="Nome, status e conteúdo que aparece logo no início da página."
        open
        title="Informações principais"
      >
        <div className="admin-editor-grid">
          <EditorField
            label="Nome da propriedade"
            maxLength={100}
            onChange={(value) => update((next) => { next.propertyName = value; })}
            required
            value={content.propertyName}
          />
          <label className="admin-editor-field">
            <span>Status da venda *</span>
            <select
              onChange={(event) => update((next) => {
                next.status = event.target.value as PropertyContent["status"];
              })}
              value={content.status}
            >
              <option value="available">Disponível</option>
              <option value="reserved">Reservada</option>
              <option value="sold">Vendida</option>
            </select>
          </label>
        </div>
        <EditorField
          label="Descrição resumida"
          maxLength={260}
          onChange={(value) => update((next) => { next.shortDescription = value; })}
          required
          textarea
          value={content.shortDescription}
        />
        <EditorField
          label="Descrição principal"
          maxLength={1200}
          onChange={(value) => update((next) => { next.fullDescription = value; })}
          required
          textarea
          value={content.fullDescription}
        />
        <div className="admin-editor-grid">
          <EditorField
            label="Título da primeira tela"
            maxLength={180}
            onChange={(value) => update((next) => { next.hero.title = value; })}
            required
            value={content.hero.title}
          />
          <EditorField
            label="Frase de apoio"
            maxLength={260}
            onChange={(value) => update((next) => { next.hero.supportingText = value; })}
            required
            value={content.hero.supportingText}
          />
        </div>
        <EditorField
          label="Texto descritivo da primeira tela"
          maxLength={500}
          onChange={(value) => update((next) => { next.hero.subtitle = value; })}
          required
          textarea
          value={content.hero.subtitle}
        />
        <EditorField
          label="Texto do botão principal"
          maxLength={100}
          onChange={(value) => update((next) => { next.hero.primaryActionLabel = value; })}
          required
          value={content.hero.primaryActionLabel}
        />
      </EditorSection>

      <EditorSection
        description="Resumo objetivo da área e dos diferenciais confirmados."
        title="Características principais"
      >
        <div className="admin-editor-grid admin-editor-grid-three">
          <EditorField
            label="Rótulo da área total"
            maxLength={100}
            onChange={(value) => update((next) => { next.area.total.label = value; })}
            value={content.area.total.label}
          />
          <EditorField
            label="Valor da área total"
            maxLength={60}
            onChange={(value) => update((next) => { next.area.total.value = value || null; })}
            value={content.area.total.value ?? ""}
          />
          <EditorField
            label="Unidade"
            maxLength={60}
            onChange={(value) => update((next) => { next.area.total.unit = value || null; })}
            value={content.area.total.unit ?? ""}
          />
        </div>
        <div className="admin-editor-subgroup">
          <h3>Resumo da primeira tela</h3>
          <StringListEditor
            addLabel="Adicionar característica"
            items={content.hero.quickFacts}
            onChange={(items) => update((next) => { next.hero.quickFacts = items; })}
          />
        </div>
        <EditorField
          label="Título da ficha de características"
          maxLength={180}
          onChange={(value) => update((next) => { next.propertyDetails.title = value; })}
          value={content.propertyDetails.title}
        />
        <div className="admin-editor-card-grid">
          {content.propertyDetails.items.map((item, index) => (
            <article className="admin-editor-item-card" key={item.key}>
              <header><strong>{item.label}</strong></header>
              <EditorField
                label="Rótulo"
                maxLength={100}
                onChange={(value) => update((next) => {
                  next.propertyDetails.items[index].label = value;
                })}
                value={item.label}
              />
              <EditorField
                hint="Se ficar vazio, o item não será mostrado ao visitante."
                label="Informação"
                maxLength={500}
                onChange={(value) => update((next) => {
                  next.propertyDetails.items[index].value = value || null;
                })}
                textarea
                value={item.value ?? ""}
              />
              <EditorToggle
                checked={item.visible}
                label="Item ativo"
                onChange={(checked) => update((next) => {
                  next.propertyDetails.items[index].visible = checked;
                })}
              />
            </article>
          ))}
        </div>
      </EditorSection>

      <EditorSection
        description="Apresentação do pomar, cultivos e cards que já existem no site."
        title="Pomar e cultivos"
      >
        <EditorField
          label="Título da seção"
          maxLength={180}
          onChange={(value) => update((next) => { next.crops.title = value; })}
          required
          value={content.crops.title}
        />
        <EditorField
          label="Texto de apresentação"
          maxLength={700}
          onChange={(value) => update((next) => { next.crops.introduction = value; })}
          required
          textarea
          value={content.crops.introduction}
        />
        <EditorField
          label="Título da lista de cultivos"
          maxLength={180}
          onChange={(value) => update((next) => { next.crops.culturesTitle = value; })}
          value={content.crops.culturesTitle}
        />
        <StringListEditor
          addLabel="Adicionar cultivo"
          items={content.crops.cultures}
          onChange={(items) => update((next) => { next.crops.cultures = items; })}
        />
        <div className="admin-editor-card-grid">
          {content.crops.items.map((item, index) => (
            <article className="admin-editor-item-card" key={item.id}>
              <header><strong>{item.name}</strong></header>
              <EditorField
                label="Nome"
                maxLength={100}
                onChange={(value) => update((next) => { next.crops.items[index].name = value; })}
                value={item.name}
              />
              <EditorField
                label="Descrição"
                maxLength={500}
                onChange={(value) => update((next) => { next.crops.items[index].description = value; })}
                textarea
                value={item.description}
              />
              <EditorToggle
                checked={item.visible}
                label="Card ativo"
                onChange={(checked) => update((next) => { next.crops.items[index].visible = checked; })}
              />
            </article>
          ))}
        </div>
      </EditorSection>

      <EditorSection
        description="Textos da casa, varanda, água, energia e demais itens já cadastrados."
        title="Casa e infraestrutura"
      >
        <EditorField
          label="Título da seção da casa"
          maxLength={180}
          onChange={(value) => update((next) => { next.supportHouse.title = value; })}
          required
          value={content.supportHouse.title}
        />
        <div className="admin-editor-subgroup">
          <h3>Parágrafos da casa</h3>
          <StringListEditor
            addLabel="Adicionar parágrafo"
            items={content.supportHouse.paragraphs}
            onChange={(items) => update((next) => { next.supportHouse.paragraphs = items; })}
          />
        </div>
        <div className="admin-editor-card-grid">
          {content.supportHouse.features.map((item, index) => (
            <article className="admin-editor-item-card" key={`${index}-${item.title}`}>
              <EditorField
                label="Destaque"
                maxLength={120}
                onChange={(value) => update((next) => { next.supportHouse.features[index].title = value; })}
                value={item.title}
              />
              <EditorField
                label="Descrição"
                maxLength={500}
                onChange={(value) => update((next) => { next.supportHouse.features[index].description = value; })}
                textarea
                value={item.description}
              />
              <EditorToggle
                checked={item.visible}
                label="Destaque ativo"
                onChange={(checked) => update((next) => { next.supportHouse.features[index].visible = checked; })}
              />
            </article>
          ))}
        </div>
        <div className="admin-editor-divider" />
        <EditorField
          label="Título da infraestrutura"
          maxLength={180}
          onChange={(value) => update((next) => { next.infrastructure.title = value; })}
          required
          value={content.infrastructure.title}
        />
        <EditorField
          label="Descrição da infraestrutura"
          maxLength={700}
          onChange={(value) => update((next) => { next.infrastructure.description = value; })}
          required
          textarea
          value={content.infrastructure.description}
        />
        <div className="admin-editor-card-grid">
          {content.infrastructure.items.map((item, index) => (
            <article className="admin-editor-item-card" key={`${index}-${item.title}`}>
              <EditorField
                label="Item"
                maxLength={120}
                onChange={(value) => update((next) => { next.infrastructure.items[index].title = value; })}
                value={item.title}
              />
              <EditorField
                label="Descrição"
                maxLength={500}
                onChange={(value) => update((next) => { next.infrastructure.items[index].description = value; })}
                textarea
                value={item.description}
              />
              <EditorToggle
                checked={item.visible}
                label="Item ativo"
                onChange={(checked) => update((next) => { next.infrastructure.items[index].visible = checked; })}
              />
            </article>
          ))}
        </div>
      </EditorSection>

      <EditorSection description="Informações aproximadas e condições de chegada à propriedade." title="Localização e acesso">
        <EditorField
          label="Título da seção"
          maxLength={180}
          onChange={(value) => update((next) => { next.location.title = value; })}
          required
          value={content.location.title}
        />
        <EditorField
          label="Apresentação da localização"
          maxLength={700}
          onChange={(value) => update((next) => { next.location.introduction = value; })}
          required
          textarea
          value={content.location.introduction}
        />
        <div className="admin-editor-grid">
          <EditorField
            label="Localização aproximada"
            maxLength={180}
            onChange={(value) => update((next) => { next.location.approximateLocation = value || null; })}
            value={content.location.approximateLocation ?? ""}
          />
          <EditorField
            label="Distância informada"
            maxLength={180}
            onChange={(value) => update((next) => { next.location.distanceToCenter = value || null; })}
            value={content.location.distanceToCenter ?? ""}
          />
        </div>
        <EditorField
          label="Condições de acesso"
          maxLength={500}
          onChange={(value) => update((next) => { next.location.accessCondition = value || null; })}
          textarea
          value={content.location.accessCondition ?? ""}
        />
        <EditorField
          label="Observação de localização"
          maxLength={500}
          onChange={(value) => update((next) => { next.location.note = value; })}
          textarea
          value={content.location.note}
        />
      </EditorSection>

      <EditorSection description="Canais de atendimento e textos usados nos botões de contato." title="Contato e WhatsApp">
        <EditorField
          label="Título da seção"
          maxLength={180}
          onChange={(value) => update((next) => { next.contact.title = value; })}
          required
          value={content.contact.title}
        />
        <EditorField
          label="Texto da seção"
          maxLength={700}
          onChange={(value) => update((next) => { next.contact.description = value; })}
          required
          textarea
          value={content.contact.description}
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
            label="E-mail"
            maxLength={180}
            onChange={(value) => update((next) => { next.contact.email = value; })}
            required
            type="email"
            value={content.contact.email ?? ""}
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
            label="Texto do botão de contato"
            maxLength={100}
            onChange={(value) => update((next) => { next.contact.buttonLabel = value; })}
            required
            value={content.contact.buttonLabel}
          />
          <EditorField
            label="Texto do botão flutuante"
            maxLength={100}
            onChange={(value) => update((next) => { next.contact.floatingButtonLabel = value; })}
            value={content.contact.floatingButtonLabel}
          />
        </div>
      </EditorSection>

      <EditorSection description="Preço, condição de pagamento e texto comercial da venda." title="Condições comerciais">
        <EditorField
          label="Texto comercial"
          maxLength={700}
          onChange={(value) => update((next) => { next.negotiation.description = value; })}
          textarea
          value={content.negotiation.description}
        />
        <StringListEditor
          addLabel="Adicionar forma de pagamento"
          items={content.negotiation.paymentMethods}
          onChange={(items) => update((next) => { next.negotiation.paymentMethods = items; })}
        />
        <EditorToggle
          checked={content.negotiation.price.showPrice}
          description="Quando desligado, o valor continua sob consulta."
          label="Exibir preço no site"
          onChange={(checked) => update((next) => { next.negotiation.price.showPrice = checked; })}
        />
        {content.negotiation.price.showPrice ? (
          <EditorField
            hint="Use apenas números. O site exibirá o valor em reais."
            label="Preço"
            maxLength={15}
            onChange={(value) => update((next) => {
              next.negotiation.price.amount = value ? Number(value) : null;
            })}
            required
            type="number"
            value={content.negotiation.price.amount?.toString() ?? ""}
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
