export type EspacoGalleryCategory =
  | "all"
  | "vista-geral"
  | "piscina"
  | "area-gourmet"
  | "chale"
  | "lazer"
  | "estrutura";

export interface EspacoImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface EspacoGalleryItem extends EspacoImage {
  id: string;
  title: string;
  caption: string;
  category: Exclude<EspacoGalleryCategory, "all">;
  order: number;
  visible: boolean;
}

export interface EspacoFernandesContent {
  seo: {
    title: string;
    description: string;
    canonicalUrl: string;
    openGraphImage: EspacoImage;
  };
  brand: {
    name: string;
    logo: EspacoImage;
  };
  navigation: Array<{ label: string; href: string }>;
  hero: {
    identification: string;
    title: string;
    description: string;
    primaryButton: string;
    secondaryButton: string;
    video: {
      title: string;
      description: string;
      src: string;
      poster: EspacoImage;
      duration: string;
      format: "vertical";
      visible: boolean;
    };
  };
  about: {
    id: string;
    eyebrow: string;
    title: string;
    text: string;
  };
  structure: {
    id: string;
    eyebrow: string;
    title: string;
    description: string;
    featuredImage: EspacoImage;
    amenities: Array<{
      id:
        | "piscina"
        | "area-gourmet"
        | "churrasqueira"
        | "freezer"
        | "sinuca"
        | "jogos"
        | "tv"
        | "wifi";
      title: string;
      description: string;
    }>;
  };
  occasions: {
    eyebrow: string;
    title: string;
    items: string[];
  };
  gallery: {
    id: string;
    eyebrow: string;
    title: string;
    description: string;
    categories: Array<{ id: EspacoGalleryCategory; label: string }>;
    items: EspacoGalleryItem[];
    controls: {
      closeLabel: string;
      previousLabel: string;
      nextLabel: string;
      dialogLabel: string;
    };
  };
  chalet: {
    id: string;
    eyebrow: string;
    title: string;
    text: string;
    image: EspacoImage;
  };
  location: {
    id: string;
    eyebrow: string;
    title: string;
    addressLines: string[];
    copyLabel: string;
    copiedLabel: string;
    mapUrl: string | null;
    mapLabel: string;
  };
  contact: {
    id: string;
    eyebrow: string;
    title: string;
    text: string;
    whatsapp: {
      countryCode: string;
      number: string;
      message: string;
      label: string;
    };
    instagram: {
      url: string;
      label: string;
    };
    email: {
      address: string;
      label: string;
    };
  };
  pricing: {
    mostrarPreco: boolean;
    valor: string | null;
  };
  faq: {
    id: string;
    eyebrow: string;
    title: string;
    items: Array<{
      id: string;
      question: string;
      answer: string;
      visible: boolean;
      order: number;
    }>;
  };
  footer: {
    backLabel: string;
    rightsText: string;
  };
}

const imageBase = "/images/espaco-fernandes";

