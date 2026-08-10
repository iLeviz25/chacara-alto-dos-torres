import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("renderiza a nova página inicial com os dois projetos", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(
    html,
    /<title>Chácara Alto dos Torres e Espaço Fernandes<\/title>/i,
  );
  assert.match(html, /Escolha qual propriedade deseja conhecer/);
  assert.match(html, /Chácara à venda na Serra de Uibaí/);
  assert.match(html, /Conheça uma propriedade com área total de 6 tarefas/);
  assert.match(html, /href="\/chacara-alto-dos-torres"/);
  assert.match(html, /Locação por diária/);
  assert.match(
    html,
    /Espaço privado para aniversários, confraternizações e momentos de lazer em Formosa, Uibaí\./,
  );
  assert.match(html, /href="\/espaco-fernandes"/);
  assert.match(html, /\/images\/property\/real\/vista-geral-01\.webp/);
  assert.match(html, /\/images\/espaco-fernandes\/logo\.webp/);
  assert.match(
    html,
    /\/images\/espaco-fernandes\/real\/vista-geral-piscina-01\.webp/,
  );
  assert.match(html, /https:\/\/wa\.me\/5574988700524\?text=/);
  assert.match(html, /https:\/\/www\.instagram\.com\/espaco\.fernandes1\//);
  assert.match(
    html,
    /<link rel="canonical" href="https:\/\/chacara-alto-dos-torres\.vercel\.app"\/>/,
  );
  assert.match(
    html,
    /<meta property="og:image" content="https:\/\/chacara-alto-dos-torres\.vercel\.app\/og\.png"\/>/,
  );
  assert.doesNotMatch(
    html,
    /capacidade para|buffet|casamento|preço da locação/i,
  );
});

