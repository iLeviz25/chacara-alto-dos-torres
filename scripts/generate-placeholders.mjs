import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const outputDirectory = join(process.cwd(), "public", "images", "property");

const assets = [
  {
    file: "hero.webp",
    label: "Foto principal da propriedade",
    detail: "Substitua pela imagem real da área",
    motif: "fields",
    width: 1800,
    height: 1200,
  },
  {
    file: "vista-geral-01.webp",
    label: "Vista geral da área",
    detail: "Imagem temporária",
    motif: "horizon",
  },
  {
    file: "cafe-01.webp",
    label: "Plantação de café",
    detail: "Imagem temporária",
    motif: "coffee",
  },
  {
    file: "abacaxi-01.webp",
    label: "Plantação de abacaxi",
    detail: "Imagem temporária",
    motif: "pineapple",
  },
  {
    file: "outras-culturas-01.webp",
    label: "Outras culturas",
    detail: "Imagem temporária",
    motif: "seeds",
  },
  {
    file: "construcao-apoio-01.webp",
    label: "Construção simples de apoio",
    detail: "Imagem temporária",
    motif: "support",
  },
  {
    file: "acesso-01.webp",
    label: "Estrada de acesso",
    detail: "Imagem temporária",
    motif: "road",
  },
  {
    file: "agua-01.webp",
    label: "Informações sobre água",
    detail: "Imagem temporária",
    motif: "water",
  },
];

const motifs = {
  fields: `
    <path d="M-100 1000 C300 760 500 870 820 650 C1080 470 1350 610 1920 220 L1920 1300 L-100 1300Z" fill="#173f2b"/>
    <path d="M-120 1120 C340 820 570 980 900 710 C1210 470 1520 620 1940 320" fill="none" stroke="#6f8b55" stroke-width="74"/>
    <path d="M-80 1210 C330 940 600 1090 970 790 C1270 545 1550 700 1940 430" fill="none" stroke="#b8793e" stroke-width="30" opacity=".82"/>
    <path d="M800 1180 C1040 990 1340 1040 1880 650" fill="none" stroke="#f5f1e8" stroke-width="5" opacity=".32"/>
  `,
  horizon: `
    <path d="M0 700 Q280 470 560 650 T1200 520 L1200 900 L0 900Z" fill="#315b3e"/>
    <path d="M0 760 Q260 590 520 730 T1200 600" fill="none" stroke="#9dac7c" stroke-width="90"/>
    <path d="M0 830 Q300 670 560 790 T1200 680" fill="none" stroke="#b8793e" stroke-width="34"/>
  `,
  coffee: `
    <g fill="#315b3e" opacity=".95">
      <ellipse cx="230" cy="570" rx="150" ry="72" transform="rotate(-32 230 570)"/>
      <ellipse cx="440" cy="670" rx="165" ry="78" transform="rotate(28 440 670)"/>
      <ellipse cx="720" cy="565" rx="158" ry="74" transform="rotate(-25 720 565)"/>
      <ellipse cx="960" cy="685" rx="170" ry="76" transform="rotate(32 960 685)"/>
    </g>
    <g fill="#b8793e"><circle cx="365" cy="620" r="30"/><circle cx="600" cy="630" r="34"/><circle cx="840" cy="630" r="28"/></g>
  `,
  pineapple: `
    <g fill="none" stroke="#315b3e" stroke-width="20" stroke-linecap="round">
      <path d="M250 820 Q270 570 190 420 M250 600 Q170 520 125 520 M250 610 Q340 500 390 500"/>
      <path d="M600 820 Q620 540 535 370 M610 590 Q520 480 455 470 M610 570 Q710 450 785 455"/>
      <path d="M950 820 Q970 590 900 430 M950 610 Q860 520 815 520 M960 600 Q1040 500 1090 510"/>
    </g>
    <g fill="#b8793e"><ellipse cx="250" cy="720" rx="92" ry="128"/><ellipse cx="610" cy="700" rx="100" ry="138"/><ellipse cx="955" cy="730" rx="90" ry="125"/></g>
  `,
  seeds: `
    <g fill="#315b3e" opacity=".92">
      <circle cx="210" cy="650" r="95"/><circle cx="440" cy="540" r="58"/><circle cx="610" cy="720" r="120"/><circle cx="870" cy="575" r="88"/><circle cx="1080" cy="710" r="66"/>
    </g>
    <g fill="none" stroke="#b8793e" stroke-width="18"><path d="M0 820 Q340 680 620 820 T1200 780"/><path d="M40 880 Q350 740 640 880 T1180 835"/></g>
  `,
  support: `
    <g fill="none" stroke="#315b3e" stroke-width="22" stroke-linejoin="round">
      <path d="M280 780 V500 L600 310 L920 500 V780Z"/>
      <path d="M520 780 V590 H680 V780 M230 520 L600 270 L970 520"/>
    </g>
    <path d="M0 820 H1200" stroke="#b8793e" stroke-width="38"/>
  `,
  road: `
    <path d="M410 900 Q500 650 650 520 Q820 370 1080 300" fill="none" stroke="#b8793e" stroke-width="210"/>
    <path d="M410 900 Q500 650 650 520 Q820 370 1080 300" fill="none" stroke="#f5f1e8" stroke-width="7" stroke-dasharray="28 30" opacity=".78"/>
    <path d="M0 760 Q260 640 430 700" fill="none" stroke="#315b3e" stroke-width="120"/>
    <path d="M780 690 Q980 570 1240 620" fill="none" stroke="#315b3e" stroke-width="145"/>
  `,
  water: `
    <g fill="none" stroke-linecap="round">
      <path d="M130 600 Q300 500 470 600 T810 600 T1150 600" stroke="#315b3e" stroke-width="34"/>
      <path d="M80 705 Q260 605 440 705 T800 705 T1160 705" stroke="#6f8b75" stroke-width="28"/>
      <path d="M170 800 Q330 720 490 800 T810 800 T1130 800" stroke="#b8793e" stroke-width="18"/>
    </g>
  `,
};