export const espacoFernandes: EspacoFernandesContent = {
  seo: {
    title: "Espaço Fernandes | Locação por diária em Formosa, Uibaí",
    description:
      "Espaço para locação por diária em Formosa, Uibaí, com piscina, área de convivência, churrasqueira, lazer, Wi-Fi e chalé. Consulte disponibilidade pelo WhatsApp.",
    canonicalUrl:
      "https://chacara-alto-dos-torres.vercel.app/espaco-fernandes",
    openGraphImage: {
      src: `${imageBase}/og-espaco-fernandes.webp`,
      alt: "Piscina e painel artístico do Espaço Fernandes ao entardecer",
      width: 1200,
      height: 630,
    },
  },
  brand: {
    name: "Espaço Fernandes",
    logo: {
      src: `${imageBase}/logo.webp`,
      alt: "Logo oficial do Espaço Fernandes",
      width: 1080,
      height: 1080,
    },
  },
  navigation: [
    { label: "Início", href: "#inicio" },
    { label: "O espaço", href: "#o-espaco" },
    { label: "Estrutura", href: "#estrutura" },
    { label: "Galeria", href: "#galeria-espaco" },
    { label: "Chalé", href: "#chale" },
    { label: "Localização", href: "#localizacao-espaco" },
    { label: "Contato", href: "#contato-espaco" },
  ],
  hero: {
    identification: "Locação por diária em Formosa, Uibaí",
    title: "Seu espaço para celebrar, reunir e aproveitar",
    description:
      "Um ambiente privado para aniversários, confraternizações, encontros em família e momentos de lazer com amigos.",
    primaryButton: "Consultar disponibilidade",
    secondaryButton: "Conhecer o espaço",
    video: {
      title: "Conheça o Espaço Fernandes",
      description:
        "Apresentação em vídeo da piscina, da área de convivência e de outros espaços.",
      src: "/videos/espaco-fernandes/apresentacao-principal.mp4",
      poster: {
        src: `${imageBase}/video-covers/apresentacao-principal.webp`,
        alt: "Piscina e área gourmet do Espaço Fernandes vistas no vídeo de apresentação",
        width: 720,
        height: 1280,
      },
      duration: "1:09",
      format: "vertical",
      visible: true,
    },
  },
  about: {
    id: "o-espaco",
    eyebrow: "Espaço privado",
    title: "Um espaço para aproveitar bons momentos",
    text: "O Espaço Fernandes é um ambiente privado e versátil para reunir família e amigos, comemorar aniversários, realizar confraternizações ou simplesmente aproveitar um dia de lazer.",
  },
  structure: {
    id: "estrutura",
    eyebrow: "Estrutura e lazer",
    title: "Tudo reunido para aproveitar a diária",
    description:
      "Piscina, área gourmet e opções de lazer formam um ambiente preparado para encontros e comemorações.",
    featuredImage: {
      src: `${imageBase}/real/vista-geral-piscina-01.webp`,
      alt: "Piscina e painel artístico do Espaço Fernandes ao entardecer",
      width: 1599,
      height: 899,
    },
    amenities: [
      {
        id: "piscina",
        title: "Piscina",
        description: "Um dos principais espaços de lazer do local.",
      },
      {
        id: "area-gourmet",
        title: "Área gourmet",
        description: "Ambiente para refeições e convivência.",
      },
      {
        id: "churrasqueira",
        title: "Churrasqueira",
        description: "Estrutura disponível na área gourmet.",
      },
      {
        id: "freezer",
        title: "Freezer",
        description: "Disponível como apoio durante a diária.",
      },
      {
        id: "sinuca",
        title: "Mesa de sinuca",
        description: "Opção de lazer na área coberta.",
      },
      {
        id: "jogos",
        title: "Jogos",
        description: "Baralho e dominó disponíveis.",
      },
      {
        id: "tv",
        title: "TV",
        description: "TV na área de convivência.",
      },
      {
        id: "wifi",
        title: "Wi-Fi",
        description: "Conexão disponível no espaço.",
      },
    ],
  },
  occasions: {
    eyebrow: "Para reunir",
    title: "Ocasiões que combinam com o espaço",
    items: [
      "Aniversários",
      "Confraternizações",
      "Reuniões familiares",
      "Encontros entre amigos",
      "Dia de lazer",
    ],
  },
  gallery: {
    id: "galeria-espaco",
    eyebrow: "Fotos reais",
    title: "Conheça os ambientes",
    description:
      "Veja a piscina, os espaços de convivência, a estrutura de lazer e outros detalhes do Espaço Fernandes.",
    categories: [
      { id: "all", label: "Todas" },
      { id: "vista-geral", label: "Vista geral" },
      { id: "piscina", label: "Piscina" },
      { id: "area-gourmet", label: "Área gourmet" },
      { id: "chale", label: "Chalé" },
      { id: "lazer", label: "Lazer" },
      { id: "estrutura", label: "Estrutura" },
    ],
    items: [
      {
        id: "vista-geral-piscina",
        title: "Piscina e painel ao entardecer",
        caption: "Vista geral da piscina e do painel artístico ao entardecer.",
        category: "vista-geral",
        order: 1,
        visible: true,
        src: `${imageBase}/real/vista-geral-piscina-01.webp`,
        alt: "Vista geral da piscina e do painel artístico do Espaço Fernandes ao entardecer",
        width: 1599,
        height: 899,
      },
      {
        id: "vista-geral-noturna",
        title: "Área de convivência à noite",
        caption: "Vista noturna da área coberta e do pátio.",
        category: "vista-geral",
        order: 2,
        visible: true,
        src: `${imageBase}/real/vista-geral-noturna-01.webp`,
        alt: "Área coberta e pátio do Espaço Fernandes iluminados à noite",
        width: 1600,
        height: 1200,
      },
      {
        id: "vista-geral-fachada",
        title: "Piscina e fachada",
        caption: "Vista da piscina junto à construção principal.",
        category: "vista-geral",
        order: 3,
        visible: true,
        src: `${imageBase}/real/vista-geral-fachada-01.webp`,
        alt: "Piscina diante da construção principal do Espaço Fernandes",
        width: 2160,
        height: 3840,
      },
      {
        id: "area-coberta",
        title: "Área coberta de lazer",
        caption: "Área coberta com mesa de sinuca e acesso ao pátio.",
        category: "vista-geral",
        order: 4,
        visible: true,
        src: `${imageBase}/real/estrutura-area-coberta-01.webp`,
        alt: "Área coberta do Espaço Fernandes com mesa de sinuca",
        width: 2358,
        height: 4192,
      },
      {
        id: "piscina-area-externa",
        title: "Piscina e área externa",
        caption: "Área externa com piscina, mesas e guarda-sol.",
        category: "piscina",
        order: 5,
        visible: true,
        src: `${imageBase}/real/piscina-area-externa-01.webp`,
        alt: "Piscina com mesas, cadeiras e guarda-sol no Espaço Fernandes",
        width: 720,
        height: 1267,
      },
      {
        id: "piscina-cascata",
        title: "Piscina com cascata",
        caption: "Detalhe da piscina com cascata e painel artístico.",
        category: "piscina",
        order: 6,
        visible: true,
        src: `${imageBase}/real/piscina-cascata-01.webp`,
        alt: "Piscina com cascata diante do painel artístico do Espaço Fernandes",
        width: 720,
        height: 1278,
      },
      {
        id: "piscina-noturna",
        title: "Piscina iluminada",
        caption: "Piscina e iluminação externa durante a noite.",
        category: "piscina",
        order: 7,
        visible: true,
        src: `${imageBase}/real/piscina-noturna-01.webp`,
        alt: "Piscina iluminada em azul durante a noite",
        width: 704,
        height: 1238,
      },
      {
        id: "piscina-vista-ampla",
        title: "Vista ampla da piscina",
        caption: "Piscina e pátio vistos a partir da área coberta.",
        category: "piscina",
        order: 8,
        visible: true,
        src: `${imageBase}/real/piscina-vista-ampla-01.webp`,
        alt: "Piscina e pátio do Espaço Fernandes vistos da área coberta",
        width: 720,
        height: 1219,
      },
      {
        id: "piscina-painel",
        title: "Piscina e painel artístico",
        caption: "Detalhe da piscina junto ao painel artístico.",
        category: "piscina",
        order: 9,
        visible: true,
        src: `${imageBase}/real/piscina-painel-artistico-01.webp`,
        alt: "Piscina com cascata e painel artístico ao fundo",
        width: 720,
        height: 1231,
      },
      {
        id: "area-gourmet-noturna",
        title: "Área gourmet à noite",
        caption: "Área gourmet com mesas, bancadas e pia.",
        category: "area-gourmet",
        order: 10,
        visible: true,
        src: `${imageBase}/real/area-gourmet-noturna-01.webp`,
        alt: "Área gourmet iluminada com mesas, bancadas e pia",
        width: 1600,
        height: 1200,
      },
      {
        id: "churrasqueira",
        title: "Churrasqueira e bancada",
        caption: "Churrasqueira integrada à área gourmet.",
        category: "area-gourmet",
        order: 11,
        visible: true,
        src: `${imageBase}/real/area-gourmet-churrasqueira-01.webp`,
        alt: "Churrasqueira, pia e bancada da área gourmet",
        width: 720,
        height: 1260,
      },
      {
        id: "convivencia-tv",
        title: "Mesa, TV e freezer",
        caption: "Área de convivência com mesa, TV e freezer.",
        category: "area-gourmet",
        order: 12,
        visible: true,
        src: `${imageBase}/real/area-convivencia-tv-01.webp`,
        alt: "Mesa de madeira, TV e freezer na área de convivência",
        width: 720,
        height: 1278,
      },
      {
        id: "convivencia-mesa",
        title: "Mesa para refeições",
        caption: "Mesa de madeira próxima à piscina.",
        category: "area-gourmet",
        order: 13,
        visible: true,
        src: `${imageBase}/real/area-convivencia-mesa-01.webp`,
        alt: "Mesa de madeira na área de convivência com a piscina ao fundo",
        width: 720,
        height: 1263,
      },
      {
        id: "chale-entrada",
        title: "Acesso ao chalé",
        caption: "Entrada do chalé junto à área de lazer.",
        category: "chale",
        order: 14,
        visible: true,
        src: `${imageBase}/real/chale-entrada-01.webp`,
        alt: "Entrada do chalé ao lado da mesa de sinuca",
        width: 720,
        height: 1272,
      },
      {
        id: "sinuca",
        title: "Mesa de sinuca",
        caption: "Mesa de sinuca na área coberta.",
        category: "lazer",
        order: 15,
        visible: true,
        src: `${imageBase}/real/lazer-sinuca-01.webp`,
        alt: "Mesa de sinuca na área coberta do Espaço Fernandes",
        width: 720,
        height: 1273,
      },
      {
        id: "sinuca-detalhe",
        title: "Detalhe da mesa de sinuca",
        caption: "Bolas organizadas sobre a mesa de sinuca.",
        category: "lazer",
        order: 16,
        visible: true,
        src: `${imageBase}/real/lazer-sinuca-detalhe-01.webp`,
        alt: "Bolas e taco sobre a mesa de sinuca",
        width: 720,
        height: 1247,
      },
      {
        id: "pergolado",
        title: "Pergolado no pátio",
        caption: "Pergolado e pátio próximos à área coberta.",
        category: "estrutura",
        order: 17,
        visible: true,
        src: `${imageBase}/real/estrutura-pergolado-01.webp`,
        alt: "Pergolado de madeira no pátio do Espaço Fernandes",
        width: 2358,
        height: 3762,
      },
      {
        id: "painel-artistico",
        title: "Painel artístico",
        caption: "Detalhe de um dos painéis pintados na área externa.",
        category: "estrutura",
        order: 18,
        visible: true,
        src: `${imageBase}/real/estrutura-painel-artistico-01.webp`,
        alt: "Painel artístico com cactos e ave na área externa",
        width: 720,
        height: 1277,
      },
    ],
    controls: {
      closeLabel: "Fechar galeria",
      previousLabel: "Foto anterior",
      nextLabel: "Próxima foto",
      dialogLabel: "Visualização ampliada da galeria",
    },
  },
  chalet: {
    id: "chale",
    eyebrow: "Chalé",
    title: "Um espaço para descansar",
    text: "Em 2025, o Espaço Fernandes ganhou um chalé, oferecendo mais conforto para quem deseja descansar durante a utilização do espaço ou aproveitar um momento de tranquilidade.",
    image: {
      src: `${imageBase}/real/chale-entrada-01.webp`,
      alt: "Entrada do chalé junto à área de lazer do Espaço Fernandes",
      width: 720,
      height: 1272,
    },
  },
  location: {
    id: "localizacao-espaco",
    eyebrow: "Localização",
    title: "Em Formosa, Uibaí",
    addressLines: [
      "Espaço Fernandes",
      "Rua Fonte Grande, 8898",
      "Formosa, Uibaí - BA",
    ],
    copyLabel: "Copiar endereço",
    copiedLabel: "Endereço copiado",
    mapUrl: null,
    mapLabel: "Ver no mapa",
  },
  contact: {
    id: "contato-espaco",
    eyebrow: "Contato direto",
    title: "Consulte disponibilidade para sua diária",
    text: "Entre em contato para consultar datas disponíveis e receber mais informações sobre a locação do Espaço Fernandes.",
    whatsapp: {
      countryCode: "55",
      number: "74988700524",
      message:
        "Olá! Vi o site do Espaço Fernandes e gostaria de consultar disponibilidade para uma diária.",
      label: "Consultar disponibilidade pelo WhatsApp",
    },
    instagram: {
      url: "https://www.instagram.com/espaco.fernandes1/",
      label: "Ver Instagram",
    },
    email: {
      address: "paguefeliz@gmail.com",
      label: "Enviar e-mail",
    },
  },
  pricing: {
    mostrarPreco: false,
    valor: null,
  },
  faq: {
    id: "perguntas-frequentes-espaco",
    eyebrow: "Perguntas frequentes",
    title: "Antes de consultar sua data",
    items: [
      {
        id: "como-funciona",
        question: "Como funciona a locação?",
        answer: "O Espaço Fernandes trabalha com locação por diária.",
        visible: true,
        order: 1,
      },
      {
        id: "ocasioes",
        question: "Para quais ocasiões o espaço pode ser utilizado?",
        answer:
          "O local é utilizado para aniversários, confraternizações, encontros familiares e momentos de lazer.",
        visible: true,
        order: 2,
      },
      {
        id: "piscina",
        question: "O espaço possui piscina?",
        answer:
          "Sim. A piscina é um dos principais espaços de lazer do Espaço Fernandes.",
        visible: true,
        order: 3,
      },
      {
        id: "wifi",
        question: "Tem Wi-Fi?",
        answer: "Sim.",
        visible: true,
        order: 4,
      },
      {
        id: "churrasqueira",
        question: "Tem churrasqueira?",
        answer: "Sim.",
        visible: true,
        order: 5,
      },
      {
        id: "consultar-data",
        question: "Como consultar uma data?",
        answer:
          "Entre em contato pelo WhatsApp para verificar disponibilidade.",
        visible: true,
        order: 6,
      },
      {
        id: "onde-fica",
        question: "Onde fica?",
        answer:
          "O Espaço Fernandes fica na Rua Fonte Grande, 8898, em Formosa, Uibaí - BA.",
        visible: true,
        order: 7,
      },
    ],
  },
  footer: {
    backLabel: "Voltar à página inicial",
    rightsText: "Espaço Fernandes — Formosa, Uibaí - BA",
  },
};

export default espacoFernandes;