test("renderiza a landing page definitiva do Espaço Fernandes", async () => {
  const response = await render("/espaco-fernandes");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(
    html,
    /<title>Espaço Fernandes \| Locação por diária em Formosa, Uibaí<\/title>/i,
  );
  assert.match(
    html,
    /<h1[^>]*>Piscina, lazer e privacidade para celebrar em Formosa<\/h1>/,
  );
  assert.match(html, /Locação por diária em Formosa, Uibaí/);
  assert.match(
    html,
    /Espaço privativo para aniversários, confraternizações, encontros em família e dias de lazer com amigos\./,
  );
  assert.match(html, /\/images\/espaco-fernandes\/logo\.webp/);
  assert.match(
    html,
    /\/images\/espaco-fernandes\/video-covers\/apresentacao-principal\.webp/,
  );
  assert.match(
    html,
    /\/videos\/espaco-fernandes\/apresentacao-principal\.mp4/,
  );
  assert.match(
    html,
    /Reproduzir vídeo: Conheça o Espaço Fernandes \(1:09\)/,
  );
  assert.doesNotMatch(html, /<video\b/i);
  assert.doesNotMatch(html, /autoplay/i);
  assert.match(html, /Privacidade para reunir quem importa/);
  assert.match(html, /Piscina, área gourmet e lazer no mesmo ambiente/);
  assert.match(html, /Piscina/);
  assert.match(html, /Área gourmet/);
  assert.match(html, /Churrasqueira/);
  assert.match(html, /Freezer/);
  assert.match(html, /Mesa de sinuca/);
  assert.match(html, /Baralho e dominó disponíveis\./);
  assert.match(html, /TV na área de convivência\./);
  assert.match(html, /Conexão disponível no espaço\./);
  assert.match(html, /Ocasiões que combinam com o espaço/);
  assert.match(html, /Aniversários/);
  assert.match(html, /Confraternizações/);
  assert.match(html, /Reuniões familiares/);
  assert.match(html, /Encontros entre amigos/);
  assert.match(html, /Dia de lazer/);
  assert.match(html, /Conheça os ambientes/);
  assert.match(html, />Ver todas<\/button>/);
  assert.match(html, /12 de 18 fotos exibidas/);
  assert.match(html, />Vista geral<\/button>/);
  assert.match(html, />Piscina<\/button>/);
  assert.match(html, />Área gourmet<\/button>/);
  assert.match(html, />Chalé<\/button>/);
  assert.match(html, />Lazer<\/button>/);
  assert.match(html, />Estrutura<\/button>/);
  assert.match(html, /\/images\/espaco-fernandes\/real\/vista-geral-piscina-01\.webp/);
  assert.match(html, /\/images\/espaco-fernandes\/real\/area-gourmet-noturna-01\.webp/);
  assert.match(html, /\/images\/espaco-fernandes\/real\/chale-entrada-01\.webp/);
  assert.match(html, /Um espaço para descansar/);
  assert.match(
    html,
    /O chalé oferece um ambiente reservado para pausas e descanso durante a diária\./,
  );
  assert.match(html, /Em Formosa, Uibaí/);
  assert.match(html, /Rua Fonte Grande, 8898/);
  assert.match(html, /Formosa, Uibaí - BA/);
  assert.match(html, /Consulte disponibilidade para sua diária/);
  assert.match(html, /Consultar disponibilidade pelo WhatsApp/);
  assert.match(html, /href="\/"/);
  assert.match(html, /https:\/\/wa\.me\/5574988700524\?text=/);
  assert.match(html, /https:\/\/www\.instagram\.com\/espaco\.fernandes1\//);
  assert.match(html, /href="mailto:paguefeliz@gmail\.com"/);
  assert.match(html, /Como funciona a locação\?/);
  assert.match(html, /O espaço possui piscina\?/);
  assert.match(html, /Como consultar uma data\?/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /"@type":"LocalBusiness"/);
  assert.match(
    html,
    /<link rel="canonical" href="https:\/\/chacara-alto-dos-torres\.vercel\.app\/espaco-fernandes"\/>/,
  );
  assert.match(
    html,
    /<meta property="og:image" content="https:\/\/chacara-alto-dos-torres\.vercel\.app\/images\/espaco-fernandes\/og-espaco-fernandes\.webp"\/>/,
  );
  assert.doesNotMatch(
    html,
    /hotel|pousada|resort|salão de festas de luxo|capacidade máxima|caução|check-in|check-out|preço da locação/i,
  );
  assert.doesNotMatch(html, /apresentação completa.*será adicionada em breve/i);
});

test("preserva a Chácara Alto dos Torres na nova rota", async () => {
  const response = await render("/chacara-alto-dos-torres");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]*lang="pt-BR"/i);
  assert.match(html, /<title>Chácara Alto dos Torres \| Chácara à venda na Serra de Uibaí<\/title>/i);
  assert.match(html, /<h1[^>]*>Chácara à venda na Serra de Uibaí<\/h1>/);
  assert.match(
    html,
    /Natureza, produção e tranquilidade em uma propriedade com 6 tarefas\./,
  );
  assert.doesNotMatch(html, /<strong[^>]*>à venda<\/strong>/);
  assert.match(html, /Área total: 6 tarefas/);
  assert.match(html, /A propriedade possui uma área total de 6 tarefas/);
  assert.doesNotMatch(html, /Área informada|área informada de 6 tarefas/);
  assert.match(html, /25 mil litros de armazenamento/);
  assert.match(html, /Pomar e cultivos já implantados/);
  assert.match(html, /Casa e espaços de convivência/);
  assert.match(html, /25\.000 litros de armazenamento/);
  assert.match(html, /Consulte o valor e agende sua visita/);
  assert.match(html, /Valor sob consulta/);
  assert.match(html, /Pagamento à vista/);
  assert.match(html, /Visitas mediante agendamento prévio/);
  assert.match(html, /Contato direto com o proprietário/);
  assert.match(html, /\/images\/property\/owner\/proprietario\.webp/);
  assert.match(html, /Proprietário da Chácara Alto dos Torres/);
  assert.match(html, /sizes="280px"/);
  assert.match(html, /E-mail do proprietário/);
  assert.match(html, /href="mailto:paguefeliz@gmail\.com"/);
  assert.match(html, />paguefeliz@gmail\.com</);
  assert.doesNotMatch(html, /Informações para negociação|Converse diretamente com o proprietário/);
  assert.match(html, /application\/ld\+json/);
  assert.match(
    html,
    /<link rel="canonical" href="https:\/\/chacara-alto-dos-torres\.vercel\.app\/chacara-alto-dos-torres"\/>/,
  );
  assert.match(
    html,
    /"url":"https:\/\/chacara-alto-dos-torres\.vercel\.app\/chacara-alto-dos-torres"/,
  );
  assert.match(html, /https:\/\/wa\.me\/5574988700524\?text=/);
  assert.match(html, /Logo da Chácara Alto dos Torres/);
  assert.match(html, /\/images\/property\/real\/vista-geral-01\.webp/);
  assert.match(html, /Vista aérea da Chácara Alto dos Torres/);
  assert.match(html, /Cisterna da propriedade/);
  assert.match(html, /Frutífera do pomar/);
  assert.match(html, /\/images\/property\/real\/cafe-01\.webp/);
  assert.match(html, /Cultivo de café/);
  assert.match(html, /Cafeeiro com frutos vermelhos na Chácara Alto dos Torres/);
  assert.match(html, /\/images\/property\/real\/jaca-01\.webp/);
  assert.match(html, /Jaca na Chácara Alto dos Torres/);
  assert.match(html, /Jaca em árvore frutífera da Chácara Alto dos Torres/);
  assert.match(html, /Vista da região a partir da propriedade/);
  assert.match(html, /Estrada de acesso à região/);
  assert.match(html, /Veja mais detalhes da chácara em vídeo/);
  assert.match(
    html,
    /Confira outros registros da propriedade, dos cultivos e das paisagens da Chácara Alto dos Torres\./,
  );
  assert.match(html, /Apresentação da Chácara Alto dos Torres/);
  assert.match(html, /Vista aérea da casa da Chácara Alto dos Torres, com vegetação e paisagem da região/);
  assert.match(html, /\/videos\/property\/apresentacao-principal\.mp4/);
  assert.match(html, /\/videos\/property\/video-curto-03\.mp4/);
  assert.match(html, /Assista à apresentação: Apresentação da Chácara Alto dos Torres \(1:29\)/);
  assert.doesNotMatch(html, /Reproduzir vídeo: Apresentação da Chácara Alto dos Torres/);
  assert.match(html, /Reproduzir vídeo: Conheça a propriedade \(0:20\)/);
  assert.match(html, /Vista aérea da Chácara Alto dos Torres e de seus arredores/);
  assert.doesNotMatch(html, /<video\b/i);
  assert.doesNotMatch(html, /autoplay/i);
  assert.match(html, /A aproximadamente 7 km de Uibaí/);
  assert.match(html, /Estrada de terra em boas condições/);
  assert.match(html, /Qual é o valor da chácara\?/);
  assert.match(html, /Como é o acesso à propriedade\?/);
  assert.match(html, /Como posso visitar a chácara\?/);
  assert.match(html, /Consultar valor e agendar visita/);
  assert.match(html, /Agende pelo WhatsApp uma visita para o dia de sua preferência./);
  assert.match(
    html,
    /Os limites da propriedade não estão demarcados na imagem./,
  );
  assert.doesNotMatch(html, />Espaço caipira<\/button>/);
  assert.doesNotMatch(html, /Um espaço para aproveitar de diferentes maneiras/);
  assert.doesNotMatch(html, /Um refúgio na Serra de Uibaí/);
  assert.doesNotMatch(
    html,
    /bem distribuídos|ampla e arejada|diferentes períodos de produção ao longo do ano/i,
  );
  assert.doesNotMatch(html, /Serra Azul de Uibaí/i);
  assert.doesNotMatch(
    html,
    /A documentação e outros detalhes ainda serão atualizados quando confirmados\./,
  );

  const sectionSequence = [
    'id="informacoes-confirmadas"',
    'id="galeria"',
    'id="casa-e-convivencia"',
    'id="agua-e-infraestrutura"',
    'id="pomar-e-cultivos"',
    'id="videos"',
    'id="localizacao"',
    'id="contato"',
    'id="perguntas-frequentes"',
    'id="mais-informacoes"',
  ].map((text) => html.indexOf(text));
  assert.ok(sectionSequence.every((position) => position >= 0));
  assert.ok(
    sectionSequence.every(
      (position, index) => index === 0 || position > sectionSequence[index - 1],
    ),
  );

  const gallerySequence = [
    "Vista aérea da chácara",
    "Casa e paisagem ao redor",
    "Quintal arborizado da casa",
    "Varanda da casa",
    "Cultivo de café",
    "Jaca na Chácara Alto dos Torres",
    "Tangerinas no pomar",
    "Mangas no pomar",
    "Abacaxi na área cultivada",
    "Paisagem nos arredores da chácara",
    "Cisterna da propriedade",
    "Estrada de acesso à região",
  ].map((text) => html.indexOf(text));
  assert.ok(gallerySequence.every((position) => position >= 0));
  assert.ok(
    gallerySequence.every(
      (position, index) => index === 0 || position > gallerySequence[index - 1],
    ),
  );

  assert.doesNotMatch(
    html,
    /codex-preview|react-loading-skeleton|lorem ipsum|imagem temporária|serão adicionadas em uma próxima etapa/i,
  );
  assert.doesNotMatch(
    html,
    /oportunidade imperdível|retorno garantido|última chance|construção de apoio|mansão|resort|alto padrão/i,
  );
});
