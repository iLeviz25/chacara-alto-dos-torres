import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_SITE_THEMES,
  themeCssProperties,
  themesAreEqual,
  validateSiteTheme,
} from "../src/lib/theme/site-theme.ts";

test("os temas padrão dos dois projetos são válidos e independentes", () => {
  const chacara = DEFAULT_SITE_THEMES["chacara-alto-dos-torres"];
  const espaco = DEFAULT_SITE_THEMES["espaco-fernandes"];

  assert.equal(validateSiteTheme(chacara).ok, true);
  assert.equal(validateSiteTheme(espaco).ok, true);
  assert.equal(themesAreEqual(chacara, espaco), false);
  assert.notEqual(chacara.colors.primary, espaco.colors.primary);
});

test("a validação bloqueia CSS livre, cores inválidas e baixo contraste", () => {
  const invalidColor = structuredClone(DEFAULT_SITE_THEMES["chacara-alto-dos-torres"]);
  invalidColor.colors.primary = "red";
  assert.equal(validateSiteTheme(invalidColor).ok, false);

  const lowContrast = structuredClone(DEFAULT_SITE_THEMES["espaco-fernandes"]);
  lowContrast.colors.text = "#ffffff";
  lowContrast.colors.background = "#ffffff";
  assert.equal(validateSiteTheme(lowContrast).ok, false);

  const freeCss = {
    ...structuredClone(DEFAULT_SITE_THEMES["espaco-fernandes"]),
    css: "body { display: none }",
  };
  const validated = validateSiteTheme(freeCss);
  assert.equal(validated.ok, true);
  if (validated.ok) assert.equal("css" in validated.theme, false);
});

test("o tema gera somente variáveis CSS controladas", () => {
  const properties = themeCssProperties(DEFAULT_SITE_THEMES["chacara-alto-dos-torres"]);
  assert.equal(properties["--site-primary"], "#0d293c");
  assert.equal(properties["--site-button-radius"], "999px");
  assert.equal(Object.keys(properties).every((key) => key.startsWith("--site-")), true);
});
