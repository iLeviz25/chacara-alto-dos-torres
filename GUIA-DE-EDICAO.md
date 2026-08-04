# Guia de edição do anúncio

Este guia explica como atualizar o anúncio sem precisar mexer nos componentes do site.

Quase todas as informações ficam em um único arquivo:

`src/content/property.ts`

As fotos ficam nesta pasta:

`public/images/property/`

## Antes de editar

1. Abra o arquivo `src/content/property.ts`.
2. Altere somente o conteúdo necessário. Textos ficam entre aspas.
3. Não apague vírgulas, chaves `{ }` ou colchetes `[ ]` sem seguir um exemplo já existente no arquivo.
4. Para opções de ligar e desligar, use `true` ou `false`, sem aspas:
   - `true` significa exibir.
   - `false` significa ocultar.
5. Salve o arquivo depois da alteração.

Se estiver em dúvida, faça uma alteração por vez. Assim, fica mais fácil localizar e corrigir qualquer erro.

## Alterar o título e os textos

No arquivo `src/content/property.ts`, procure por `hero`.

- `hero.eyebrow`: pequeno texto que aparece acima do título.
- `hero.title`: título principal da primeira tela.
- `hero.subtitle`: subtítulo logo abaixo do título.
- `hero.detailsNotice`: aviso discreto sobre informações que ainda estão sendo levantadas.

Os resumos gerais ficam em `shortDescription` e `fullDescription`, perto do início do conteúdo.

Os outros textos estão organizados pelo nome de cada parte do site. Por exemplo, os textos da visão geral ficam em `overview`, os textos da construção de apoio ficam em `supportHouse` e as perguntas frequentes ficam em `faq`.

Para mudar um texto, altere apenas o conteúdo entre aspas. Exemplo:

```ts
title: "Novo título da propriedade",
```

Não coloque informações ainda não confirmadas. Evite afirmar metragem, produtividade, documentação, renda ou condições de acesso sem verificar os dados.

## Informar cidade e estado

Procure por `location` e preencha:

```ts
city: "Nome da cidade",
state: "UF",
```

Também é possível preencher `region` e `community` quando essas informações forem confirmadas.

Por segurança, não publique o endereço exato nem coordenadas precisas. A localização completa pode ser informada diretamente aos interessados.

## Informar a área

Procure por `area` e altere:

- `total`: área total da propriedade.
- `unit`: unidade usada, como `hectares` ou `alqueires`, dentro de cada item.
- `planted`: área plantada, quando confirmada.
- `free`: área livre, quando confirmada.

Cada medida usa este formato:

```ts
total: {
  label: "Área total",
  value: "12",
  unit: "hectares",
  showWhenUnknown: true,
},
```

Use o exemplo apenas como formato: substitua `12` pela medida realmente confirmada. Não estime a metragem. Enquanto o dado não estiver confirmado, mantenha `value: null`.

## Informar ou ocultar o valor

Procure por `negotiation` e, dentro dele, por `price`.

Para mostrar um preço confirmado:

```ts
amount: 850000,
showPrice: true,
showAsOnRequest: false,
```

No exemplo acima, `850000` corresponde a R$ 850.000,00. Digite apenas os números, sem `R$`, pontos ou vírgulas.

Para exibir “Valor sob consulta” sem publicar o preço:

```ts
showPrice: false,
showAsOnRequest: true,
```

Para ocultar toda a parte de valor e negociação, deixe `pricing: false` dentro de `sections`.

Só informe um valor depois que ele estiver confirmado pelo proprietário.

## Exibir ou ocultar seções

Procure por `sections`. Cada linha controla uma parte do site. Exemplo:

```ts
sections: {
  gallery: true,
  videos: false,
  documentation: false,
  pricing: false,
},
```

Troque `true` por `false` para ocultar uma seção. Troque `false` por `true` para exibi-la.

Quando uma lista, como a galeria ou os vídeos, não tiver nenhum item visível, o site oculta essa seção automaticamente, mesmo que o controle esteja como `true`. A seção oculta não deixa espaço vazio na página.

## Alterar o número do WhatsApp

Procure por `contact`, depois por `whatsapp`, e altere:

```ts
countryCode: "55",
number: "11999999999",
```

- `countryCode`: código do país. Para o Brasil, use `55`.
- `number`: DDD e número do celular.

Digite somente números, sem `+`, espaços, parênteses ou traços. Confira o número antes de publicar e teste pelo menos um botão do WhatsApp no celular.

## Modificar a mensagem automática do WhatsApp

No mesmo bloco `contact.whatsapp`, procure por `message`:

```ts
message: "Olá! Vi o site da propriedade rural e gostaria de receber mais informações.",
```

Escreva a mensagem normalmente, com acentos e pontuação. O site prepara o texto para o link automaticamente; não é necessário substituir espaços por códigos como `%20`.

## Substituir a foto principal

A forma mais simples é manter o nome `hero.webp`:

1. Prepare a nova foto no formato WebP.
2. Nomeie o arquivo como `hero.webp`.
3. Coloque-o em `public/images/property/`.
4. Confirme a substituição do arquivo antigo.
5. No bloco `hero.mainImage`, atualize o texto `alt` para descrever a foto real.
6. Altere `isPlaceholder: true` para `isPlaceholder: false`.

Se preferir outro nome, copie a imagem para a mesma pasta e altere `src` em `hero.mainImage`. O caminho deve começar com `/images/property/`. Exemplo:

```ts
src: "/images/property/vista-principal.webp",
alt: "Vista geral da propriedade e das áreas cultivadas",
```

Use uma foto horizontal, nítida e verdadeira da propriedade. Não use imagens de banco de imagens nem fotos de outras propriedades.

