import assert from "node:assert/strict";
import test from "node:test";
import { buildStaticMediaLibrary } from "../src/lib/media/static-media-library.ts";
import { validateMediaLibraryConfig } from "../src/lib/media/library.ts";

test("bibliotecas iniciais preservam galerias, vídeos e um único principal", () => {
  const chacara = buildStaticMediaLibrary("chacara-alto-dos-torres");
  const espaco = buildStaticMediaLibrary("espaco-fernandes");
  assert.equal(chacara.items.filter((item) => item.type === "image").length, 21);
  assert.equal(chacara.items.filter((item) => item.type === "video").length, 4);
  assert.equal(espaco.items.filter((item) => item.type === "image").length, 19);
  assert.equal(espaco.items.filter((item) => item.type === "video").length, 1);
  assert.equal(chacara.items.filter((item) => item.isPrimary).length, 1);
  assert.equal(espaco.items.filter((item) => item.isPrimary).length, 1);
  assert.equal(espaco.galleryInitialCount, 12);
});

test("validação bloqueia categoria em uso inexistente e dois vídeos principais", () => {
  const config = buildStaticMediaLibrary("chacara-alto-dos-torres");
  const assetIds = new Set(config.items.map((item) => item.assetId));
  const valid = validateMediaLibraryConfig(config, config.siteSlug, assetIds);
  assert.equal(valid.ok, true);

  const invalidCategory = structuredClone(config);
  invalidCategory.items[0].categoryId = "categoria-inexistente";
  assert.equal(validateMediaLibraryConfig(invalidCategory, config.siteSlug, assetIds).ok, false);

  const invalidPrimary = structuredClone(config);
  const videos = invalidPrimary.items.filter((item) => item.type === "video");
  videos[0].isPrimary = true;
  videos[1].isPrimary = true;
  videos[0].active = true;
  videos[1].active = true;
  assert.equal(validateMediaLibraryConfig(invalidPrimary, config.siteSlug, assetIds).ok, false);

  const invalidFeatured = structuredClone(config);
  const images = invalidFeatured.items.filter((item) => item.type === "image");
  images[0].featured = true;
  images[1].featured = true;
  images[0].active = true;
  images[1].active = true;
  assert.equal(validateMediaLibraryConfig(invalidFeatured, config.siteSlug, assetIds).ok, false);
});
