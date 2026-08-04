export type PropertyStatus = "available" | "reserved" | "sold";

export type HighlightIcon =
  | "sprout"
  | "land-plot"
  | "house"
  | "rows"
  | "leaf"
  | "route";

export type GalleryCategory =
  | "overview"
  | "coffee"
  | "pineapple"
  | "other-crops"
  | "support-house"
  | "water"
  | "access";

export interface SectionVisibility {
  overview: boolean;
  highlights: boolean;
  crops: boolean;
  productivePotential: boolean;
  gallery: boolean;
  videos: boolean;
  propertyDetails: boolean;
  supportHouse: boolean;
  location: boolean;
  documentation: boolean;
  pricing: boolean;
  contact: boolean;
  faq: boolean;
  finalCta: boolean;
}

export interface ContentImage {
  src: string;
  alt: string;
  caption?: string;
  isPlaceholder: boolean;
}

export interface NavigationItem {
  label: string;
  href: string;
}

export interface HighlightItem {
  title: string;
  description: string;
  icon: HighlightIcon;
  visible: boolean;
}

export interface CropItem {
  id: string;
  name: string;
  description: string;
  image: ContentImage;
  quantity: string | null;
  unit: string | null;
  productionStage: string | null;
  harvestInfo: string | null;
  visible: boolean;
}

export interface PotentialItem {
  title: string;
  description: string;
  icon: HighlightIcon;
  visible: boolean;
}

export interface AreaField {
  label: string;
  value: string | null;
  unit: string | null;
  showWhenUnknown: boolean;
}

export type PropertyDetailKey =
  | "terrain"
  | "soil"
  | "fences"
  | "water"
  | "energy"
  | "internet"
  | "carAccess"
  | "truckAccess"
  | "distanceToCity"
  | "distanceToPavement"
  | "internalRoads"
  | "vegetation"
  | "preservationAreas"
  | "other";

export interface PropertyDetailItem {
  key: PropertyDetailKey;
  label: string;
  value: string | null;
  showWhenUnknown: boolean;
  visible: boolean;
}

export interface GalleryItem extends ContentImage {
  id: string;
  category: GalleryCategory;
  order: number;
  visible: boolean;
}

export interface GalleryCategoryOption {
  id: "all" | GalleryCategory;
  label: string;
}

export interface PropertyVideo {
  id: string;
  title: string;
  description: string;
  url: string;
  coverImage: ContentImage | null;
  visible: boolean;
}

export interface SupportHouseDetails {
  approximateSize: string | null;
  rooms: string | null;
  bathroom: boolean | null;
  kitchen: boolean | null;
  energy: string | null;
  water: string | null;
  condition: string | null;
  needsRenovation: boolean | null;
  notes: string | null;
}

export interface Coordinates {
  latitude: number | null;
  longitude: number | null;
}

export interface PriceInformation {
  amount: number | null;
  currency: "BRL";
  showPrice: boolean;
  showAsOnRequest: boolean;
  onRequestLabel: string;
}

export interface DocumentationInformation {
  documentType: string | null;
  registryStatus: string | null;
  car: string | null;
  ccir: string | null;
  itr: string | null;
  pendingIssues: string | null;
  legalNotes: string | null;
}

export interface FrequentlyAskedQuestion {
  id: string;
  question: string;
  answer: string;
  order: number;
  visible: boolean;
}

export interface StatusContent {
  label: string;
  message: string | null;
  contactReplacement: string | null;
}

