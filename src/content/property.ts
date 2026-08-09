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
  image: ContentImage | null;
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
  duration: string;
  order: number;
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
    title: string;
    supportingText: string;
    subtitle: string;
    mainImage: ContentImage;
    videoPlayLabel: string;
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
    imageNotice?: string;
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
    image: ContentImage;
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
    ownerImage: ContentImage | null;
    email: string | null;
    emailLabel: string;
    supportItems: string[];
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
  "Conheça a Chácara Alto dos Torres, na Serra de Uibaí: área total de 6 tarefas, pomar produtivo, casa com 5 cômodos, varanda em L, espaço caipira, energia elétrica e duas cisternas com capacidade total de 25 mil litros de armazenamento.";

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
    "A Chácara Alto dos Torres é uma propriedade acolhedora na Serra de Uibaí, com área total de 6 tarefas, casa de 5 cômodos, varanda em L, espaço caipira com fogão a lenha, pomar produtivo, cultivos, captação de água da chuva, duas cisternas e energia elétrica funcionando.",

  brand: {
    logo: brandLogo,
  },

  sections: {
    overview: false,
    highlights: false,
    crops: true,
    productivePotential: false,
    infrastructure: true,
    gallery: true,
    videos: true,
    propertyDetails: true,
    supportHouse: true,
    location: true,
    documentation: false,
    pricing: true,
    contact: true,
    faq: true,
    finalCta: true,
  },

  header: {
    navigationLabel: "Navegação principal",
    openMenuLabel: "Abrir menu",
    closeMenuLabel: "Fechar menu",
    navigation: [
      { label: "Características", href: "#informacoes-confirmadas" },
      { label: "Galeria", href: "#galeria" },
      { label: "Casa", href: "#casa-e-convivencia" },
      { label: "Infraestrutura", href: "#agua-e-infraestrutura" },
      { label: "Pomar e cultivos", href: "#pomar-e-cultivos" },
      { label: "Localização", href: "#localizacao" },
    ],
    contactLabel: "Consultar pelo WhatsApp",
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
    canonicalUrl:
      "https://chacara-alto-dos-torres.vercel.app/chacara-alto-dos-torres",
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
    title: "Chácara à venda na Serra de Uibaí",
    supportingText:
      "Natureza, produção e tranquilidade em uma propriedade com 6 tarefas.",
    subtitle:
      "Pomar produtivo, casa, varanda em L, espaço caipira com fogão a lenha, captação de água da chuva e energia elétrica.",
    mainImage: {
      src: "/images/property/real/vista-geral-01.webp",
      alt: "Vista aérea da Chácara Alto dos Torres com a casa, a vegetação e a estrada ao redor",
      caption: "Vista aérea da Chácara Alto dos Torres",
      isPlaceholder: false,
      fit: "cover",
    },
    videoPlayLabel: "Assista à apresentação",
    quickFacts: [
      "Área total: 6 tarefas",
      "Casa com 5 cômodos",
      "Pomar produtivo",
      "Duas cisternas: 25 mil litros de armazenamento",
      "Energia elétrica",
    ],
    primaryActionLabel: "Consultar valor pelo WhatsApp",
    secondaryActionLabel: "Ver características",
    secondaryActionTarget: "#informacoes-confirmadas",
    detailsNotice: "",
  },

  overview: {
    id: "visao-geral",
    eyebrow: "A Chácara Alto dos Torres",
    title: "Um refúgio na Serra de Uibaí",
    paragraphs: [
      "A Chácara Alto dos Torres é uma propriedade acolhedora para quem busca tranquilidade, contato com a natureza e clima de serra. A propriedade possui uma área total de 6 tarefas e estrutura para aproveitar os fins de semana, reunir a família ou dar continuidade às atividades agrícolas.",
      "O imóvel conta com casa de 5 cômodos, varanda em L, espaço caipira com fogão a lenha, energia elétrica, sistema de captação de água da chuva e um pomar com diversas culturas já implantadas.",
    ],
  },

  highlights: {
    items: [
      {
        title: "Área total da propriedade",
        description: "A propriedade possui uma área total de 6 tarefas.",
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
        description: "Varanda em L integrada à área externa da casa.",
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
      "A chácara possui diversas frutíferas e culturas já implantadas, ampliando as possibilidades de consumo próprio, continuidade dos cuidados e produção agrícola.",
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
          src: "/images/property/real/cafe-01.webp",
          alt: "Cafeeiro com frutos vermelhos na Chácara Alto dos Torres",
          caption: "Cultivo de café",
          isPlaceholder: false,
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
          src: "/images/property/real/abacaxi-02.webp",
          alt: "Abacaxi em desenvolvimento na área cultivada da Chácara Alto dos Torres",
          caption: "Cultivo de abacaxi na chácara",
          isPlaceholder: false,
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
          "O pomar reúne diferentes espécies de frutíferas já implantadas na propriedade.",
        image: {
          src: "/images/property/real/tangerina-01.webp",
          alt: "Tangerineira carregada no pomar da Chácara Alto dos Torres",
          caption: "Frutíferas do pomar da chácara",
          isPlaceholder: false,
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
        title: "Produção agrícola",
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
        title: "Duas cisternas",
        description:
          "As capacidades informadas são de 15 mil e 10 mil litros, totalizando 25 mil litros de armazenamento.",
        icon: "droplets",
        visible: true,
      },
      {
        title: "Cisterna de 10.000 litros",
        description: "Segundo reservatório com capacidade informada de 10 mil litros.",
        icon: "droplets",
        visible: false,
      },
      {
        title: "25.000 litros de armazenamento",
        description:
          "As duas cisternas totalizam a capacidade informada de 25 mil litros de armazenamento.",
        icon: "droplets",
        visible: false,
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
      label: "Área total",
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
        value:
          "Captação de água da chuva e duas cisternas, com capacidade total de 25.000 litros de armazenamento",
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
      {
        key: "carAccess",
        label: "Acesso de carros e motos",
        value:
          "Estrada de terra em boas condições, com passagem tranquila para carros e motos, inclusive em dias de chuva",
        showWhenUnknown: false,
        visible: false,
      },
      { key: "truckAccess", label: "Acesso de caminhões", value: null, showWhenUnknown: false, visible: true },
      {
        key: "distanceToCity",
        label: "Distância até Uibaí",
        value: "Aproximadamente 7 km",
        showWhenUnknown: false,
        visible: false,
      },
      { key: "distanceToPavement", label: "Distância até o asfalto", value: null, showWhenUnknown: false, visible: true },
      { key: "internalRoads", label: "Estradas internas", value: null, showWhenUnknown: false, visible: true },
      {
        key: "vegetation",
        label: "Pomar e cultivos",
        value: "Café, abacaxi e diferentes espécies de frutíferas já implantadas",
        showWhenUnknown: false,
        visible: true,
      },
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
      "Veja fotografias reais da casa, da varanda, dos cultivos, da infraestrutura, da paisagem e do acesso à Chácara Alto dos Torres.",
    imageNotice: "Os limites da propriedade não estão demarcados na imagem.",
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
        src: "/images/property/real/vista-geral-01.webp",
        alt: "Vista aérea da Chácara Alto dos Torres com a casa, a vegetação e a estrada ao redor",
        caption: "Vista aérea da chácara",
        isPlaceholder: false,
        category: "overview",
        order: 1,
        visible: true,
      },
      {
        id: "vista-geral-02",
        src: "/images/property/real/vista-geral-02.webp",
        alt: "Vista da região observada a partir da Chácara Alto dos Torres",
        caption: "Vista da região a partir da propriedade",
        isPlaceholder: false,
        category: "overview",
        order: 12,
        visible: true,
      },
      {
        id: "casa-vista-superior-01",
        src: "/images/property/real/casa-vista-superior-01.webp",
        alt: "Casa da Chácara Alto dos Torres vista de cima, com telhado cerâmico e paisagem ao fundo",
        caption: "Casa e paisagem ao redor",
        isPlaceholder: false,
        category: "house",
        order: 2,
        visible: true,
      },
      {
        id: "casa-quintal-01",
        src: "/images/property/real/casa-quintal-01.webp",
        alt: "Quintal arborizado ao lado da casa da Chácara Alto dos Torres",
        caption: "Quintal arborizado da casa",
        isPlaceholder: false,
        category: "house",
        order: 3,
        visible: true,
      },
      {
        id: "varanda-01",
        src: "/images/property/real/varanda-01.webp",
        alt: "Varanda coberta na frente da casa da Chácara Alto dos Torres",
        caption: "Varanda da casa",
        isPlaceholder: false,
        category: "veranda",
        order: 4,
        visible: true,
      },
      {
        id: "cafe-01",
        src: "/images/property/real/cafe-01.webp",
        alt: "Cafeeiro com frutos vermelhos na Chácara Alto dos Torres",
        caption: "Cultivo de café",
        isPlaceholder: false,
        category: "orchard-crops",
        order: 5,
        visible: true,
      },
      {
        id: "jaca-01",
        src: "/images/property/real/jaca-01.webp",
        alt: "Jaca em árvore frutífera da Chácara Alto dos Torres",
        caption: "Jaca na Chácara Alto dos Torres",
        isPlaceholder: false,
        category: "orchard-crops",
        order: 6,
        visible: true,
      },
      {
        id: "abacaxi-01",
        src: "/images/property/real/abacaxi-01.webp",
        alt: "Abacaxi em desenvolvimento entre as plantas da área cultivada",
        caption: "Abacaxi na área cultivada",
        isPlaceholder: false,
        category: "orchard-crops",
        order: 10,
        visible: true,
      },
      {
        id: "abacaxi-02",
        src: "/images/property/real/abacaxi-02.webp",
        alt: "Detalhe de um abacaxi cultivado na Chácara Alto dos Torres",
        caption: "Detalhe do cultivo de abacaxi",
        isPlaceholder: false,
        category: "orchard-crops",
        order: 11,
        visible: true,
      },
      {
        id: "tangerina-01",
        src: "/images/property/real/tangerina-01.webp",
        alt: "Tangerineira carregada no pomar da Chácara Alto dos Torres",
        caption: "Tangerinas no pomar",
        isPlaceholder: false,
        category: "orchard-crops",
        order: 7,
        visible: true,
      },
      {
        id: "manga-01",
        src: "/images/property/real/manga-01.webp",
        alt: "Mangueira com diversos frutos no pomar da Chácara Alto dos Torres",
        caption: "Mangas no pomar",
        isPlaceholder: false,
        category: "orchard-crops",
        order: 8,
        visible: true,
      },
      {
        id: "frutifera-frutos-vermelhos-01",
        src: "/images/property/real/frutifera-frutos-vermelhos-01.webp",
        alt: "Frutífera com pequenos frutos vermelhos no pomar da chácara",
        caption: "Frutífera do pomar",
        isPlaceholder: false,
        category: "orchard-crops",
        order: 9,
        visible: true,
      },
      {
        id: "cisterna-01",
        src: "/images/property/real/cisterna-01.webp",
        alt: "Cisterna instalada na área externa da Chácara Alto dos Torres",
        caption: "Cisterna da propriedade",
        isPlaceholder: false,
        category: "water-infrastructure",
        order: 15,
        visible: true,
      },
      {
        id: "paisagem-cerca-01",
        src: "/images/property/real/paisagem-cerca-01.webp",
        alt: "Cerca vista a partir da chácara, com a paisagem da região ao fundo",
        caption: "Paisagem nos arredores da chácara",
        isPlaceholder: false,
        category: "landscape",
        order: 13,
        visible: true,
      },
      {
        id: "paisagem-plantio-01",
        src: "/images/property/real/paisagem-plantio-01.webp",
        alt: "Vista da área rural e de uma faixa cultivada na paisagem da serra",
        caption: "Paisagem nos arredores da chácara",
        isPlaceholder: false,
        category: "landscape",
        order: 14,
        visible: true,
      },
      {
        id: "acesso-01",
        src: "/images/property/real/acesso-01.webp",
        alt: "Estrada de terra na serra com vista para a área urbana ao longe",
        caption: "Estrada de acesso à região",
        isPlaceholder: false,
        category: "access",
        order: 16,
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

  videos: {
    id: "videos",
    eyebrow: "Vídeos",
    title: "Veja mais detalhes da chácara em vídeo",
    description:
      "Confira outros registros da propriedade, dos cultivos e das paisagens da Chácara Alto dos Torres.",
    playLabel: "Reproduzir vídeo",
    items: [
      {
        id: "apresentacao-principal",
        title: "Apresentação da Chácara Alto dos Torres",
        description:
          "Conheça alguns dos espaços, paisagens e características da propriedade.",
        url: "/videos/property/apresentacao-principal.mp4",
        coverImage: {
          src: "/images/property/video-covers/apresentacao-principal.webp",
          alt: "Vista aérea da casa da Chácara Alto dos Torres, com vegetação e paisagem da região",
          caption: "Apresentação da Chácara Alto dos Torres",
          isPlaceholder: false,
          fit: "cover",
        },
        role: "main",
        format: "vertical",
        duration: "1:29",
        order: 1,
        visible: true,
      },
      {
        id: "video-curto-01",
        title: "Conheça a propriedade",
        description: "Um resumo visual da casa, da infraestrutura e da região.",
        url: "/videos/property/video-curto-01.mp4",
        coverImage: {
          src: "/images/property/video-covers/video-curto-01.webp",
          alt: "Montagem vertical com cisterna, acesso, casa e paisagem da região",
          caption: "Casa, infraestrutura e região",
          isPlaceholder: false,
          fit: "cover",
        },
        role: "short",
        format: "vertical",
        duration: "0:20",
        order: 2,
        visible: true,
      },
      {
        id: "video-curto-02",
        title: "Cultivos e infraestrutura",
        description: "Registros dos cultivos, das frutíferas e da infraestrutura de água.",
        url: "/videos/property/video-curto-02.mp4",
        coverImage: {
          src: "/images/property/video-covers/video-curto-02.webp",
          alt: "Cisterna e identidade visual da Chácara Alto dos Torres",
          caption: "Infraestrutura da chácara",
          isPlaceholder: false,
          fit: "cover",
        },
        role: "short",
        format: "vertical",
        duration: "0:20",
        order: 3,
        visible: true,
      },
      {
        id: "video-curto-03",
        title: "Casa, cultivos e paisagem",
        description: "Imagens da casa, dos cultivos e da paisagem observada na região.",
        url: "/videos/property/video-curto-03.mp4",
        coverImage: {
          src: "/images/property/video-covers/video-curto-03.webp",
          alt: "Abacaxi cultivado na Chácara Alto dos Torres",
          caption: "Cultivos da chácara",
          isPlaceholder: false,
          fit: "cover",
        },
        role: "short",
        format: "vertical",
        duration: "0:29",
        order: 4,
        visible: true,
      },
    ],
  },

  supportHouse: {
    id: "casa-e-convivencia",
    eyebrow: "Casa e convivência",
    title: "Casa e espaços de convivência",
    paragraphs: [
      "A estrutura construída reúne ambientes para permanência, preparo de refeições e convivência na propriedade.",
    ],
    features: [
      {
        title: "Cinco cômodos",
        description: "A casa possui cinco cômodos.",
        icon: "house",
        visible: true,
      },
      {
        title: "Varanda em L",
        description: "Varanda em L integrada à área externa da casa.",
        icon: "armchair",
        visible: true,
      },
      {
        title: "Espaço caipira com fogão a lenha",
        description: "Espaço com fogão a lenha para preparo de refeições.",
        icon: "cooking-pot",
        visible: true,
      },
    ],
    details: {
      approximateSize: null,
      rooms: null,
      bedrooms: null,
      bathrooms: null,
      kitchen: null,
      livingRoom: null,
      energy: null,
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
        src: "/images/property/real/varanda-01.webp",
        alt: "Varanda coberta na frente da casa da Chácara Alto dos Torres",
        caption: "Casa e varanda da chácara",
        isPlaceholder: false,
      },
    ],
  },

  location: {
    id: "localizacao",
    eyebrow: "Localização",
    title: "Na Serra de Uibaí",
    introduction:
      "A Chácara Alto dos Torres está localizada a aproximadamente 7 km de Uibaí, em uma região marcada pela tranquilidade, pela natureza e pelo clima de serra.",
    image: {
      src: "/images/property/real/vista-geral-01.webp",
      alt: "Vista aérea da Chácara Alto dos Torres e de seus arredores",
      caption: "Vista aérea da chácara e da região. Os limites da propriedade não estão demarcados na imagem.",
      isPlaceholder: false,
      fit: "cover",
    },
    city: null,
    state: null,
    region: null,
    community: null,
    approximateLocation: "A aproximadamente 7 km de Uibaí",
    distanceToCenter: "Aproximadamente 7 km de Uibaí",
    estimatedTravelTime: null,
    pavedRoadDistance: null,
    dirtRoadDistance: null,
    accessCondition:
      "Estrada de terra em boas condições, com passagem tranquila para carros e motos, inclusive em períodos de chuva",
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
      distanceToCenter: "Distância aproximada",
      estimatedTravelTime: "Tempo estimado de deslocamento",
      pavedRoadDistance: "Trecho asfaltado",
      dirtRoadDistance: "Trecho de terra",
      accessCondition: "Condição da estrada",
      entranceType: "Tipo de entrada",
    },
  },

  negotiation: {
    id: "negociacao",
    eyebrow: "Valor e visitas",
    title: "Consulte o valor e agende sua visita",
    description:
      "Consulte o valor diretamente com o proprietário. A condição de pagamento informada é à vista.",
    price: {
      amount: null,
      currency: "BRL",
      showPrice: false,
      showAsOnRequest: true,
      onRequestLabel: "Consulte o valor diretamente com o proprietário.",
    },
    acceptsOffer: null,
    paymentMethods: ["À vista"],
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
      paymentMethods: "Condição de pagamento",
      acceptsVehicle: "Aceita veículo",
      acceptsOtherProperty: "Aceita outro imóvel",
      installmentTerms: "Parcelamento",
      documentation: "Documentação",
    },
  },

  contact: {
    id: "contato",
    eyebrow: "Valor e visitas",
    title: "Consulte o valor e agende sua visita",
    description:
      "Entre em contato diretamente com o proprietário para consultar o valor, tirar dúvidas e agendar uma visita para o dia de sua preferência.",
    ownerName: "Proprietário",
    ownerImage: {
      src: "/images/property/owner/proprietario.webp",
      alt: "Proprietário da Chácara Alto dos Torres",
      caption: "Proprietário",
      isPlaceholder: false,
      fit: "contain",
    },
    email: "paguefeliz@gmail.com",
    emailLabel: "E-mail do proprietário",
    supportItems: [
      "Valor sob consulta",
      "Pagamento à vista",
      "Visitas mediante agendamento prévio",
    ],
    bestContactTime: null,
    directContactLabel: "Contato direto com o proprietário",
    ownerLabel: "Responsável",
    bestContactTimeLabel: "Melhor horário para contato",
    buttonLabel: "Consultar valor pelo WhatsApp",
    floatingButtonLabel: "Consultar valor e agendar visita pelo WhatsApp",
    unavailableButtonLabel: "Contato indisponível",
    whatsapp: {
      countryCode: "55",
      number: "74988700524",
      message:
        "Olá! Vi o site da Chácara Alto dos Torres e gostaria de consultar o valor e agendar uma visita.",
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
        answer: "A propriedade possui uma área total de 6 tarefas. Não há equivalência confirmada em hectares ou metros quadrados.",
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
        answer: "Sim. A propriedade conta com captação de água da chuva e duas cisternas, com capacidades informadas de 15.000 e 10.000 litros, totalizando 25.000 litros de armazenamento.",
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
        question: "Como posso visitar a chácara?",
        answer: "Agende pelo WhatsApp uma visita para o dia de sua preferência.",
        order: 6,
        visible: true,
      },
      {
        id: "localizacao",
        question: "Onde fica a propriedade?",
        answer: "A Chácara Alto dos Torres está localizada a aproximadamente 7 km de Uibaí. A localização completa poderá ser compartilhada durante o atendimento.",
        order: 7,
        visible: true,
      },
      {
        id: "acesso",
        question: "Como é o acesso à propriedade?",
        answer: "A propriedade fica a aproximadamente 7 km de Uibaí. O acesso é feito por estrada de terra em boas condições, com passagem tranquila para carros e motos, inclusive em dias de chuva.",
        order: 8,
        visible: true,
      },
      {
        id: "valor",
        question: "Qual é o valor da chácara?",
        answer: "O valor é informado diretamente pelo proprietário. Entre em contato pelo WhatsApp para consultar o preço e receber mais informações.",
        order: 9,
        visible: true,
      },
    ],
  },

  finalCta: {
    id: "mais-informacoes",
    title: "Venha conhecer a Chácara Alto dos Torres",
    description:
      "Consulte o valor diretamente com o proprietário e agende pelo WhatsApp uma visita para o dia de sua preferência.",
    buttonLabel: "Consultar valor e agendar visita",
    directSaleLabel: "Contato direto com o proprietário.",
    backgroundImage: {
      src: "/images/property/real/vista-geral-02.webp",
      alt: "Vista da região observada a partir da Chácara Alto dos Torres",
      caption: "Vista da região a partir da propriedade",
      isPlaceholder: false,
    },
  },

  footer: {
    propertyTypeLabel: "Chácara produtiva para lazer, descanso e agricultura familiar",
    whatsappLabel: "Falar pelo WhatsApp",
    locationFallback: "A aproximadamente 7 km de Uibaí",
    updateNotice: "",
    backToTopLabel: "Voltar ao início",
  },
};

export default property;
