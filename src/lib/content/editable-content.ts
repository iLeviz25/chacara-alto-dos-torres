import type { EspacoFernandesContent } from "@/src/content/espacoFernandes";
import type { PropertyContent } from "@/src/content/property";
import type { EditableSiteSlug, SiteContentMap } from "./site-content";

type ValidationResult<T> =
  | { ok: true; content: T }
  | { ok: false; errors: string[] };

function clone<T>(value: T): T {
  return structuredClone(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function hasText(value: unknown, maxLength: number) {
  return typeof value === "string" && value.trim().length > 0 && value.length <= maxLength;
}

function optionalText(value: unknown, maxLength: number) {
  return value === null || (typeof value === "string" && value.length <= maxLength);
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validWhatsapp(countryCode: string, number: string) {
  return /^\d{10,15}$/.test(`${countryCode}${number}`);
}

function validInstagram(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && /(^|\.)instagram\.com$/i.test(url.hostname);
  } catch {
    return false;
  }
}

function validHttpUrl(value: string | null) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function normalizeStrings(values: string[], maxItems: number, maxLength: number) {
  return values
    .slice(0, maxItems)
    .map((value) => value.trim())
    .filter((value) => value.length > 0 && value.length <= maxLength);
}

function validateFaqItems(
  value: unknown,
): value is Array<{
  id: string;
  question: string;
  answer: string;
  order: number;
  visible: boolean;
}> {
  return (
    Array.isArray(value) &&
    value.length <= 30 &&
    value.every(
      (item) =>
        isRecord(item) &&
        hasText(item.id, 100) &&
        hasText(item.question, 180) &&
        hasText(item.answer, 1200) &&
        Number.isInteger(item.order) &&
        typeof item.visible === "boolean",
    )
  );
}

function mergeChacara(
  base: PropertyContent,
  candidate: PropertyContent,
): ValidationResult<PropertyContent> {
  const errors: string[] = [];

  if (!hasText(candidate.propertyName, 100)) errors.push("Informe o nome da propriedade.");
  if (!hasText(candidate.shortDescription, 260)) errors.push("Revise a descrição resumida.");
  if (!hasText(candidate.fullDescription, 1200)) errors.push("Revise a descrição principal.");
  if (!["available", "reserved", "sold"].includes(candidate.status)) {
    errors.push("Selecione um status válido.");
  }
  if (!hasText(candidate.hero?.title, 180)) errors.push("Informe o título da primeira tela.");
  if (!hasText(candidate.hero?.supportingText, 260)) errors.push("Informe a frase de apoio.");
  if (!hasText(candidate.hero?.subtitle, 500)) errors.push("Informe o texto principal da primeira tela.");
  if (!hasText(candidate.hero?.primaryActionLabel, 100)) errors.push("Informe o texto do botão principal.");
  if (!Array.isArray(candidate.hero?.quickFacts) || candidate.hero.quickFacts.length > 10) {
    errors.push("Revise as características resumidas.");
  }
  if (!hasText(candidate.crops?.title, 180) || !hasText(candidate.crops?.introduction, 700)) {
    errors.push("Revise o título e a apresentação do pomar.");
  }
  if (!Array.isArray(candidate.crops?.cultures) || candidate.crops.cultures.length > 50) {
    errors.push("Revise a lista de cultivos.");
  }
  if (!hasText(candidate.supportHouse?.title, 180)) errors.push("Informe o título da seção da casa.");
  if (!Array.isArray(candidate.supportHouse?.paragraphs) || candidate.supportHouse.paragraphs.length > 6) {
    errors.push("Revise os textos da casa.");
  }
  if (!hasText(candidate.infrastructure?.title, 180) || !hasText(candidate.infrastructure?.description, 700)) {
    errors.push("Revise os textos de infraestrutura.");
  }
  if (!hasText(candidate.location?.title, 180) || !hasText(candidate.location?.introduction, 700)) {
    errors.push("Revise os textos de localização.");
  }
  if (!optionalText(candidate.location?.distanceToCenter, 180)) errors.push("Revise a distância informada.");
  if (!optionalText(candidate.location?.accessCondition, 500)) errors.push("Revise as condições de acesso.");
  if (!hasText(candidate.contact?.title, 180) || !hasText(candidate.contact?.description, 700)) {
    errors.push("Revise os textos de contato.");
  }
  if (!hasText(candidate.contact?.buttonLabel, 100)) errors.push("Informe o texto do botão de contato.");
  if (!hasText(candidate.contact?.whatsapp?.message, 700)) errors.push("Informe a mensagem automática do WhatsApp.");
  if (!validWhatsapp(candidate.contact?.whatsapp?.countryCode ?? "", candidate.contact?.whatsapp?.number ?? "")) {
    errors.push("Informe um número de WhatsApp válido, somente com dígitos.");
  }
  if (!candidate.contact?.email || !validEmail(candidate.contact.email)) {
    errors.push("Informe um e-mail válido.");
  }
  if (!validateFaqItems(candidate.faq?.items)) errors.push("Revise as perguntas frequentes.");
  if (
    candidate.negotiation?.price?.showPrice &&
    (!(typeof candidate.negotiation.price.amount === "number") || candidate.negotiation.price.amount <= 0)
  ) {
    errors.push("Informe um valor válido ou mantenha a exibição do preço desativada.");
  }

  if (errors.length > 0) return { ok: false, errors };

  const next = clone(base);
  next.propertyName = candidate.propertyName.trim();
  next.status = candidate.status;
  next.shortDescription = candidate.shortDescription.trim();
  next.fullDescription = candidate.fullDescription.trim();
  next.hero.title = candidate.hero.title.trim();
  next.hero.supportingText = candidate.hero.supportingText.trim();
  next.hero.subtitle = candidate.hero.subtitle.trim();
  next.hero.primaryActionLabel = candidate.hero.primaryActionLabel.trim();
  next.hero.quickFacts = normalizeStrings(candidate.hero.quickFacts, 10, 180);

  next.area.total = {
    ...next.area.total,
    label: candidate.area.total.label.trim(),
    value: candidate.area.total.value?.trim() || null,
    unit: candidate.area.total.unit?.trim() || null,
  };

  next.propertyDetails.title = candidate.propertyDetails.title.trim();
  next.propertyDetails.items = next.propertyDetails.items.map((current) => {
    const edited = candidate.propertyDetails.items.find((item) => item.key === current.key);
    return edited
      ? {
          ...current,
          label: edited.label.trim(),
          value: edited.value?.trim() || null,
          visible: edited.visible,
        }
      : current;
  });

  next.crops.title = candidate.crops.title.trim();
  next.crops.introduction = candidate.crops.introduction.trim();
  next.crops.culturesTitle = candidate.crops.culturesTitle.trim();
  next.crops.cultures = normalizeStrings(candidate.crops.cultures, 50, 100);
  next.crops.items = next.crops.items.map((current) => {
    const edited = candidate.crops.items.find((item) => item.id === current.id);
    return edited
      ? {
          ...current,
          name: edited.name.trim(),
          description: edited.description.trim(),
          visible: edited.visible,
        }
      : current;
  });

  next.supportHouse.title = candidate.supportHouse.title.trim();
  next.supportHouse.paragraphs = normalizeStrings(candidate.supportHouse.paragraphs, 6, 800);
  next.supportHouse.features = next.supportHouse.features.map((current, index) => {
    const edited = candidate.supportHouse.features[index];
    return edited
      ? {
          ...current,
          title: edited.title.trim(),
          description: edited.description.trim(),
          visible: edited.visible,
        }
      : current;
  });

  next.infrastructure.title = candidate.infrastructure.title.trim();
  next.infrastructure.description = candidate.infrastructure.description.trim();
  next.infrastructure.items = next.infrastructure.items.map((current, index) => {
    const edited = candidate.infrastructure.items[index];
    return edited
      ? {
          ...current,
          title: edited.title.trim(),
          description: edited.description.trim(),
          visible: edited.visible,
        }
      : current;
  });

  next.location.title = candidate.location.title.trim();
  next.location.introduction = candidate.location.introduction.trim();
  next.location.approximateLocation = candidate.location.approximateLocation?.trim() || null;
  next.location.distanceToCenter = candidate.location.distanceToCenter?.trim() || null;
  next.location.accessCondition = candidate.location.accessCondition?.trim() || null;
  next.location.note = candidate.location.note.trim();

  next.contact.title = candidate.contact.title.trim();
  next.contact.description = candidate.contact.description.trim();
  next.contact.email = candidate.contact.email!.trim().toLowerCase();
  next.contact.buttonLabel = candidate.contact.buttonLabel.trim();
  next.contact.floatingButtonLabel = candidate.contact.floatingButtonLabel.trim();
  next.contact.whatsapp = {
    countryCode: candidate.contact.whatsapp.countryCode.trim(),
    number: candidate.contact.whatsapp.number.trim(),
    message: candidate.contact.whatsapp.message.trim(),
  };

  next.negotiation.description = candidate.negotiation.description.trim();
  next.negotiation.paymentMethods = normalizeStrings(candidate.negotiation.paymentMethods, 8, 100);
  next.negotiation.price.showPrice = candidate.negotiation.price.showPrice;
  next.negotiation.price.amount = candidate.negotiation.price.showPrice
    ? candidate.negotiation.price.amount
    : null;
  next.faq.title = candidate.faq.title.trim();
  next.faq.items = candidate.faq.items
    .map((item) => ({
      id: item.id.trim(),
      question: item.question.trim(),
      answer: item.answer.trim(),
      order: item.order,
      visible: item.visible,
    }))
    .sort((a, b) => a.order - b.order)
    .map((item, index) => ({ ...item, order: index + 1 }));

  return { ok: true, content: next };
}

function mergeEspaco(
  base: EspacoFernandesContent,
  candidate: EspacoFernandesContent,
): ValidationResult<EspacoFernandesContent> {
  const errors: string[] = [];

  if (!hasText(candidate.brand?.name, 100)) errors.push("Informe o nome do espaço.");
  if (!hasText(candidate.hero?.identification, 180)) errors.push("Informe a identificação principal.");
  if (!hasText(candidate.hero?.title, 180)) errors.push("Informe o título da primeira tela.");
  if (!hasText(candidate.hero?.description, 500)) errors.push("Informe a apresentação principal.");
  if (!hasText(candidate.hero?.primaryButton, 100)) errors.push("Informe o texto do botão principal.");
  if (!hasText(candidate.about?.title, 180) || !hasText(candidate.about?.text, 900)) {
    errors.push("Revise os textos de apresentação.");
  }
  if (!hasText(candidate.structure?.title, 180) || !hasText(candidate.structure?.description, 900)) {
    errors.push("Revise os textos de estrutura.");
  }
  if (!Array.isArray(candidate.structure?.amenities) || candidate.structure.amenities.length !== base.structure.amenities.length) {
    errors.push("Revise a lista de comodidades.");
  }
  if (!Array.isArray(candidate.occasions?.items) || candidate.occasions.items.length > 30) {
    errors.push("Revise a lista de ocasiões.");
  }
  if (!hasText(candidate.chalet?.title, 180) || !hasText(candidate.chalet?.text, 900)) {
    errors.push("Revise os textos do chalé.");
  }
  if (!hasText(candidate.location?.title, 180) || !Array.isArray(candidate.location?.addressLines)) {
    errors.push("Revise os dados de localização.");
  }
  if (!validHttpUrl(candidate.location?.mapUrl) || !validHttpUrl(candidate.location?.mapEmbedUrl)) {
    errors.push("Informe links válidos para o mapa.");
  }
  if (!hasText(candidate.contact?.title, 180) || !hasText(candidate.contact?.text, 900)) {
    errors.push("Revise os textos de contato.");
  }
  if (!validWhatsapp(candidate.contact?.whatsapp?.countryCode ?? "", candidate.contact?.whatsapp?.number ?? "")) {
    errors.push("Informe um número de WhatsApp válido, somente com dígitos.");
  }
  if (!hasText(candidate.contact?.whatsapp?.message, 700)) errors.push("Informe a mensagem automática do WhatsApp.");
  if (!validInstagram(candidate.contact?.instagram?.url ?? "")) errors.push("Informe um link válido do Instagram.");
  if (!validEmail(candidate.contact?.email?.address ?? "")) errors.push("Informe um e-mail válido.");
  if (!validateFaqItems(candidate.faq?.items)) errors.push("Revise as perguntas frequentes.");
  if (candidate.pricing?.mostrarPreco && !hasText(candidate.pricing?.valor, 100)) {
    errors.push("Informe o valor da diária ou mantenha a exibição do preço desativada.");
  }

  if (errors.length > 0) return { ok: false, errors };

  const next = clone(base);
  next.brand.name = candidate.brand.name.trim();
  next.hero.identification = candidate.hero.identification.trim();
  next.hero.title = candidate.hero.title.trim();
  next.hero.description = candidate.hero.description.trim();
  next.hero.primaryButton = candidate.hero.primaryButton.trim();
  next.hero.secondaryButton = candidate.hero.secondaryButton.trim();
  next.about.title = candidate.about.title.trim();
  next.about.text = candidate.about.text.trim();
  next.structure.title = candidate.structure.title.trim();
  next.structure.description = candidate.structure.description.trim();
  next.structure.amenities = next.structure.amenities.map((current) => {
    const edited = candidate.structure.amenities.find((item) => item.id === current.id);
    return edited
      ? {
          ...current,
          title: edited.title.trim(),
          description: edited.description.trim(),
          visible: edited.visible !== false,
          order: Number.isInteger(edited.order) ? edited.order : 0,
        }
      : current;
  });
  next.occasions.title = candidate.occasions.title.trim();
  next.occasions.items = normalizeStrings(candidate.occasions.items, 30, 120);
  next.chalet.title = candidate.chalet.title.trim();
  next.chalet.text = candidate.chalet.text.trim();
  next.location.title = candidate.location.title.trim();
  next.location.addressLines = normalizeStrings(candidate.location.addressLines, 6, 180);
  next.location.mapUrl = candidate.location.mapUrl?.trim() || null;
  next.location.mapEmbedUrl = candidate.location.mapEmbedUrl?.trim() || null;
  next.contact.title = candidate.contact.title.trim();
  next.contact.text = candidate.contact.text.trim();
  next.contact.whatsapp = {
    ...next.contact.whatsapp,
    countryCode: candidate.contact.whatsapp.countryCode.trim(),
    number: candidate.contact.whatsapp.number.trim(),
    message: candidate.contact.whatsapp.message.trim(),
    label: candidate.contact.whatsapp.label.trim(),
  };
  next.contact.instagram = {
    url: candidate.contact.instagram.url.trim(),
    label: candidate.contact.instagram.label.trim(),
  };
  next.contact.email = {
    address: candidate.contact.email.address.trim().toLowerCase(),
    label: candidate.contact.email.label.trim(),
  };
  next.pricing.mostrarPreco = candidate.pricing.mostrarPreco;
  next.pricing.valor = candidate.pricing.mostrarPreco ? candidate.pricing.valor?.trim() || null : null;
  next.faq.title = candidate.faq.title.trim();
  next.faq.items = candidate.faq.items
    .map((item) => ({
      id: item.id.trim(),
      question: item.question.trim(),
      answer: item.answer.trim(),
      order: item.order,
      visible: item.visible,
    }))
    .sort((a, b) => a.order - b.order)
    .map((item, index) => ({ ...item, order: index + 1 }));

  return { ok: true, content: next };
}

export function validateAndMergeEditableContent<S extends EditableSiteSlug>(
  siteSlug: S,
  base: SiteContentMap[S],
  candidate: unknown,
): ValidationResult<SiteContentMap[S]> {
  if (!isRecord(candidate)) {
    return { ok: false, errors: ["O conteúdo enviado não pôde ser lido."] };
  }

  try {
    if (siteSlug === "chacara-alto-dos-torres") {
      return mergeChacara(
        base as PropertyContent,
        candidate as unknown as PropertyContent,
      ) as ValidationResult<SiteContentMap[S]>;
    }

    return mergeEspaco(
      base as EspacoFernandesContent,
      candidate as unknown as EspacoFernandesContent,
    ) as ValidationResult<SiteContentMap[S]>;
  } catch {
    return {
      ok: false,
      errors: ["O conteúdo enviado está incompleto ou possui campos inválidos."],
    };
  }
}
