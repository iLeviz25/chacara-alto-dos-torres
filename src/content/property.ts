export type PropertyStatus = "available" | "reserved" | "sold";

export type HighlightIcon =
  | "sprout"
  | "land-plot"
  | "house"
  | "rows"
  | "leaf"
  | "route"
  | "armchair"
  | "cooking-pot"
  | "droplets"
  | "cloud-rain"
  | "zap";

export type GalleryCategory =
  | "overview"
  | "house"
  | "veranda"
  | "country-kitchen"
  | "orchard-crops"
  | "water-infrastructure"
  | "landscape"
  | "access";

export type VideoFormat = "horizontal" | "vertical";
export type VideoRole = "main" | "short";

export interface SectionVisibility {
  overview: boolean;
  highlights: boolean;
  crops: boolean;
  productivePotential: boolean;
  infrastructure: boolean;
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
  fit?: "cover" | "contain";
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
  role: VideoRole;
  format: VideoFormat;
  visible: boolean;
}

export interface SupportHouseDetails {
  approximateSize: string | null;
  rooms: string | null;
  bedrooms: string | null;
  bathrooms: string | null;
  kitchen: string | null;
  livingRoom: string | null;
  energy: string | null;
  water: string | null;
  condition: string | null;
  furnitureIncluded: string | null;
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
  brand: {
    logo: ContentImage;
  };
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
    culturesTitle: string;
    cultures: string[];
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
  infrastructure: {
    id: string;
    eyebrow: string;
    title: string;
    description: string;
    items: HighlightItem[];
  };
  area: {
    total: AreaField;
    planted: AreaField;
    free: AreaField;
  };
  areaEquivalent: string;
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
    features: HighlightItem[];
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

const seoDescription =
  "Conheça a Chácara Alto dos Torres, na Serra de Uibaí: 6 tarefas, pomar produtivo, casa com 5 cômodos, varanda em L, espaço caipira, energia elétrica e 25 mil litros de armazenamento de água.";

const brandLogo: ContentImage = {
  src: "/images/brand/logo-chacara-alto-dos-torres.png",
  alt: "Logo da Chácara Alto dos Torres",
  isPlaceholder: false,
  fit: "contain",
};

/**
 * Conteúdo único da landing page.
 * Use `null` ou uma string vazia para dados ainda não confirmados; a interface
 * não deve mostrar campos vazios.
 */
export const property: PropertyContent = {
  propertyName: "Chácara Alto dos Torres",
  status: "available",
  statusContent: {
    available: {
      label: "Disponível",
      message: null,
      contactReplacement: null,
    },
    reserved: {
      label: "Reservada",
      message: "Esta chácara está reservada no momento.",
      contactReplacement: "Esta chácara está reservada no momento.",
    },
    sold: {
      label: "Vendida",
      message: "Esta chácara foi vendida.",
      contactReplacement: "Esta chácara foi vendida.",
    },
  },
  shortDescription:
    "Chácara produtiva com estrutura para descanso, lazer e agricultura familiar.",
  fullDescription:
    "A Chácara Alto dos Torres é uma propriedade acolhedora na Serra de Uibaí, com 6 tarefas, casa de 5 cômodos, varanda em L, espaço caipira com fogão a lenha, pomar produtivo, cultivos, captação de água da chuva, duas cisternas e energia elétrica funcionando.",

  brand: {
    logo: brandLogo,
  },

  sections: {
    overview: true,
    highlights: true,
    crops: true,
    productivePotential: true,
    infrastructure: true,
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
      { label: "A chácara", href: "#visao-geral" },
      { label: "Pomar e cultivos", href: "#pomar-e-cultivos" },
      { label: "Casa", href: "#casa-e-convivencia" },
      { label: "Infraestrutura", href: "#agua-e-infraestrutura" },
      { label: "Galeria", href: "#galeria" },
      { label: "Localização", href: "#localizacao" },
    ],
    contactLabel: "Falar com o proprietário",
  },

