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

test("renderiza a landing page completa em português", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]*lang="pt-BR"/i);
  assert.match(html, /<title>Propriedade rural produtiva à venda<\/title>/i);
  assert.match(html, /Terra produtiva, lavouras implantadas e espaço para novos projetos/);
  assert.match(html, /Cultivos já presentes na propriedade/);
  assert.match(html, /Converse diretamente com o proprietário/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /Contato indisponível enquanto o número não for informado/);

  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|lorem ipsum/i);
  assert.doesNotMatch(html, /oportunidade imperdível|retorno garantido|última chance/i);
});
