# Guia de edição — Chácara Alto dos Torres

Este guia explica como atualizar o anúncio sem alterar os componentes do site.

Quase todo o conteúdo fica em:

`src/content/property.ts`

As imagens ficam em:

`public/images/`

## Antes de editar

1. Faça uma alteração por vez.
2. Textos devem permanecer entre aspas.
3. Use `true` para exibir e `false` para ocultar.
4. Use `null` ou uma string vazia nos dados ainda não confirmados.
5. Não apague chaves, vírgulas ou colchetes sem seguir um item existente.
6. Não publique medidas, preço, documentos ou condições de acesso sem confirmação.

## Nome, textos e seções

O nome oficial está em `propertyName`.

Os textos da primeira tela ficam em `hero`. A visão geral fica em `overview`, a casa em `supportHouse`, a infraestrutura em `infrastructure`, os cultivos em `crops` e as perguntas em `faq`.

O bloco `sections` permite ligar ou desligar cada parte da página. A seção de vídeos também fica oculta automaticamente quando não há nenhum vídeo visível.

## Logo

O logo oficial está em:

`public/images/brand/logo-chacara-alto-dos-torres.png`

O caminho e o texto alternativo ficam em `brand.logo`. Preserve a proporção quadrada e não corte, redesenhe ou comprima o logo.

## Área

A área confirmada está cadastrada assim:

```ts
area: {
  total: {
    value: "6",
    unit: "tarefas",
  },
},
areaEquivalent: "",
```

Não converta as 6 tarefas. Quando uma equivalência oficial for confirmada, preencha apenas `areaEquivalent`. Enquanto estiver vazio, ela não será exibida.

## WhatsApp

O contato fica em `contact.whatsapp`:

```ts
countryCode: "55",
number: "74988700524",
message: "Olá! Vi o site da Chácara Alto dos Torres e gostaria de receber mais informações.",
```

Use somente algarismos no código do país e no número. O endereço produzido deve começar com:

`https://wa.me/5574988700524`

Teste o botão em um celular depois de qualquer alteração.

## Pomar e cultivos

Os três destaques grandes ficam em `crops.items`. Quantidade, estágio de produção e colheita devem continuar como `null` até serem confirmados.

A lista compacta de frutíferas e culturas fica em `crops.cultures`. Para incluir um item, adicione um novo texto à lista. Para removê-lo, apague somente a linha correspondente e ajuste a vírgula quando necessário.

## Casa e espaços de convivência

Os textos e destaques ficam em `supportHouse`. Os dados futuros da casa estão em `supportHouse.details`:

- `rooms`: total de cômodos.
- `bedrooms`: quantidade de quartos.
- `bathrooms`: quantidade de banheiros.
- `kitchen`: informações da cozinha.
- `livingRoom`: informações da sala.
- `condition`: estado de conservação.
- `furnitureIncluded`: mobília incluída.
- `needsRenovation`: necessidade de reforma.

Não deduza quartos, banheiros, conservação, mobília ou reforma a partir de fotos.

## Água e infraestrutura

Os cards ficam em `infrastructure.items`. Altere capacidades ou descrições somente quando houver informação confirmada. Não descreva a água como potável e não inclua poço, nascente, rio ou irrigação sem comprovação.

## Localização

A informação confirmada fica em `location.approximateLocation`.

Os campos de cidade, estado, comunidade, distâncias, estrada, coordenadas e mapa permanecem preparados no mesmo bloco. Campos vazios não aparecem na página.

Por segurança, não publique o endereço exato. Mantenha `showExactAddress: false`.

## Galeria e fotografias reais

As fotos reais da propriedade ficam em `public/images/property/real/`, preferencialmente em WebP.

Cada foto é cadastrada em `gallery.items` com:

```ts
{
  id: "varanda-01",
  src: "/images/property/varanda-01.webp",
  alt: "Varanda em L da Chácara Alto dos Torres",
  caption: "Varanda em L",
  isPlaceholder: false,
  category: "veranda",
  order: 2,
  visible: true,
},
```

Categorias disponíveis:

- `overview`: vista geral.
- `house`: casa.
- `veranda`: varanda.
- `country-kitchen`: espaço caipira.
- `orchard-crops`: pomar e cultivos.
- `water-infrastructure`: água e infraestrutura.
- `landscape`: paisagem.
- `access`: acesso.

Use um `id` único, uma ordem sem repetição e um texto alternativo que descreva a fotografia real. Ao substituir uma imagem temporária, altere `isPlaceholder` para `false`.

## Vídeos

A página aceita links do YouTube, Vimeo, publicações públicas do Instagram e arquivos MP4 locais.

Exemplo de vídeo principal horizontal:

```ts
{
  id: "apresentacao",
  title: "Conheça a Chácara Alto dos Torres",
  description: "Visão geral da propriedade.",
  url: "https://www.youtube.com/watch?v=CODIGO_DO_VIDEO",
  coverImage: null,
  role: "main",
  format: "horizontal",
  duration: "1:29",
  order: 1,
  visible: true,
},
```

Para um vídeo curto vertical, use `role: "short"` e `format: "vertical"`.

Para MP4 local, copie o arquivo para `public/videos/property/` e use um caminho como `/videos/property/visita.mp4`. A capa pode ficar em `public/images/property/video-covers/`.

Depois de cadastrar ao menos um vídeo real, altere `sections.videos` para `true`. Os vídeos não iniciam automaticamente e o arquivo só é disponibilizado ao player depois da interação do visitante.

## Preço, documentação e negociação

As seções permanecem desativadas enquanto os dados não estiverem confirmados:

```ts
pricing: false,
documentation: false,
```

Não invente preço, documentos ou condições. Quando houver confirmação, preencha os campos em `negotiation` antes de ativar as seções.

## Disponível, reservada ou vendida

Altere `status` para uma destas opções:

- `available`: disponível.
- `reserved`: reservada.
- `sold`: vendida.

Nos estados reservada e vendida, os principais botões de contato são substituídos pela mensagem correspondente.

## Conferência antes de publicar

- Revise nome, acentos e informações confirmadas.
- Confirme que nenhuma imagem temporária está identificada como real.
- Teste a navegação, a galeria, o menu móvel e o FAQ.
- Teste todos os botões de WhatsApp.
- Confira o site no celular, tablet e computador.
- Execute as verificações de tipos, lint, testes e build.