  seo: {
    title: "Chácara Alto dos Torres | Chácara à venda na Serra de Uibaí",
    description: seoDescription,
    keywords: [
      "Chácara Alto dos Torres",
      "chácara à venda na Serra de Uibaí",
      "chácara em Uibaí",
      "chácara produtiva",
      "pomar produtivo",
      "agricultura familiar",
    ],
    canonicalUrl: null,
    favicon: "/favicon.png",
    openGraph: {
      title: "Chácara Alto dos Torres | Serra de Uibaí",
      description: seoDescription,
      image: "/og.png",
      imageAlt: "Identidade visual da Chácara Alto dos Torres na Serra de Uibaí",
    },
    twitter: {
      card: "summary_large_image",
      title: "Chácara Alto dos Torres | Serra de Uibaí",
      description: seoDescription,
      image: "/og.png",
    },
    robots: {
      index: true,
      follow: true,
    },
    structuredData: {
      enabled: true,
      propertyType: "Chácara produtiva",
      includeExactAddress: false,
    },
  },

  hero: {
    eyebrow: "Chácara à venda na Serra de Uibaí",
    title: "Natureza, clima de serra e um espaço pronto para aproveitar",
    subtitle:
      "A Chácara Alto dos Torres reúne 6 tarefas, pomar produtivo, casa com 5 cômodos, varanda em L, espaço caipira com fogão a lenha e estrutura para lazer, descanso ou produção agrícola familiar.",
    mainImage: brandLogo,
    quickFacts: [
      "6 tarefas",
      "Casa com 5 cômodos",
      "Pomar produtivo",
      "25 mil litros de água",
      "Energia elétrica",
    ],
    primaryActionLabel: "Falar com o proprietário",
    secondaryActionLabel: "Conhecer a chácara",
    secondaryActionTarget: "#visao-geral",
    detailsNotice: "",
  },

  overview: {
    id: "visao-geral",
    eyebrow: "A Chácara Alto dos Torres",
    title: "Um refúgio na Serra de Uibaí",
    paragraphs: [
      "A Chácara Alto dos Torres é uma propriedade acolhedora para quem busca tranquilidade, contato com a natureza e clima de serra. Com área informada de 6 tarefas, a chácara possui estrutura para aproveitar os fins de semana, reunir a família ou dar continuidade às atividades agrícolas.",
      "O imóvel conta com casa de 5 cômodos, varanda em L, espaço caipira com fogão a lenha, energia elétrica, sistema de captação de água da chuva e um pomar com diversas culturas já implantadas.",
    ],
  },

  highlights: {
    items: [
      {
        title: "Área da propriedade",
        description: "6 tarefas de área rural, com espaços cultivados e áreas para aproveitamento.",
        icon: "land-plot",
        visible: true,
      },
      {
        title: "Casa",
        description: "Casa com 5 cômodos e estrutura funcional para permanência na propriedade.",
        icon: "house",
        visible: true,
      },
      {
        title: "Varanda em L",
        description: "Varanda ampla e arejada, adequada para descanso, convivência e contemplação da paisagem.",
        icon: "armchair",
        visible: true,
      },
      {
        title: "Espaço caipira",
        description: "Ambiente dedicado com fogão a lenha, ideal para refeições e momentos de convivência.",
        icon: "cooking-pot",
        visible: true,
      },
      {
        title: "Água",
        description: "Sistema de captação de água da chuva e duas cisternas, totalizando 25.000 litros de armazenamento.",
        icon: "droplets",
        visible: true,
      },
      {
        title: "Energia",
        description: "Instalação de energia elétrica pronta e funcionando.",
        icon: "zap",
        visible: true,
      },
    ],
  },