function makeSvg(asset) {
  const width = asset.width ?? 1200;
  const height = asset.height ?? 900;
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 1200 900" preserveAspectRatio="none">
      <rect width="1200" height="900" fill="#e9e2d4"/>
      <circle cx="1080" cy="110" r="250" fill="#d4d8b7" opacity=".7"/>
      <circle cx="95" cy="85" r="190" fill="#f5f1e8" opacity=".95"/>
      ${motifs[asset.motif]}
      <rect x="70" y="70" width="286" height="42" rx="21" fill="#173f2b"/>
      <text x="213" y="98" text-anchor="middle" fill="#fff" font-size="17" font-family="Arial, Helvetica, sans-serif" font-weight="700" letter-spacing="1.6">IMAGEM TEMPORÁRIA</text>
      <rect x="70" y="135" width="760" height="192" rx="24" fill="#f5f1e8" opacity=".94"/>
      <text x="110" y="218" fill="#173f2b" font-size="48" font-family="Arial, Helvetica, sans-serif" font-weight="700">${asset.label}</text>
      <text x="110" y="273" fill="#4e584c" font-size="26" font-family="Arial, Helvetica, sans-serif">${asset.detail}</text>
    </svg>`;
}

await mkdir(outputDirectory, { recursive: true });

for (const asset of assets) {
  await sharp(Buffer.from(makeSvg(asset)))
    .webp({ quality: 86, effort: 5 })
    .toFile(join(outputDirectory, asset.file));
}

const favicon = `
  <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
    <rect width="128" height="128" rx="28" fill="#173f2b"/>
    <path d="M12 102 C42 74 55 90 77 63 C94 43 106 48 124 27" fill="none" stroke="#9dac7c" stroke-width="20"/>
    <path d="M18 112 C45 86 61 101 84 74 C100 55 111 58 127 42" fill="none" stroke="#b8793e" stroke-width="8"/>
    <path d="M28 66 C41 34 67 24 98 23 C84 46 65 61 28 66Z" fill="#f5f1e8"/>
  </svg>`;

await sharp(Buffer.from(favicon))
  .png({ compressionLevel: 9 })
  .toFile(join(process.cwd(), "public", "favicon.png"));

console.log(`Placeholders gerados em ${outputDirectory}`);
