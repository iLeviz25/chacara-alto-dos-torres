export interface HubImage {
  src: string;
  alt: string;
}

export interface HubProject {
  id: "chacara" | "espaco-fernandes";
  name: string;
  purpose: string;
  description: string;
  buttonLabel: string;
  route: string;
  image: HubImage | null;
  logo: HubImage | null;
}

export interface HubContent {
  seo: {
    title: string;
    description: string;
    keywords: string[];
    canonicalUrl: string | null;
    favicon: string;
    robots: {
      index: boolean;
      follow: boolean;
    };
  };
  accessibilityTitle: string;
  projectsLabel: string;
  projects: [HubProject, HubProject];
  routes: {
    home: string;
    chacara: string;
    espacoFernandes: string;
  };
  contact: {
    title: string;
    whatsappLabel: string;
    whatsapp: {
      countryCode: string;
      number: string;
      message: string;
    };
    instagramLabel: string;
    instagramUrl: string;
  };
  espacoFernandes: {
    pageTitle: string;
    purpose: string;
    eyebrow: string;
    message: string;
    whatsappLabel: string;
    whatsappMessage: string;
    instagramLabel: string;
    homeLabel: string;
    seoTitle: string;
    seoDescription: string;
  };
}

const routes = {
  home: "/",
  chacara: "/chacara-alto-dos-torres",
  espacoFernandes: "/espaco-fernandes",
} as const;

export const hub: HubContent = {
  seo: {
    title: "Chácara Alto dos Torres e Espaço Fernandes",
    description:
      "Conheça a Chácara Alto dos Torres, propriedade à venda na Serra de Uibaí, e o Espaço Fernandes, espaço para locação.",
    keywords: [
      "Chácara Alto dos Torres",
      "chácara à venda na Serra de Uibaí",
      "Espaço Fernandes",
      "espaço para locação",
    ],
    canonicalUrl: "https://chacara-alto-dos-torres.vercel.app",
    favicon: "/favicon.png",
    robots: {
      index: true,
      follow: true,
    },
  },
  accessibilityTitle: "Chácara Alto dos Torres e Espaço Fernandes",
  projectsLabel: "Escolha qual propriedade deseja conhecer",
  routes,
  projects: [
    {
      id: "chacara",
      name: "Chácara Alto dos Torres",
      purpose: "Chácara à venda na Serra de Uibaí",
      description:
        "Conheça uma propriedade com área total de 6 tarefas, pomar, casa, estrutura de apoio ao lazer e produção agrícola.",
      buttonLabel: "Conhecer a chácara",
      route: routes.chacara,
      image: {
        src: "/images/property/real/vista-geral-01.webp",
        alt: "Vista aérea da Chácara Alto dos Torres e da paisagem da região",
      },
      logo: null,
    },
    {
      id: "espaco-fernandes",
      name: "Espaço Fernandes",
      purpose: "Espaço para locação",
      description: "Um espaço pensado para receber momentos especiais.",
      buttonLabel: "Conhecer o Espaço Fernandes",
      route: routes.espacoFernandes,
      image: null,
      logo: {
        src: "/images/brands/espaco-fernandes-logo.png",
        alt: "Logo oficial do Espaço Fernandes",
      },
    },
  ],
  contact: {
    title: "Contato",
    whatsappLabel: "Falar pelo WhatsApp",
    whatsapp: {
      countryCode: "55",
      number: "74988700524",
      message:
        "Olá! Vi a página da Chácara Alto dos Torres e do Espaço Fernandes e gostaria de mais informações.",
    },
    instagramLabel: "Instagram do Espaço Fernandes",
    instagramUrl: "https://www.instagram.com/espaco.fernandes1/",
  },
  espacoFernandes: {
    pageTitle: "Espaço Fernandes",
    purpose: "Espaço para locação",
    eyebrow: "Apresentação em preparação",
    message: "A apresentação completa do Espaço Fernandes será adicionada em breve.",
    whatsappLabel: "Falar pelo WhatsApp",
    whatsappMessage:
      "Olá! Gostaria de receber mais informações sobre o Espaço Fernandes.",
    instagramLabel: "Visitar o Instagram",
    homeLabel: "Voltar à página inicial",
    seoTitle: "Espaço Fernandes | Espaço para locação",
    seoDescription:
      "Página provisória do Espaço Fernandes, espaço para locação. A apresentação completa será adicionada em breve.",
  },
};

export default hub;