  crops: {
    id: "pomar-e-cultivos",
    eyebrow: "Pomar e cultivos",
    title: "Pomar, cultivos e sabores da propriedade",
    introduction:
      "A chácara possui diversas frutíferas e culturas já implantadas, ampliando as possibilidades de consumo próprio, continuidade dos cuidados e produção agrícola familiar.",
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
          "A propriedade conta com cultivo de café, integrado às demais atividades e plantações da chácara.",
        image: {
          src: "/images/property/cafe-01.webp",
          alt: "Imagem temporária destinada ao cultivo de café da chácara",
          caption: "Café — imagem temporária",
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
        description: "O cultivo de abacaxi também faz parte da área produtiva da propriedade.",
        image: {
          src: "/images/property/abacaxi-01.webp",
          alt: "Imagem temporária destinada ao cultivo de abacaxi da chácara",
          caption: "Abacaxi — imagem temporária",
          isPlaceholder: true,
        },
        quantity: null,
        unit: null,
        productionStage: null,
        harvestInfo: null,
        visible: true,
      },
      {
        id: "pomar-diversificado",
        name: "Pomar diversificado",
        description:
          "O pomar reúne uma ampla variedade de frutas, proporcionando diversidade e diferentes períodos de produção ao longo do ano.",
        image: {
          src: "/images/property/outras-culturas-01.webp",
          alt: "Imagem temporária destinada ao pomar diversificado da chácara",
          caption: "Pomar diversificado — imagem temporária",
          isPlaceholder: true,
        },
        quantity: null,
        unit: null,
        productionStage: null,
        harvestInfo: null,
        visible: true,
      },
    ],
    culturesTitle: "Culturas e frutíferas presentes",
    cultures: [
      "Abacaxi",
      "Abacate",
      "Amora",
      "Seriguela",
      "Pitanga",
      "Tangerina",
      "Acerola",
      "Manga",
      "Limão",
      "Café",
      "Maracujá",
      "Caju",
      "Jaca",
      "Pitaya",
      "Pinha",
      "Banana",
    ],
  },

  productivePotential: {
    id: "possibilidades-de-uso",
    eyebrow: "Possibilidades de uso",
    title: "Um espaço para aproveitar de diferentes maneiras",
    description:
      "A estrutura existente reúne ambientes de convivência, natureza e cultivos para diferentes formas de uso da chácara.",
    items: [
      {
        title: "Lazer e descanso",
        description:
          "Um ambiente tranquilo para aproveitar fins de semana, feriados e momentos de descanso em contato com a natureza.",
        icon: "leaf",
        visible: true,
      },
      {
        title: "Convivência em família",
        description:
          "A casa, a varanda e o espaço caipira oferecem locais para refeições, conversas e encontros familiares.",
        icon: "armchair",
        visible: true,
      },
      {
        title: "Produção agrícola familiar",
        description:
          "O pomar, o café, o abacaxi e as demais culturas permitem dar continuidade aos cuidados e às atividades existentes.",
        icon: "sprout",
        visible: true,
      },
    ],
    disclaimer:
      "Qualquer novo projeto, construção ou atividade deverá considerar a documentação do imóvel e as autorizações aplicáveis.",
  },

  infrastructure: {
    id: "agua-e-infraestrutura",
    eyebrow: "Recursos da propriedade",
    title: "Água e infraestrutura",
    description:
      "A propriedade possui recursos importantes para o uso cotidiano e para as atividades realizadas na chácara.",
    items: [
      {
        title: "Captação de água da chuva",
        description: "Sistema preparado para captar e armazenar água da chuva.",
        icon: "cloud-rain",
        visible: true,
      },
      {
        title: "Cisterna de 15.000 litros",
        description: "Reservatório com capacidade informada de 15 mil litros.",
        icon: "droplets",
        visible: true,
      },
      {
        title: "Cisterna de 10.000 litros",
        description: "Segundo reservatório com capacidade informada de 10 mil litros.",
        icon: "droplets",
        visible: true,
      },
      {
        title: "25.000 litros no total",
        description: "Capacidade total informada de armazenamento de água: 25 mil litros.",
        icon: "droplets",
        visible: true,
      },
      {
        title: "Energia elétrica",
        description: "Instalação de energia elétrica pronta e funcionando.",
        icon: "zap",
        visible: true,
      },
    ],
  },

  area: {
    total: {
      label: "Área informada",
      value: "6",
      unit: "tarefas",
      showWhenUnknown: false,
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
  areaEquivalent: "",

  propertyDetails: {
    id: "informacoes-confirmadas",
    eyebrow: "Informações confirmadas",
    title: "Características da Chácara Alto dos Torres",
    unknownValueLabel: "Informação não disponível",
    items: [
      { key: "terrain", label: "Relevo", value: null, showWhenUnknown: false, visible: true },
      { key: "soil", label: "Solo", value: null, showWhenUnknown: false, visible: true },
      { key: "fences", label: "Cercas e divisas", value: null, showWhenUnknown: false, visible: true },
      {
        key: "water",
        label: "Água",
        value: "Captação de água da chuva e duas cisternas, com 25.000 litros no total",
        showWhenUnknown: false,
        visible: true,
      },
      {
        key: "energy",
        label: "Energia",
        value: "Instalação de energia elétrica pronta e funcionando",
        showWhenUnknown: false,
        visible: true,
      },
      { key: "internet", label: "Internet e sinal", value: null, showWhenUnknown: false, visible: true },
      { key: "carAccess", label: "Acesso de carros", value: null, showWhenUnknown: false, visible: true },
      { key: "truckAccess", label: "Acesso de caminhões", value: null, showWhenUnknown: false, visible: true },
      { key: "distanceToCity", label: "Distância até a cidade", value: null, showWhenUnknown: false, visible: true },
      { key: "distanceToPavement", label: "Distância até o asfalto", value: null, showWhenUnknown: false, visible: true },
      { key: "internalRoads", label: "Estradas internas", value: null, showWhenUnknown: false, visible: true },
      { key: "vegetation", label: "Vegetação", value: null, showWhenUnknown: false, visible: true },
      { key: "preservationAreas", label: "Áreas de preservação", value: null, showWhenUnknown: false, visible: true },
      {
        key: "other",
        label: "Casa e convivência",
        value: "Casa com 5 cômodos, varanda em L e espaço caipira com fogão a lenha",
        showWhenUnknown: false,
        visible: true,
      },
    ],
  },

  gallery: {
    id: "galeria",
    eyebrow: "Galeria",
    title: "Conheça os espaços da chácara",
    description:
      "As fotografias reais da casa, da varanda, do espaço caipira, do pomar, da infraestrutura e da paisagem serão adicionadas em uma próxima etapa.",
    categories: [
      { id: "all", label: "Todas" },
      { id: "overview", label: "Vista geral" },
      { id: "house", label: "Casa" },
      { id: "veranda", label: "Varanda" },
      { id: "country-kitchen", label: "Espaço caipira" },
      { id: "orchard-crops", label: "Pomar e cultivos" },
      { id: "water-infrastructure", label: "Água e infraestrutura" },
      { id: "landscape", label: "Paisagem" },
      { id: "access", label: "Acesso" },
    ],
    items: [
      {
        id: "vista-geral-01",
        src: "/images/property/vista-geral-01.webp",
        alt: "Imagem temporária destinada à vista geral da chácara",
        caption: "Vista geral — imagem temporária",
        isPlaceholder: true,
        category: "overview",
        order: 1,
        visible: true,
      },
      {
        id: "cafe-01",
        src: "/images/property/cafe-01.webp",
        alt: "Imagem temporária destinada ao cultivo de café",
        caption: "Café — imagem temporária",
        isPlaceholder: true,
        category: "orchard-crops",
        order: 2,
        visible: true,
      },
      {
        id: "abacaxi-01",
        src: "/images/property/abacaxi-01.webp",
        alt: "Imagem temporária destinada ao cultivo de abacaxi",
        caption: "Abacaxi — imagem temporária",
        isPlaceholder: true,
        category: "orchard-crops",
        order: 3,
        visible: true,
      },
      {
        id: "pomar-01",
        src: "/images/property/outras-culturas-01.webp",
        alt: "Imagem temporária destinada ao pomar e às demais culturas",
        caption: "Pomar e cultivos — imagem temporária",
        isPlaceholder: true,
        category: "orchard-crops",
        order: 4,
        visible: true,
      },
      {
        id: "casa-01",
        src: "/images/property/construcao-apoio-01.webp",
        alt: "Imagem temporária destinada à casa e aos espaços de convivência",
        caption: "Casa e convivência — imagem temporária",
        isPlaceholder: true,
        category: "house",
        order: 5,
        visible: true,
      },
      {
        id: "agua-01",
        src: "/images/property/agua-01.webp",
        alt: "Imagem temporária destinada à água e à infraestrutura",
        caption: "Água e infraestrutura — imagem temporária",
        isPlaceholder: true,
        category: "water-infrastructure",
        order: 6,
        visible: true,
      },
      {
        id: "acesso-01",
        src: "/images/property/acesso-01.webp",
        alt: "Imagem temporária destinada ao acesso da chácara",
        caption: "Acesso — imagem temporária",
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

  // A seção permanece oculta enquanto não houver um vídeo real visível.
  videos: {
    id: "videos",
    eyebrow: "Vídeos",
    title: "Conheça a Chácara Alto dos Torres em vídeo",
    description:
      "Um vídeo principal e vídeos curtos poderão apresentar a casa, o pomar, a infraestrutura e a paisagem da chácara.",
    playLabel: "Carregar vídeo",
    items: [],
  },

  supportHouse: {
    id: "casa-e-convivencia",
    eyebrow: "Casa e convivência",
    title: "Casa e espaços de convivência",
    paragraphs: [
      "A Chácara Alto dos Torres possui uma casa com 5 cômodos bem distribuídos, oferecendo uma estrutura funcional para permanência, descanso e uso durante os fins de semana.",
    ],
    features: [
      {
        title: "Cinco cômodos",
        description: "Ambientes distribuídos para atender às necessidades de permanência e uso da propriedade.",
        icon: "house",
        visible: true,
      },
      {
        title: "Varanda em L",
        description: "Uma área ampla e arejada para redes, descanso, conversas em família e contemplação da paisagem.",
        icon: "armchair",
        visible: true,
      },
      {
        title: "Espaço caipira com fogão a lenha",
        description: "Cômodo dedicado com fogão a lenha, ideal para preparar refeições com o sabor tradicional do interior.",
        icon: "cooking-pot",
        visible: true,
      },
    ],
    details: {
      approximateSize: null,
      rooms: "5 cômodos",
      bedrooms: null,
      bathrooms: null,
      kitchen: null,
      livingRoom: null,
      energy: "Instalada e funcionando",
      water: null,
      condition: null,
      furnitureIncluded: null,
      needsRenovation: null,
      notes: null,
    },
    labels: {
      approximateSize: "Tamanho aproximado",
      rooms: "Número de cômodos",
      bedrooms: "Quantidade de quartos",
      bathrooms: "Banheiros",
      kitchen: "Cozinha",
      livingRoom: "Sala",
      energy: "Energia",
      water: "Água",
      condition: "Estado de conservação",
      furnitureIncluded: "Mobília incluída",
      needsRenovation: "Necessidade de reforma",
      notes: "Observações",
    },
    photos: [
      {
        src: "/images/property/construcao-apoio-01.webp",
        alt: "Imagem temporária destinada à casa da Chácara Alto dos Torres",
        caption: "Casa — imagem temporária",
        isPlaceholder: true,
      },
    ],
  },

  location: {
    id: "localizacao",
    eyebrow: "Localização",
    title: "Na Serra de Uibaí",
    introduction:
      "A Chácara Alto dos Torres está localizada na Serra de Uibaí, em um ambiente marcado pela tranquilidade, pela natureza e pelo clima de serra.",
    city: null,
    state: null,
    region: null,
    community: null,
    approximateLocation: "Serra de Uibaí",
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
    note: "A localização completa poderá ser compartilhada durante o atendimento.",
    labels: {
      city: "Cidade",
      state: "Estado",
      region: "Região",
      community: "Comunidade",
      distanceToCenter: "Distância até o centro",
      estimatedTravelTime: "Tempo estimado de deslocamento",
      pavedRoadDistance: "Trecho asfaltado",
      dirtRoadDistance: "Trecho de terra",
      accessCondition: "Condição da estrada",
      entranceType: "Tipo de entrada",
    },
  },

  negotiation: {
    id: "negociacao",
    eyebrow: "Negociação",
    title: "Informações para negociação",
    description:
      "O valor, a documentação e as condições de negociação serão apresentados após a confirmação dos dados.",
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
    eyebrow: "Contato direto",
    title: "Converse diretamente com o proprietário",
    description:
      "Entre em contato para solicitar mais informações, conhecer as condições de venda ou combinar uma visita à Chácara Alto dos Torres.",
    ownerName: "Proprietário",
    bestContactTime: null,
    directContactLabel: "Contato direto com o proprietário",
    ownerLabel: "Responsável",
    bestContactTimeLabel: "Melhor horário para contato",
    buttonLabel: "Falar com o proprietário",
    floatingButtonLabel: "Falar com o proprietário pelo WhatsApp",
    unavailableButtonLabel: "Contato indisponível",
    whatsapp: {
      countryCode: "55",
      number: "74988700524",
      message:
        "Olá! Vi o site da Chácara Alto dos Torres e gostaria de receber mais informações.",
    },
  },

  faq: {
    id: "perguntas-frequentes",
    eyebrow: "Perguntas frequentes",
    title: "Dúvidas sobre a Chácara Alto dos Torres",
    items: [
      {
        id: "tamanho-da-propriedade",
        question: "Qual é o tamanho da propriedade?",
        answer: "A área informada é de 6 tarefas. A equivalência em hectares ou metros quadrados poderá ser adicionada após confirmação.",
        order: 1,
        visible: true,
      },
      {
        id: "cultivos",
        question: "O que existe plantado na chácara?",
        answer: "A propriedade possui café, abacaxi e diversas frutíferas, incluindo manga, banana, acerola, caju, pitaya, tangerina e outras culturas.",
        order: 2,
        visible: true,
      },
      {
        id: "casa",
        question: "A chácara possui casa?",
        answer: "Sim. A propriedade possui uma casa com 5 cômodos, varanda em L e espaço caipira com fogão a lenha.",
        order: 3,
        visible: true,
      },
      {
        id: "agua-armazenada",
        question: "Existe água armazenada?",
        answer: "Sim. A propriedade conta com captação de água da chuva e duas cisternas, com capacidades informadas de 15.000 e 10.000 litros.",
        order: 4,
        visible: true,
      },
      {
        id: "energia-eletrica",
        question: "Possui energia elétrica?",
        answer: "Sim. A instalação de energia elétrica está pronta e funcionando.",
        order: 5,
        visible: true,
      },
      {
        id: "visita",
        question: "Posso visitar a propriedade?",
        answer: "Entre em contato pelo WhatsApp para conversar diretamente com o responsável e verificar a disponibilidade para visita.",
        order: 6,
        visible: true,
      },
      {
        id: "localizacao",
        question: "Onde fica a propriedade?",
        answer: "A Chácara Alto dos Torres está localizada na Serra de Uibaí. A localização completa poderá ser compartilhada durante o atendimento.",
        order: 7,
        visible: true,
      },
    ],
  },

  finalCta: {
    id: "mais-informacoes",
    title: "Venha conhecer a Chácara Alto dos Torres",
    description:
      "Converse diretamente com o proprietário para solicitar mais informações, conhecer as condições de venda ou combinar uma visita.",
    buttonLabel: "Solicitar informações pelo WhatsApp",
    directSaleLabel: "Contato direto com o proprietário.",
    backgroundImage: {
      src: "/images/property/vista-geral-01.webp",
      alt: "Imagem temporária destinada à paisagem da Chácara Alto dos Torres",
      caption: "Paisagem da chácara — imagem temporária",
      isPlaceholder: true,
    },
  },

  footer: {
    propertyTypeLabel: "Chácara produtiva para lazer, descanso e agricultura familiar",
    whatsappLabel: "Falar pelo WhatsApp",
    locationFallback: "Serra de Uibaí",
    updateNotice:
      "Fotos, vídeos, valor, documentação e detalhes da localização serão atualizados quando confirmados.",
    backToTopLabel: "Voltar ao início",
  },
};

export default property;