export interface PropertyContent {
  propertyName: string;
  status: PropertyStatus;
  statusContent: Record<PropertyStatus, StatusContent>;
  shortDescription: string;
  fullDescription: string;
  sections: SectionVisibility;
  header: {
    navigationLabel: string;
    openMenuLabel: string;
    closeMenuLabel: string;
    navigation: NavigationItem[];
    contactLabel: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    canonicalUrl: string | null;
    favicon: string;
    openGraph: {
      title: string;
      description: string;
      image: string;
      imageAlt: string;
    };
    twitter: {
      card: "summary_large_image";
      title: string;
      description: string;
      image: string;
    };
    robots: {
      index: boolean;
      follow: boolean;
    };
    structuredData: {
      enabled: boolean;
      propertyType: string;
      includeExactAddress: boolean;
    };
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    mainImage: ContentImage;
    quickFacts: string[];
    primaryActionLabel: string;
    secondaryActionLabel: string;
    secondaryActionTarget: string;
    detailsNotice: string;
  };
  overview: {
    id: string;
    eyebrow: string;
    title: string;
    paragraphs: string[];
  };
  highlights: {
    items: HighlightItem[];
  };
  crops: {
    id: string;
    eyebrow: string;
    title: string;
    introduction: string;
    items: CropItem[];
    fieldLabels: {
      quantity: string;
      productionStage: string;
      harvest: string;
    };
  };
  productivePotential: {
    id: string;
    eyebrow: string;
    title: string;
    description: string;
    items: PotentialItem[];
    disclaimer: string;
  };
  area: {
    total: AreaField;
    planted: AreaField;
    free: AreaField;
  };
  propertyDetails: {
    id: string;
    eyebrow: string;
    title: string;
    unknownValueLabel: string;
    items: PropertyDetailItem[];
  };
  gallery: {
    id: string;
    eyebrow: string;
    title: string;
    description: string;
    categories: GalleryCategoryOption[];
    items: GalleryItem[];
    controls: {
      openImageLabel: string;
      closeLabel: string;
      previousLabel: string;
      nextLabel: string;
      dialogLabel: string;
      emptyLabel: string;
    };
  };
  videos: {
    id: string;
    eyebrow: string;
    title: string;
    description: string;
    playLabel: string;
    items: PropertyVideo[];
  };
  supportHouse: {
    id: string;
    eyebrow: string;
    title: string;
    paragraphs: string[];
    details: SupportHouseDetails;
    labels: Record<keyof SupportHouseDetails, string>;
    photos: ContentImage[];
  };
  location: {
    id: string;
    eyebrow: string;
    title: string;
    introduction: string;
    city: string | null;
    state: string | null;
    region: string | null;
    community: string | null;
    approximateLocation: string | null;
    distanceToCenter: string | null;
    estimatedTravelTime: string | null;
    pavedRoadDistance: string | null;
    dirtRoadDistance: string | null;
    accessCondition: string | null;
    entranceType: string | null;
    coordinates: Coordinates;
    mapUrl: string | null;
    showMap: boolean;
    showExactAddress: boolean;
    note: string;
    labels: {
      city: string;
      state: string;
      region: string;
      community: string;
      distanceToCenter: string;
      estimatedTravelTime: string;
      pavedRoadDistance: string;
      dirtRoadDistance: string;
      accessCondition: string;
      entranceType: string;
    };
  };
  negotiation: {
    id: string;
    eyebrow: string;
    title: string;
    description: string;
    price: PriceInformation;
    acceptsOffer: boolean | null;
    paymentMethods: string[];
    acceptsVehicle: boolean | null;
    acceptsOtherProperty: boolean | null;
    installmentTerms: string | null;
    documentation: DocumentationInformation;
    labels: {
      price: string;
      acceptsOffer: string;
      paymentMethods: string;
      acceptsVehicle: string;
      acceptsOtherProperty: string;
      installmentTerms: string;
      documentation: string;
    };
  };
  contact: {
    id: string;
    eyebrow: string;
    title: string;
    description: string;
    ownerName: string | null;
    bestContactTime: string | null;
    directContactLabel: string;
    ownerLabel: string;
    bestContactTimeLabel: string;
    buttonLabel: string;
    floatingButtonLabel: string;
    unavailableButtonLabel: string;
    whatsapp: {
      countryCode: string;
      number: string;
      message: string;
    };
  };
  faq: {
    id: string;
    eyebrow: string;
    title: string;
    items: FrequentlyAskedQuestion[];
  };
  finalCta: {
    id: string;
    title: string;
    description: string;
    buttonLabel: string;
    directSaleLabel: string;
    backgroundImage: ContentImage;
  };
  footer: {
    propertyTypeLabel: string;
    whatsappLabel: string;
    locationFallback: string;
    updateNotice: string;
    backToTopLabel: string;
  };
}

const provisionalSeoDescription =
  "Propriedade rural com plantações de café, abacaxi e outras culturas, além de construção simples de apoio. Entre em contato para solicitar mais informações.";

/**
 * Conteúdo único da landing page.
 * Use `null` para dados ainda não confirmados; a interface não deve mostrar campos vazios.
 */
