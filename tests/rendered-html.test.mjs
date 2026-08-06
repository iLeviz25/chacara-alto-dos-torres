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

test("renderiza a Chácara Alto dos Torres com os dados confirmados", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]*lang="pt-BR"/i);
  assert.match(html, /<title>Chácara Alto dos Torres \| Chácara à venda na Serra de Uibaí<\/title>/i);
  assert.match(html, /Natureza, produção e tranquilidade na Serra de Uibaí/);
  assert.match(html, /25 mil litros de armazenamento/);
  assert.match(html, /Pomar, cultivos e sabores da propriedade/);
  assert.match(html, /Casa e espaços de convivência/);
  assert.match(html, /25\.000 litros de armazenamento/);
  assert.match(html, /Converse diretamente com o proprietário/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /https:\/\/wa\.me\/5574988700524\?text=/);
  assert.match(html, /Logo da Chácara Alto dos Torres/);
  assert.match(html, /\/images\/property\/real\/vista-geral-01\.webp/);
  assert.match(html, /Vista aérea da Chácara Alto dos Torres/);
  assert.match(html, /Cisterna da propriedade/);
  assert.match(html, /Frutífera do pomar/);
  assert.match(html, /Vista da região a partir da propriedade/);
  assert.match(html, /Estrada de acesso à região/);
  assert.match(html, /Conheça a Chácara Alto dos Torres em vídeo/);
  assert.match(html, /Apresentação da Chácara Alto dos Torres/);
  assert.match(html, /\/videos\/property\/apresentacao-principal\.mp4/);
  assert.match(html, /\/videos\/property\/video-curto-03\.mp4/);
  assert.match(html, /Reproduzir vídeo: Apresentação da Chácara Alto dos Torres \(1:29\)/);
  assert.doesNotMatch(html, /<video\b/i);
  assert.doesNotMatch(html, /autoplay/i);
  assert.match(html, /A aproximadamente 7 km de Uibaí/);
  assert.match(html, /Estrada de terra em boas condições/);
  assert.match(html, /Consulte o valor diretamente com o proprietário\./);
  assert.match(html, /Condição de pagamento/);
  assert.match(html, /À vista/);
  assert.match(html, /Qual é o valor da chácara\?/);
  assert.match(html, /Como é o acesso à propriedade\?/);
  assert.match(html, /Como posso visitar a chácara\?/);
  assert.match(html, /Consultar valor e agendar visita/);
  assert.doesNotMatch(html, /\/images\/property\/real\/cafe-01\.webp|Cultivo de café/);

  assert.doesNotMatch(
    html,
    /codex-preview|react-loading-skeleton|lorem ipsum|imagem temporária|serão adicionadas em uma próxima etapa/i,
  );
  assert.doesNotMatch(
    html,
    /oportunidade imperdível|retorno garantido|última chance|construção de apoio|mansão|resort|alto padrão/i,
  );
});