## Adicionar fotos à galeria

1. Coloque a nova foto em `public/images/property/`.
2. Use um nome simples e sem acentos, como `cafe-02.webp`.
3. No arquivo `src/content/property.ts`, procure por `gallery.items`.
4. Copie um item existente, cole-o dentro da lista e altere seus dados.

Exemplo:

```ts
{
  id: "cafe-02",
  src: "/images/property/cafe-02.webp",
  alt: "Fileiras da plantação de café vistas de perto",
  caption: "Plantação de café",
  isPlaceholder: false,
  category: "cafe",
  order: 4,
  visible: true,
},
```

O texto `alt` deve explicar brevemente o que aparece na imagem. Em `category`, use uma categoria já existente na galeria, como vista geral, café, abacaxi, outras culturas, construção de apoio, água ou acesso. Copiar um item da mesma categoria é a opção mais segura.

Não repita o mesmo número de `order` em duas fotos visíveis.

## Alterar a ordem das fotos

Em `gallery.items`, cada foto possui um número em `order`. Os menores números aparecem primeiro.

Exemplo:

- `order: 1` aparece antes de `order: 2`.
- Para tornar uma foto a primeira da galeria, use `order: 1` nela e renumere as demais.

Use uma sequência simples, como 1, 2, 3 e 4. Para ocultar uma foto sem apagar seus dados, altere `visible` para `false`.

## Adicionar um vídeo

O site aceita links do YouTube ou Vimeo. Não é necessário enviar o arquivo de vídeo para o projeto.

1. Procure por `sections` e altere `videos` para `true`.
2. Procure por `videos.items`.
3. Adicione um item dentro de `videos.items` seguindo este formato:

```ts
{
  id: "visita-01",
  title: "Visita pela propriedade",
  description: "Vídeo com uma visão geral da área e dos cultivos.",
  url: "https://www.youtube.com/watch?v=CODIGO_DO_VIDEO",
  coverImage: null,
  visible: true,
},
```

4. Troque o link e os textos pelos dados verdadeiros do vídeo.
5. Se quiser usar uma imagem de capa, coloque-a em `public/images/property/` e copie o formato de uma imagem já cadastrada no arquivo, usando `isPlaceholder: false`.

Use o link público normal do vídeo e confira se ele permite incorporação. Se a lista não tiver nenhum vídeo visível, a seção continuará oculta automaticamente.

## Adicionar uma plantação

1. Coloque uma foto da plantação em `public/images/property/`, quando houver.
2. Procure por `crops.items`.
3. Copie o bloco de uma plantação existente.
4. Cole a cópia dentro da lista, antes do colchete de fechamento `]`.
5. Altere nome, descrição, imagem e demais informações confirmadas.
6. Deixe `visible: true` para mostrar o item.

Cada plantação precisa de um `id` único e de todos os campos do item copiado. Ao usar uma foto real, altere `isPlaceholder` para `false`.

Não mostre campos sem informação confirmada. Quantidade, unidade, estágio da produção e previsão de colheita podem permanecer sem preenchimento até o levantamento ser concluído.

## Remover uma plantação

A forma mais segura é ocultá-la sem apagar seus dados:

1. Procure a plantação dentro de `crops.items`.
2. Altere `visible: true` para `visible: false`.
3. Salve o arquivo.

Ela deixará de aparecer no site, mas poderá ser reativada depois. Se quiser apagar definitivamente, remova todo o bloco daquela plantação, da chave de abertura `{` até a chave de fechamento `}`, incluindo a vírgula que separa esse item dos demais.

## Marcar a propriedade como vendida

Perto do início dos dados da propriedade, procure por `status` e altere para:

```ts
status: "sold",
```

Os valores possíveis são:

- `available`: disponível.
- `reserved`: reservada.
- `sold`: vendida.

Com `sold`, o site informa discretamente que a propriedade foi vendida e substitui os principais botões de contato por uma mensagem adequada. Para voltar a oferecer o imóvel, altere o status para `available`.

## Publicar as alterações pela Vercel

Quando o repositório estiver conectado à Vercel, cada alteração enviada para a branch de produção — normalmente `main` — inicia uma nova publicação automaticamente.

### Se você usa o GitHub Desktop

1. Salve os arquivos alterados.
2. Abra o projeto no GitHub Desktop.
3. Confira a lista de arquivos em **Changes**.
4. Escreva um resumo curto, como `Atualiza fotos e informações da propriedade`.
5. Clique em **Commit to main**.
6. Clique em **Push origin**.
7. Abra o painel da Vercel e entre no projeto.
8. Acesse **Deployments** e aguarde o novo envio aparecer como **Ready**.
9. Clique em **Visit** para abrir o site publicado e conferir a alteração.

### Se você editou pelo site do GitHub

1. Clique em **Commit changes** ao terminar a edição.
2. Confirme o envio para a branch de produção.
3. Abra **Deployments** no painel da Vercel.
4. Aguarde o status **Ready** e abra o site para conferir.

Se a publicação aparecer como **Error**, abra o item com erro e compartilhe a mensagem exibida com a pessoa responsável pelo site. Não altere outros arquivos apenas para tentar esconder o erro.

## Conferência antes de publicar

- Confira título, textos, cidade, estado, área e valor.
- Verifique se nenhuma informação provisória foi apresentada como confirmada.
- Confira se as seções desejadas estão ligadas ou desligadas.
- Abra todas as fotos e verifique suas descrições.
- Teste o link do WhatsApp e a mensagem automática.
- Confira o site no celular e no computador.
- Se a propriedade foi vendida, confirme se o status está como `sold`.
