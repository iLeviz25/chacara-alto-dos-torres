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
  assert.match(html, /Natureza, clima de serra e um espaço pronto para aproveitar/);
  assert.match(html, /Pomar, cultivos e sabores da propriedade/);
  assert.match(html, /Casa e espaços de convivência/);
  assert.match(html, /25\.000 litros no total/);
  assert.match(html, /Converse diretamente com o proprietário/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /https:\/\/wa\.me\/5574988700524\?text=/);
  assert.match(html, /Logo da Chácara Alto dos Torres/);

  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|lorem ipsum/i);
  assert.doesNotMatch(
    html,
    /oportunidade imperdível|retorno garantido|última chance|construção de apoio|mansão|resort|alto padrão/i,
  );
});