export const property: PropertyContent = {
  propertyName: "Propriedade Rural",
  status: "available",
  statusContent: {
    available: {
      label: "Disponível",
      message: null,
      contactReplacement: null,
    },
    reserved: {
      label: "Reservada",
      message: "Esta propriedade está reservada no momento.",
      contactReplacement: "Esta propriedade está reservada no momento.",
    },
    sold: {
      label: "Vendida",
      message: "Esta propriedade foi vendida.",
      contactReplacement: "Esta propriedade foi vendida.",
    },
  },
  shortDescription:
    "Terra rural produtiva com lavouras implantadas e construção simples de apoio.",
  fullDescription:
    "A propriedade reúne terra, lavouras já implantadas e uma estrutura simples de apoio. É uma oportunidade para quem deseja continuar a produção existente, ampliar os cultivos ou desenvolver um novo projeto rural de acordo com as características da área e as autorizações aplicáveis. Atualmente, o imóvel possui plantações de café, abacaxi e outras culturas. Os dados técnicos estão sendo organizados e serão adicionados após o levantamento completo.",

  // Desative uma seção aqui sem precisar alterar os componentes.
  sections: {
    overview: true,
    highlights: true,
    crops: true,
    productivePotential: true,
    gallery: true,
    videos: false,
    propertyDetails: true,
    supportHouse: true,
    location: true,
    documentation: false,
    pricing: false,
    contact: true,
    faq: true,
    finalCta: true,
  },

  header: {
    navigationLabel: "Navegação principal",
    openMenuLabel: "Abrir menu",
    closeMenuLabel: "Fechar menu",
    navigation: [
      { label: "Visão geral", href: "#visao-geral" },
      { label: "Plantações", href: "#plantacoes" },
      { label: "Características", href: "#caracteristicas" },
      { label: "Galeria", href: "#galeria" },
      { label: "Localização", href: "#localizacao" },
      { label: "Contato", href: "#contato" },
    ],
    contactLabel: "Falar com o proprietário",
  },

  seo: {
    title: "Propriedade rural produtiva à venda",
    description: provisionalSeoDescription,
    keywords: [
      "propriedade rural à venda",
      "terra produtiva",
      "plantação de café",
      "plantação de abacaxi",
      "venda direta com proprietário",
    ],
    canonicalUrl: null,
    favicon: "/favicon.png",
    openGraph: {
      title: "Propriedade rural produtiva à venda",
      description: provisionalSeoDescription,
      image: "/og.png",
      imageAlt: "Ilustração editorial de uma propriedade rural produtiva à venda",
    },
    twitter: {
      card: "summary_large_image",
      title: "Propriedade rural produtiva à venda",
      description: provisionalSeoDescription,
      image: "/og.png",
    },
    robots: {
      index: true,
      follow: true,
    },
    structuredData: {
      enabled: true,
      propertyType: "Propriedade rural produtiva",
      includeExactAddress: false,
    },
  },

  hero: {
    eyebrow: "Propriedade rural produtiva à venda",
    title: "Terra produtiva, lavouras implantadas e espaço para novos projetos",
    subtitle:
      "Propriedade rural à venda com plantações de café, abacaxi e outras culturas, além de uma construção simples de apoio.",
    mainImage: {
      src: "/images/property/hero.webp",
      alt: "Foto principal temporária da propriedade rural",
      caption: "Foto principal da propriedade — imagem temporária",
      isPlaceholder: true,
    },
    quickFacts: [
      "Área total a confirmar",
      "Localização a confirmar",
      "Café e abacaxi plantados",
      "Venda direta com o proprietário",
    ],
    primaryActionLabel: "Solicitar informações pelo WhatsApp",
    secondaryActionLabel: "Conhecer a propriedade",
    secondaryActionTarget: "#visao-geral",
    detailsNotice:
      "Informações detalhadas, medidas e condições de venda serão atualizadas após a conclusão do levantamento da propriedade.",
  },

  overview: {
    id: "visao-geral",
    eyebrow: "Visão geral",
    title: "Uma área rural com vocação para produzir",
    paragraphs: [
      "A propriedade reúne terra, lavouras já implantadas e uma estrutura simples de apoio. É uma oportunidade para quem deseja continuar a produção existente, ampliar os cultivos ou desenvolver um novo projeto rural de acordo com as características da área e as autorizações aplicáveis.",
      "Atualmente, o imóvel possui plantações de café, abacaxi e outras culturas. As informações sobre área cultivada, quantidade de plantas, estágio da produção e previsão de colheita serão adicionadas após o levantamento completo.",
    ],
  },

  highlights: {
    items: [
      {
        title: "Lavouras existentes",
        description: "Café, abacaxi e outras culturas já presentes na propriedade.",
        icon: "sprout",
        visible: true,
      },
      {
        title: "Área rural produtiva",
        description: "Terra rural voltada principalmente para produção agrícola.",
        icon: "land-plot",
        visible: true,
      },
      {
        title: "Construção de apoio",
        description: "Estrutura pequena, simples e funcional para apoio e repouso.",
        icon: "house",
        visible: true,
      },
      {
        title: "Possibilidade de novos cultivos",
        description:
          "Área com potencial para projetos rurais compatíveis com suas características e com as autorizações aplicáveis.",
        icon: "rows",
        visible: true,
      },
    ],
  },

  crops: {
    id: "plantacoes",
    eyebrow: "Plantações",
    title: "Cultivos já presentes na propriedade",
    introduction:
      "Além da terra, o comprador receberá as plantações existentes na propriedade, conforme as condições que serão detalhadas na negociação.",
    fieldLabels: {
      quantity: "Quantidade",
      productionStage: "Estágio da produção",
      harvest: "Informações de colheita",
    },
    items: [
      {
        id: "cafe",
        name: "Café",
        description:
          "A propriedade possui plantação de café. A quantidade de pés, a variedade, o estágio produtivo e os dados das últimas colheitas estão sendo levantados.",
        image: {
          src: "/images/property/cafe-01.webp",
          alt: "Imagem temporária destinada à plantação de café",
          caption: "Plantação de café — imagem temporária",
          isPlaceholder: true,
        },
        quantity: null,
        unit: null,
        productionStage: null,
        harvestInfo: null,
        visible: true,
      },
      {
        id: "abacaxi",
        name: "Abacaxi",
        description:
          "Há também cultivo de abacaxi na área. A extensão plantada, a variedade e a previsão de produção serão informadas após a confirmação dos dados.",
        image: {
          src: "/images/property/abacaxi-01.webp",
          alt: "Imagem temporária destinada à plantação de abacaxi",
          caption: "Plantação de abacaxi — imagem temporária",
          isPlaceholder: true,
        },
        quantity: null,
        unit: null,
        productionStage: null,
        harvestInfo: null,
        visible: true,
      },
      {
        id: "outras-culturas",
        name: "Outras culturas",
        description:
          "Outras frutas, plantas e culturas existentes serão identificadas e adicionadas ao anúncio.",
        image: {
          src: "/images/property/outras-culturas-01.webp",
          alt: "Imagem temporária destinada a outras culturas da propriedade",
          caption: "Outras culturas — imagem temporária",
          isPlaceholder: true,
        },
        quantity: null,
        unit: null,
        productionStage: null,
        harvestInfo: null,
        visible: true,
      },
    ],
  },

  productivePotential: {
    id: "potencial-produtivo",
    eyebrow: "Potencial produtivo",
    title: "Uma propriedade com diferentes possibilidades de aproveitamento",
    description:
      "A área pode interessar a compradores que desejam continuar os cultivos existentes, ampliar a produção, iniciar novas plantações ou planejar outros usos rurais compatíveis com a documentação e as regras aplicáveis ao imóvel.",
    items: [
      {
        title: "Continuidade da produção",
        description:
          "Possibilidade de aproveitar as plantações já existentes e dar continuidade aos cuidados e ciclos produtivos.",
        icon: "sprout",
        visible: true,
      },
      {
        title: "Expansão de cultivos",
        description:
          "Áreas disponíveis e características do terreno serão apresentadas para ajudar o interessado a avaliar novos plantios.",
        icon: "rows",
        visible: true,
      },
      {
        title: "Projeto rural próprio",
        description:
          "O comprador poderá estudar novas formas de aproveitamento da propriedade, respeitando a documentação, as características da terra e as autorizações necessárias.",
        icon: "leaf",
        visible: true,
      },
    ],
    disclaimer:
      "As possibilidades de uso dependem das características da área, da documentação e das autorizações aplicáveis.",
  },

  // Informe medidas somente depois de confirmá-las.
  area: {
    total: {
      label: "Área total",
      value: null,
      unit: null,
      showWhenUnknown: true,
    },
    planted: {
      label: "Área plantada",
      value: null,
      unit: null,
      showWhenUnknown: false,
    },
    free: {
      label: "Área livre",
      value: null,
      unit: null,
      showWhenUnknown: false,
    },
  },

  propertyDetails: {
    id: "caracteristicas",
    eyebrow: "Características",
    title: "Conheça as características da propriedade",
    unknownValueLabel: "Informação em levantamento",
    items: [
      { key: "terrain", label: "Relevo", value: null, showWhenUnknown: false, visible: true },
      { key: "soil", label: "Solo", value: null, showWhenUnknown: false, visible: true },
      {
        key: "fences",
        label: "Cercas e divisas",
        value: null,
        showWhenUnknown: false,
        visible: true,
      },
      { key: "water", label: "Água", value: null, showWhenUnknown: true, visible: true },
      { key: "energy", label: "Energia", value: null, showWhenUnknown: true, visible: true },
      {
        key: "internet",
        label: "Internet e sinal",
        value: null,
        showWhenUnknown: false,
        visible: true,
      },
      {
        key: "carAccess",
        label: "Acesso de carros",
        value: null,
        showWhenUnknown: true,
        visible: true,
      },
      {
        key: "truckAccess",
        label: "Acesso de caminhões",
        value: null,
        showWhenUnknown: false,
        visible: true,
      },
      {
        key: "distanceToCity",
        label: "Distância até a cidade",
        value: null,
        showWhenUnknown: false,
        visible: true,
      },
      {
        key: "distanceToPavement",
        label: "Distância até o asfalto",
        value: null,
        showWhenUnknown: false,
        visible: true,
      },
      {
        key: "internalRoads",
        label: "Estradas internas",
        value: null,
        showWhenUnknown: false,
        visible: true,
      },
      {
        key: "vegetation",
        label: "Vegetação",
        value: null,
        showWhenUnknown: false,
        visible: true,
      },
      {
        key: "preservationAreas",
        label: "Áreas de preservação",
        value: null,
        showWhenUnknown: false,
        visible: true,
      },
      {
        key: "other",
        label: "Outras informações",
        value: null,
        showWhenUnknown: false,
        visible: true,
      },
    ],
  },

  gallery: {
    id: "galeria",
    eyebrow: "Galeria",
    title: "Veja a propriedade em detalhes",
    description:
      "As imagens reais da área, das plantações, do acesso e das estruturas serão adicionadas nesta galeria.",
    categories: [
      { id: "all", label: "Todas" },
      { id: "overview", label: "Vista geral" },
      { id: "coffee", label: "Café" },
      { id: "pineapple", label: "Abacaxi" },
      { id: "other-crops", label: "Outras culturas" },
      { id: "support-house", label: "Construção de apoio" },
      { id: "water", label: "Água" },
      { id: "access", label: "Acesso" },
    ],
    // Altere `order` para reorganizar as fotos.
    items: [
      {
        id: "vista-geral-01",
        src: "/images/property/vista-geral-01.webp",
        alt: "Imagem temporária destinada à vista geral da propriedade",
        caption: "Vista geral da área — imagem temporária",
        isPlaceholder: true,
        category: "overview",
        order: 1,
        visible: true,
      },
      {
        id: "cafe-01",
        src: "/images/property/cafe-01.webp",
        alt: "Imagem temporária destinada à plantação de café",
        caption: "Plantação de café — imagem temporária",
        isPlaceholder: true,
        category: "coffee",
        order: 2,
        visible: true,
      },
      {
        id: "abacaxi-01",
        src: "/images/property/abacaxi-01.webp",
        alt: "Imagem temporária destinada à plantação de abacaxi",
        caption: "Plantação de abacaxi — imagem temporária",
        isPlaceholder: true,
        category: "pineapple",
        order: 3,
        visible: true,
      },
      {
        id: "outras-culturas-01",
        src: "/images/property/outras-culturas-01.webp",
        alt: "Imagem temporária destinada a outras culturas da propriedade",
        caption: "Outras culturas — imagem temporária",
        isPlaceholder: true,
        category: "other-crops",
        order: 4,
        visible: true,
      },
      {
        id: "construcao-apoio-01",
        src: "/images/property/construcao-apoio-01.webp",
        alt: "Imagem temporária destinada à construção simples de apoio",
        caption: "Construção de apoio — imagem temporária",
        isPlaceholder: true,
        category: "support-house",
        order: 5,
        visible: true,
      },
      {
        id: "agua-01",
        src: "/images/property/agua-01.webp",
        alt: "Imagem temporária destinada às informações sobre água",
        caption: "Água — imagem temporária",
        isPlaceholder: true,
        category: "water",
        order: 6,
        visible: true,
      },
      {
        id: "acesso-01",
        src: "/images/property/acesso-01.webp",
        alt: "Imagem temporária destinada à estrada de acesso",
        caption: "Estrada de acesso — imagem temporária",
        isPlaceholder: true,
        category: "access",
        order: 7,
        visible: true,
      },
    ],
    controls: {
      openImageLabel: "Abrir imagem em tamanho maior",
      closeLabel: "Fechar imagem",
      previousLabel: "Imagem anterior",
      nextLabel: "Próxima imagem",
      dialogLabel: "Visualização ampliada da galeria",
      emptyLabel: "Nenhuma imagem disponível nesta categoria.",
    },
  },

  // A seção permanece oculta enquanto esta lista estiver vazia.
  videos: {
    id: "videos",
    eyebrow: "Vídeos",
    title: "Conheça a propriedade em vídeo",
    description:
      "Os vídeos reais da propriedade poderão ser adicionados aqui por meio de links do YouTube ou Vimeo.",
    playLabel: "Reproduzir vídeo",
    items: [],
  },

  supportHouse: {
    id: "construcao-de-apoio",
    eyebrow: "Construção de apoio",
    title: "Estrutura simples de apoio",
    paragraphs: [
      "A propriedade conta com uma construção pequena e simples, utilizada como apoio, repouso ou permanência durante os trabalhos realizados na área.",
      "Informações sobre tamanho, cômodos, água, energia e estado de conservação serão adicionadas após a vistoria e o levantamento completo.",
    ],
    details: {
      approximateSize: null,
      rooms: null,
      bathroom: null,
      kitchen: null,
      energy: null,
      water: null,
      condition: null,
      needsRenovation: null,
      notes: null,
    },
    labels: {
      approximateSize: "Tamanho aproximado",
      rooms: "Número de cômodos",
      bathroom: "Banheiro",
      kitchen: "Cozinha",
      energy: "Energia",
      water: "Água",
      condition: "Estado de conservação",
      needsRenovation: "Necessidade de reforma",
      notes: "Observações",
    },
    photos: [
      {
        src: "/images/property/construcao-apoio-01.webp",
        alt: "Imagem temporária destinada à construção simples de apoio",
        caption: "Construção de apoio — imagem temporária",
        isPlaceholder: true,
      },
    ],
  },

  // Não informe o endereço exato por padrão.
  location: {
    id: "localizacao",
    eyebrow: "Localização",
    title: "Localização e acesso",
    introduction:
      "A propriedade está situada em área rural. A região, as distâncias e as condições detalhadas do acesso serão informadas após a confirmação dos dados.",
    city: null,
    state: null,
    region: null,
    community: null,
    approximateLocation: null,
    distanceToCenter: null,
    estimatedTravelTime: null,
    pavedRoadDistance: null,
    dirtRoadDistance: null,
    accessCondition: null,
    entranceType: null,
    coordinates: {
      latitude: null,
      longitude: null,
    },
    mapUrl: null,
    showMap: false,
    showExactAddress: false,
    note: "A localização completa poderá ser fornecida aos interessados durante o atendimento.",
    labels: {
      city: "Cidade",
      state: "Estado",
      region: "Região",
      community: "Comunidade",
      distanceToCenter: "Distância até o centro",
      estimatedTravelTime: "Tempo estimado de deslocamento",
      pavedRoadDistance: "Distância em estrada asfaltada",
      dirtRoadDistance: "Distância em estrada de terra",
      accessCondition: "Condição do acesso",
      entranceType: "Tipo de entrada",
    },
  },

  // Mantenha preço e documentação ocultos até a confirmação dos dados.
  negotiation: {
    id: "negociacao",
    eyebrow: "Negociação",
    title: "Informações para negociação",
    description:
      "Os detalhes sobre valor, documentação e condições de negociação serão apresentados de forma transparente aos interessados.",
    price: {
      amount: null,
      currency: "BRL",
      showPrice: false,
      showAsOnRequest: true,
      onRequestLabel: "Valor sob consulta",
    },
    acceptsOffer: null,
    paymentMethods: [],
    acceptsVehicle: null,
    acceptsOtherProperty: null,
    installmentTerms: null,
    documentation: {
      documentType: null,
      registryStatus: null,
      car: null,
      ccir: null,
      itr: null,
      pendingIssues: null,
      legalNotes: null,
    },
    labels: {
      price: "Valor",
      acceptsOffer: "Aceita proposta",
      paymentMethods: "Formas de pagamento",
      acceptsVehicle: "Aceita veículo",
      acceptsOtherProperty: "Aceita outro imóvel",
      installmentTerms: "Parcelamento",
      documentation: "Documentação",
    },
  },

  contact: {
    id: "contato",
    eyebrow: "Venda direta",
    title: "Converse diretamente com o proprietário",
    description:
      "A negociação será realizada diretamente com o responsável pela propriedade. Entre em contato para tirar dúvidas, solicitar informações complementares ou combinar uma visita.",
    ownerName: null,
    bestContactTime: null,
    directContactLabel: "Contato direto com o proprietário",
    ownerLabel: "Responsável",
    bestContactTimeLabel: "Melhor horário para contato",
    buttonLabel: "Falar pelo WhatsApp",
    floatingButtonLabel: "Falar com o proprietário pelo WhatsApp",
    unavailableButtonLabel: "Contato indisponível enquanto o número não for informado",
    whatsapp: {
      // Preencha código do país e número somente com algarismos.
      countryCode: "",
      number: "",
      message:
        "Olá! Vi o site da propriedade rural e gostaria de receber mais informações.",
    },
  },

  faq: {
    id: "perguntas-frequentes",
    eyebrow: "Perguntas frequentes",
    title: "Dúvidas sobre a propriedade",
    items: [
      {
        id: "tamanho-da-propriedade",
        question: "Qual é o tamanho da propriedade?",
        answer: "A área total está sendo confirmada e será adicionada ao anúncio.",
        order: 1,
        visible: true,
      },
      {
        id: "itens-incluidos",
        question: "O que está incluído na venda?",
        answer:
          "A propriedade, as estruturas existentes e as plantações presentes serão incluídas conforme as condições definidas na negociação.",
        order: 2,
        visible: true,
      },
      {
        id: "producao-da-plantacao",
        question: "A plantação está produzindo?",
        answer:
          "Os dados sobre estágio produtivo, quantidade de plantas e colheitas estão sendo levantados.",
        order: 3,
        visible: true,
      },
      {
        id: "acesso",
        question: "Como é o acesso?",
        answer:
          "As distâncias, o tipo de estrada e as condições de acesso serão informados após a confirmação das informações.",
        order: 4,
        visible: true,
      },
      {
        id: "documentacao",
        question: "A propriedade possui documentação?",
        answer:
          "A situação documental será apresentada assim que todos os documentos forem conferidos.",
        order: 5,
        visible: true,
      },
      {
        id: "agendar-visita",
        question: "Posso agendar uma visita?",
        answer:
          "Sim. Entre em contato pelo WhatsApp para conversar com o responsável e verificar a disponibilidade.",
        order: 6,
        visible: true,
      },
    ],
  },

  finalCta: {
    id: "mais-informacoes",
    title: "Quer receber mais informações sobre a propriedade?",
    description:
      "Fale diretamente com o responsável para conhecer os detalhes, solicitar fotos adicionais e verificar a possibilidade de agendar uma visita.",
    buttonLabel: "Conversar pelo WhatsApp",
    directSaleLabel: "Venda direta com o proprietário.",
    backgroundImage: {
      src: "/images/property/vista-geral-01.webp",
      alt: "Imagem temporária de uma vista geral da propriedade rural",
      caption: "Vista geral da propriedade — imagem temporária",
      isPlaceholder: true,
    },
  },

  footer: {
    propertyTypeLabel: "Propriedade rural à venda",
    whatsappLabel: "Falar pelo WhatsApp",
    locationFallback: "Localização a confirmar",
    updateNotice:
      "As informações deste anúncio podem ser atualizadas após a confirmação dos dados da propriedade.",
    backToTopLabel: "Voltar ao início",
  },
};

export default property;
