# Decisões de arquitetura

ADRs curtos. Um bloco por decisão, mais recente no topo.

## Deploy (Fase 7): `.nojekyll` via `public/`; 404 útil com seu próprio layout raiz

**Contexto:** o site precisa de `.nojekyll` na raiz do site publicado (senão o GitHub Pages processa o conteúdo como Jekyll e ignora pastas com `_`, quebrando `_next/` inteiro) e de um `404.html` útil (seção 3 do documento original). O projeto não tem uma pasta `public/` ainda; o `out/404.html` gerado era o padrão genérico do Next (só em inglês, sem links).
**Decisão:** `.nojekyll` vazio em `public/.nojekyll` — o `next build` já copia tudo de `public/` para a raiz do `out/` automaticamente, sem precisar de um passo extra no workflow (`touch`/`cp`) nem de lógica condicional. Pro 404, `src/app/not-found.tsx` virou um terceiro layout raiz independente (`<html>`/`<body>` próprios, mesmo padrão de `(root)/layout.tsx` — ver ADR "i18n sem middleware"), já que fica fora dos dois grupos de rota existentes e um 404 pode acontecer em qualquer caminho, sem locale conhecido. Reaproveita `languageChooserCopy.names`/`navLabel` de `src/content/language-chooser.ts` e ganha seu próprio `src/content/not-found.ts` com a mesma exceção de cópia fixa trilíngue (justificada pela mesma razão da página `/`: roda antes do locale ser conhecido).
**Consequência:** três layouts raiz independentes agora (`(root)`, `[locale]`, e o `not-found.tsx` do nível raiz), cada um com seu próprio `<html>`/`<body>`; nenhum deles usa `ThemeProvider`/fontes via `next/font` (mesma limitação que já existia em `(root)/layout.tsx` — tema e tipografia da marca só entram depois que o locale é conhecido).

## Deploy (Fase 7): workflow com `actions/configure-pages` + `upload-pages-artifact` + `deploy-pages`

**Contexto:** só existia `.github/workflows/ci.yml` (lint/typecheck/test/build); faltava o workflow de deploy em si (seção 3 do documento original).
**Decisão:** `.github/workflows/deploy.yml`, disparado em push na `main` (+ `workflow_dispatch` manual), com dois jobs (`build` e `deploy`, o segundo com `environment: github-pages` — é o que faz o GitHub mostrar a URL publicada no PR/Actions). Permissões mínimas no nível do workflow (`contents: read`, `pages: write`, `id-token: write`). Actions oficiais fixadas em tag major (`@v4`/`@v5`/`@v3`), mesmo padrão já usado em `ci.yml` (não por SHA — o documento original aceita qualquer uma das duas, e manter os dois workflows no mesmo estilo evita inconsistência). `concurrency` com `cancel-in-progress: false` — um deploy em andamento nunca é cancelado por um push seguinte, só a fila de pendentes.
**Consequência:** ainda falta o usuário trocar **Settings → Pages → Source** para "GitHub Actions" no repositório (só dá pra fazer pela UI do GitHub); até lá, o workflow pode até rodar mas o Pages não vai servir o resultado.

## Polimento (6.3): Lighthouse local via Chromium do Playwright; CLS real encontrado e corrigido no Tetris

**Contexto:** a 6.1 tinha deixado o Lighthouse local sem rodar (Chrome headless com timeouts de protocolo). Não há Chrome/Chromium instalado no ambiente (WSL); existe, porém, o Chromium que o Playwright já baixa para seu próprio cache (`~/.cache/ms-playwright/chromium-*/chrome-linux64/chrome`).
**Decisão:** apontar `CHROME_PATH` para esse binário e rodar `npx lighthouse` com `--chrome-flags="--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage --user-data-dir=<dir fixo>"` contra o build estático servido por `npx serve out` (sem a flag `-s`/SPA — com `-s`, o `serve` reescreve toda rota para `index.html`, fazendo `/pt/` e `/en/` carregarem sempre a página-raiz do seletor de idioma, que então entra num loop de redirecionamento cliente entre os dois; isso gerava os `NO_FCP` da primeira tentativa e não tem nada a ver com o site em produção, só com o flag errado do servidor de teste).
Com o ambiente de teste corrigido, o Lighthouse (mobile, as 3 rotas) revelou um problema real: CLS 0,409 (muito acima do limite "bom" de 0,1), 100% atribuído ao `<canvas>` do Tetris no Hero (`TetrisCanvas.tsx`) — ele nasce sem tamanho (300×150 padrão do elemento) e só ganha `width`/`height` via `ResizeObserver` depois da primeira pintura, então a página pinta uma vez pequena e salta pro tamanho final.

Primeira tentativa de correção (revertida): fixar a caixa CSS do canvas em `size-full` + `object-fit: contain`, com `width={BOARD_WIDTH} height={BOARD_HEIGHT}` (proporção 1:2) como atributos HTML desde o marcado estático. Resolveu o CLS (foi a 0), mas criou um bug visual novo, só percebido depois de publicado e reportado pelo usuário: `object-fit` é aceito pelo `getComputedStyle` em `<canvas>`, mas o Chromium **não aplica** o contido visualmente nesse elemento — o canvas ficava esticado para 100% de largura/altura do contêiner (confirmado inspecionando `getBoundingClientRect()` via Playwright: media 1400×900 em vez do tamanho contido), distorcendo o tabuleiro pela largura inteira do Hero.
**Decisão final:** abandonar `object-fit` em `<canvas>` — não é confiável para esse elemento. A caixa do canvas agora usa só propriedades que realmente afetam layout de qualquer elemento: `aspect-[1/2]` (mesma proporção BOARD_WIDTH:BOARD_HEIGHT) combinado com `w-[min(100cqw,50cqh)]`, dentro de um contêiner pai com `[container-type:size]` — unidades de *container query* (`cqw`/`cqh`), suportadas nos navegadores-alvo do projeto desde 2023. Isso replica em CSS puro exatamente a mesma conta de "contain-fit" que o `resize()` em JS já fazia (largura limitada pela largura do contêiner OU pela altura/2, o que for menor), sem precisar medir nada em JS para o primeiro paint — então não há CLS. O `flex items-center justify-center` que centralizava o canvas (removido na primeira tentativa, por engano) voltou, já que a caixa do canvas não preenche mais o contêiner inteiro. `resize()` continua calculando `cellSize` (clampado entre `MIN_CELL_SIZE`/`MAX_CELL_SIZE`) e setando `canvas.width`/`canvas.height`, mas agora isso afeta só a resolução do raster (nitidez por `devicePixelRatio`), nunca a caixa CSS — então não pode mais causar layout shift. Mantido o `useIsomorphicLayoutEffect` do setup (cai para `useEffect` no SSR) — mais por rigor do que pela causa do CLS original, que era de CSS/markup.
**Resultado:** CLS 0 confirmado de novo após a correção; Performance mobile 93–97, Acessibilidade/Boas práticas/SEO 100/100/100 nas 3 rotas (pt/en/es). O LCP (~2,3–2,9 s) e a variação de Performance entre execuções provavelmente refletem o ambiente local (Chromium via software rendering/swiftshader dentro do WSL2, sem GPU real, competindo por CPU com o host Windows) mais do que a infraestrutura real do GitHub Pages — não dá pra confirmar isso sem rodar contra o domínio publicado (Fase 7).
**Consequência:** `object-fit`/`object-contain` ficam descartados como técnica para `<canvas>` neste projeto — qualquer sizing responsivo futuro do canvas deve usar `aspect-ratio` + container queries (ou JS), nunca `object-fit`. Pastas `C:\Users\...\lighthouse.*` criadas por engano pelo próprio Lighthouse dentro do repositório durante os testes (bug de path do Windows/WSL) foram removidas — não fazem parte do projeto.

## SEO (6.2): imagem de Open Graph sem carregar a fonte da marca

**Contexto:** `next/og`'s `ImageResponse` (usado em `opengraph-image.tsx`) só aceita fontes em TTF/OTF — a API de fontes do Google serve WOFF2 por padrão para qualquer user-agent moderno; o "truque" usual pra conseguir um TTF de lá é mandar um user-agent de navegador antigo, um comportamento não documentado oficialmente e que pode mudar sem aviso.
**Decisão:** a imagem gerada usa a fonte padrão do Satori (não IBM Plex Mono/Inter), carregando identidade visual só por cor (`--bg`, `--accent`, `--fg`, `--muted-fg`) e peso de fonte, não pela tipografia exata. Verificado visualmente nos 3 idiomas (pt/en/es, incluindo acentos) — legível e com bom contraste.
**Consequência:** se o usuário quiser a tipografia da marca na imagem depois, dá pra buscar o TTF de um user-agent antigo (frágil) ou comitar o arquivo de fonte no repositório (mais robusto, build sem depender de rede) — não feito agora por ser complexidade desproporcional ao pedido original ("Open Graph com imagem por idioma").

## SEO (6.2): `twitter-image` não precisou de arquivo próprio

**Contexto:** a seção 6 pedia Open Graph "com imagem por idioma"; Twitter Card de imagem grande (`summary_large_image`) normalmente precisa do seu próprio arquivo (`twitter-image.tsx`).
**Decisão:** só `opengraph-image.tsx` foi criado. O Next.js usa automaticamente o Open Graph image como `twitter:image` quando não há um `twitter-image` próprio — confirmado no HTML gerado pelo build (`twitter:image` aponta pra mesma URL de `og:image`). `twitter.card: "summary_large_image"` em `generateMetadata` (`[locale]/layout.tsx`) é o único ajuste necessário pra sair do card pequeno padrão.
**Consequência:** uma imagem a menos pra gerar/manter; se um dia a Twitter Card precisar de um recorte/texto diferente do Open Graph, aí sim vale criar `twitter-image.tsx` separado.

## SEO (6.1): favicon gerado por código em vez de esperar a imagem de perfil

**Contexto:** o site não tinha nenhum favicon; a imagem de perfil (seção 16, pergunta 6 do documento original) continua `TODO(wellinton)` em `content/_todo.md`, sem previsão.
**Decisão:** `src/app/icon.tsx` usa `ImageResponse` (`next/og`) para gerar um ícone 32x32 em código — fundo `--bg` escuro, "W" em `--accent` — em vez de esperar a foto ou inventar uma logo. Fica num arquivo na raiz de `src/app/` (fora de `(root)/` e `[locale]/`) porque o projeto tem duas raízes de layout independentes (ADR "i18n sem middleware") e um `icon.tsx` ali se aplica às duas.
**Consequência:** favicon final e funcional hoje; se/quando a imagem de perfil for confirmada, trocar por algo baseado nela é uma mudança isolada neste arquivo, sem efeito em outro lugar.

## SEO (6.1): `siteUrl` centralizado em `content/links.ts`, não mais hardcoded em `sitemap.ts`

**Contexto:** `sitemap.ts` já tinha `https://wellintoncamboim.github.io` hardcoded; a Fase 6 precisa do mesmo valor em `robots.ts` e no `metadataBase` do layout (para resolver canonical e, na 6.2, a imagem de Open Graph).
**Decisão:** o valor passa a viver em `src/content/links.ts` (`siteUrl`), ao lado dos outros links do site; os três consumidores importam de lá.
**Consequência:** nenhuma, é só remoção de duplicação antes que ela se espalhasse para um terceiro/quarto arquivo.

## Menu mobile do Header: dropdown de disclosure, não um drawer tela-cheia

**Contexto:** uma auditoria de usabilidade encontrou que a `<nav>` do Header (`hidden ... sm:flex`) não tinha nenhum substituto no mobile — abaixo do breakpoint `sm`, não havia forma de navegar entre seções pelo cabeçalho.
**Decisão:** `MobileNav.tsx` abre um painel simples (`<nav>` com uma lista de links) logo abaixo do `<header>` (que já é `fixed`, então serve de contexto de posicionamento para o `absolute inset-x-0 top-full` do painel, sem precisar de wrapper extra) — não um drawer tela-cheia com overlay/trava de scroll. É o padrão ARIA "Disclosure" (botão com `aria-expanded`/`aria-controls` revelando conteúdo adjacente), não um widget de menu completo (`role="menu"`/`menuitem`) — semântica HTML nativa (`nav > ul > li > a`) é suficiente e mais robusta aqui do que recriar os papéis/teclado de um menu ARIA para uma lista de 8 links. Fecha ao clicar fora (`pointerdown` fora do contêiner), com Esc, ou ao clicar num link. A lista de seções foi extraída para `src/components/layout/nav-items.ts` e reaproveitada pelo nav desktop do próprio `Header.tsx`, para não ter a mesma lista de 8 itens duplicada em dois lugares.
**Consequência:** não há foco preso (focus trap) nem bloqueio de scroll do body — aceitável para um painel pequeno que não cobre a tela toda; se o menu crescer a ponto de precisar de um drawer real, essas duas faltas precisam ser revisitadas.

## Tetris (5.5): um único botão de pausar/retomar, com `prefers-reduced-motion` como seu valor inicial — não um terceiro estado separado

**Contexto:** a seção 8 pede três coisas que parecem independentes: botão de pausar/retomar, quadro estático sob `prefers-reduced-motion: reduce`, e pausa quando a aba está oculta ou o canvas sai da viewport (esta última já parcialmente coberta pelo `IntersectionObserver` da 5.4, só por desempenho). Tratar cada uma como um estado booleano próprio (`manualPaused`, `reducedMotionPaused`, `tabHidden`, `offscreen`) multiplicaria as combinações a considerar (ex.: o que mostrar se o usuário clicou "play" mas a aba está oculta?).
**Decisão:** só existe **um** botão/estado visível ao usuário (`paused`, em `TetrisCanvas.tsx`), calculado como `manualOverride ?? prefersReducedMotion` — ou seja, `prefers-reduced-motion` só define o valor **inicial** do botão (começa "pausado, com play disponível"), e a partir do primeiro clique o controle do usuário manda, sem voltar a checar a media query depois. `tabHidden` e `offscreen` continuam exatamente como antes (5.4): motivos de pausa **automáticos**, independentes do botão, combinados por "E" (só roda se nada estiver pausando) — nunca reescrevem o estado do botão, então voltar à viewport ou à aba nunca desfaz uma pausa manual.
**Consequência:** `prefersReducedMotion` é lido via `useSyncExternalStore` (novo hook `usePrefersReducedMotion`, mesma família do `useHydrated` já existente) só para esse valor inicial — se o sistema operacional mudar a preferência enquanto a página já está aberta, isso não pausa nem retoma nada sozinho (só o clique do usuário muda o estado dali em diante). Suficiente para o que a seção 8 pede; reagir a uma mudança ao vivo da preferência do SO não foi pedido e adicionaria um quarto caso a combinar sem necessidade clara.

## Tetris (5.5): quadro estático do `prefers-reduced-motion` vem de simular o jogo de verdade, não de um tabuleiro desenhado à mão

**Contexto:** a seção 8 pede um "quadro estático bonito (tabuleiro semipreenchido)" quando `prefers-reduced-motion: reduce` está ativo, em vez de animar.
**Decisão:** em vez de hardcodar um tabuleiro de exemplo, `TetrisCanvas.tsx` roda `session.ts`'s `step()` de forma síncrona (sem temporizador, sem desenhar) umas poucas centenas de vezes assim que monta, antes do primeiro `draw()` — ou seja, deixa o próprio bot jogar algumas peças "no escuro" e só então desenha o resultado como o quadro estático. Se a pilha "dissolver" durante essa simulação, `resetAfterDissolve` é chamado normalmente (sem animação, é só parte do pré-cálculo).
**Consequência:** o quadro estático é sempre um estado de jogo real e válido (não um desenho que poderia divergir das regras do engine), ao custo de ~600 chamadas síncronas de `step()` no `mount` — desprezível (lógica pura, sem DOM) comparado a desenhar um frame de canvas.

## `useHydrated` extraído de `ThemeToggle.tsx` para `src/lib/hooks/useHydrated.ts`

**Contexto:** o botão de pausar/retomar do Tetris (5.5) precisa da mesma guarda de hidratação que o `ThemeToggle` já usava (evitar renderizar um ícone/estado client-only — aqui, se `prefers-reduced-motion` está ativo — antes do React confirmar que o cliente já hidratou), documentada em "Revisão: `ThemeToggle` precisa de guarda 'mounted'" (mais abaixo). Duplicar esse hook de 8 linhas uma segunda vez cruzaria de "três linhas parecidas" para "um utilitário inteiro copiado".
**Decisão:** extrair para `src/lib/hooks/useHydrated.ts` (primeiro arquivo dessa pasta) e importar dos dois componentes; comportamento idêntico, nenhuma mudança de lógica.
**Consequência:** qualquer componente futuro que precise da mesma guarda já tem onde importar, sem reabrir essa decisão.

## Tetris (5.4): painel vira pano de fundo do Hero, não um bloco separado depois dele

**Contexto:** a primeira versão colocava o canvas como um elemento centralizado abaixo dos links do Hero — na prática, lido como "intro → jogo → resto do currículo", quebrando o Hero em duas cenas em vez de uma. Feedback do usuário após ver em funcionamento: "não ficou muito bom para finalidade de portfólio"; pediu para o Tetris ficar mais discreto, atrás do conteúdo.
**Decisão:** `TetrisCanvas` passou a ser _contain-fit_ (ajusta `cellSize` pelo menor entre largura/altura do contêiner, em vez de só largura) e o Hero o posiciona em `absolute inset-0`, atrás do texto (`z-0` vs. `z-10`), com opacidade fixa (`opacity-15`) em vez de uma cor por tema: o contraste do texto do Hero depende só de `--fg` sobre `--bg` (inalterado), e a diferença entre `--bg` e `--surface` (cor de fundo que o canvas pinta) é pequena nos dois temas — 15% de opacidade não desloca esse contraste o suficiente para precisar de um valor por tema. Não ficou "seguindo a rolagem" por todas as seções (ver próxima entrada) — só ocupa o Hero inteiro, não a página inteira.
**Consequência:** o Hero volta a ser uma cena só; o Tetris ainda é visível e anima por trás do texto em ambos os temas e larguras (verificado via Playwright headless). `MAX_CELL_SIZE` subiu de 26 para 48 para o tabuleiro poder preencher um Hero `min-h-screen` em telas grandes.

## Tetris (5.4): escopo dividido entre `IntersectionObserver` (desempenho) e pausa acessível (5.5)

**Contexto:** o item 5.4 do roadmap lista "IntersectionObserver" entre suas entregas, mas a seção 8 do documento original também exige um botão visível de pausar/retomar (WCAG 2.2.2), `prefers-reduced-motion` e pausa quando a aba está oculta — e o roadmap já reserva exatamente esses três itens para 5.5, separadamente. Usar o `IntersectionObserver` só faz sentido em 5.4 se ele já tiver algum efeito percebido.
**Decisão:** em `TetrisCanvas.tsx`, o `IntersectionObserver` liga/desliga o loop `requestAnimationFrame` só por desempenho (não desenhar/computar fora da viewport) — sem rótulo, sem interação do usuário, sem relação ainda com `prefers-reduced-motion`. O botão de pausar/retomar com `aria-pressed`, `document.hidden` e `prefers-reduced-motion` (que precisa compor corretamente com essa pausa automática — ex.: não retomar sozinho se o usuário pausou manualmente) ficam inteiramente para 5.5.
**Consequência:** até 5.5, a única forma de pausar o Tetris é rolar a página para fora da viewport; não há ainda controle acessível nem o quadro estático exigido por "prefers-reduced-motion: reduce" — aceitável como estado intermediário de uma sub-fase já planejada para ser seguida imediatamente pela 5.5, não como entrega final.

## Tetris (5.4): animação por passos discretos do próprio engine, sem motor de interpolação novo

**Contexto:** a seção 8 pede que a peça escolhida pelo bot se mova até o destino "em ritmo humano, não teleporte" (deslocamento e rotação suaves). O `engine.ts` (5.1) só expõe ações discretas de uma célula por vez (`rotateClockwise`, `moveHorizontal`, `softDrop`), sem suporte a posições fracionárias nem a interpolar a forma de uma peça girando.
**Decisão:** um novo módulo puro, `src/lib/tetris/session.ts` (testado em `session.test.ts`, mesmo padrão de `engine.test.ts`/`ai.test.ts`), avança a peça ativa em exatamente uma ação por _tick_: primeiro gira até a rotação escolhida pelo bot (sempre na posição de spawn, antes de qualquer deslocamento), depois desliza uma coluna por vez até a coluna alvo, depois cai uma linha por vez — reaproveitando os mesmos primitivos puros do engine que um jogador usaria, em vez de um sistema de interpolação contínua separado. `TetrisCanvas.tsx` só chama `step()` a cada ~90 ms (ritmo humano) e desenha a cada frame.
**Consequência:** a "suavidade" vem da cadência de passos discretos, não de sub-pixels — é perceptivelmente "andando até lá", não teleporte, com uma única fonte de verdade sobre posição/colisão (o próprio engine). Esse novo módulo não aparece na árvore de arquitetura original da seção 8 (que previa toda essa lógica dentro de `TetrisCanvas.tsx`), mas segue o mesmo princípo já estabelecido em 5.1–5.3 ("separar lógica e render", tudo que não toca DOM é puro e testável).

## Tetris (5.4): gatilho de "dissolver" não reaproveita `isGameOver` do engine.ts

**Contexto:** `isGameOver` (definido em 5.1, nunca usado operacionalmente até agora) só verifica as linhas `SPAWN_Y` e `SPAWN_Y + 1`. Mas as `BASE_SHAPES` de quase todas as peças (T, S, Z, J, L, O) ocupam células até `y: 2` dentro da caixa 4x4 do spawn — ou seja, uma peça pode nascer sobrepondo blocos na linha 2 sem que `isGameOver` detecte nada, e sem que isso jamais tivesse sido exercitado por um teste.
**Decisão:** `session.ts` define seu próprio `spawnZoneBlocked`, cobrindo as linhas 0, 1 **e** 2 (a mais profunda que qualquer peça pode alcançar a partir do spawn), em vez de chamar `isGameOver`. É esse `spawnZoneBlocked`, não `isGameOver`, que decide quando a pilha "ficou alta demais" e deve dissolver em vez de travar.
**Consequência:** `isGameOver` continua exportado por `engine.ts` sem alteração (nenhum teste existente depende dele); se um uso futuro genuinamente precisar da semântica "linhas 0–1", ela continua disponível, só não é mais a usada para decidir o reset do Tetris.

## Revisão: `ThemeToggle` precisa de guarda "mounted" (corrige suposição da ADR anterior)

**Contexto:** a ADR "Tema sem flash via `next-themes` + `resolvedTheme`" (mais abaixo) assumia que `resolvedTheme` fica `undefined` na primeira renderização do cliente, igual ao servidor, evitando mismatch sem precisar de estado "mounted". Investigando um aviso real no console (`Encountered a script tag while rendering a React component`, em `ThemeProvider.tsx`), lemos o código-fonte do `next-themes@0.4.6` (`node_modules/next-themes/dist/index.mjs`) e confirmamos que essa suposição está errada: no bundle do cliente, `resolvedTheme` já é calculado de forma síncrona na primeira renderização (via `matchMedia`/`localStorage`), diferente do servidor (sempre `undefined`). Isso causava um mismatch real de conteúdo (ícone ausente no servidor vs. presente no cliente) e de `aria-pressed` (`false` no servidor vs. possivelmente `true` no cliente) — não era só cosmético.
**Decisão:** `ThemeToggle` (`src/components/theme/ThemeToggle.tsx`) volta a ter uma guarda de "já hidratou no cliente" — mas não como `useState(false)` + `useEffect(() => setMounted(true), [])`: essa primeira tentativa disparou exatamente a regra de lint que a ADR anterior já tinha evitado (`react-hooks/set-state-in-effect`: "Calling setState synchronously within an effect can trigger cascading renders"). Em vez disso, um hook `useHydrated()` baseado em `useSyncExternalStore` (`getServerSnapshot` retorna `false`, `getSnapshot` do cliente retorna `true`) — o padrão do próprio React para esse caso, que não passa por `setState` dentro de efeito. Renderiza sem ícone e com `aria-pressed="false"` até hidratar; só depois usa `resolvedTheme` normalmente.
**Consequência:** `npm run lint` limpo com essa versão (confirmado — a tentativa com `useEffect` falhou o lint antes desta). Essa correção também eliminou o aviso do `<script>` do `next-themes` no console (ver próxima entrada) — os dois sintomas tinham a mesma causa raiz.

## `next-themes` + React 19: o aviso do `<script>` era consequência do mismatch do `ThemeToggle`, não um bug isolado

**Contexto:** investigando o aviso `Encountered a script tag while rendering a React component` em `ThemeProvider.tsx`, encontramos que `next-themes@0.4.6` injeta incondicionalmente um `<script>` (filho React comum) dentro do `ThemeProvider`, sem gate por `typeof window`, e que o React 19 avisa quando "encontra" esse `<script>` numa renderização client-side (não numa hidratação bem-sucedida). Isso é real e documentado como problema aberto no repositório da lib (issues #385 e #387 no GitHub, sem release que corrija, sem prop para desligar o script) — mas **só se manifesta quando a árvore precisa ser "regenerada no cliente"** por algum mismatch de hidratação real em outro lugar da mesma árvore.
**Decisão:** depois de corrigir o mismatch real do `ThemeToggle` (ADR anterior), testamos (Playwright, 3 recargas, inclusive com `prefers-color-scheme: dark` — o cenário que antes causava o mismatch) e **o aviso do `<script>` não aparece mais**, em nenhum dos 3 idiomas. Não era um bug isolado e inevitável do `next-themes`: era a hidratação falhando por causa do `ThemeToggle` e, como efeito colateral, forçando o React a reprocessar (e avisar sobre) o `<script>` do `next-themes` também. Corrigida a causa raiz, não há mais necessidade de adotar fork de terceiro nem de reimplementar o provider.
**Consequência:** se esse aviso reaparecer no futuro, o primeiro suspeito deve ser um mismatch de hidratação real em algum componente dentro de `ThemeProvider` (não o `next-themes` em si) — foi exatamente esse o padrão aqui.

## Estudos de caso (Fase 4.1): 4 casos aprovados, sem estatísticas novas

**Contexto:** `content/_todo.md` tinha em aberto se os 4 estudos de caso do trabalho na OKTO Payments poderiam ser publicados, e se os números da seção 10.4 do documento original ("200+ PRs", "26 meses sem lacunas") poderiam ser exibidos — nenhum dos dois com fonte confirmada nos currículos de referência.
**Decisão:** publicar os 4 estudos de caso em nível conceitual (contexto → desafio → o que foi feito → resultado/aprendizado) em `src/content/case-studies.ts`, seguindo as regras de confidencialidade do `CLAUDE.md`. Não incluir "200+ PRs" nem "26 meses sem lacunas"; os únicos números usados são os já publicados em `src/content/profile.ts` (8 operadores, 15 códigos de inconsistência de ledger).
**Consequência:** `content/_todo.md` marca os dois itens como resolvidos. As próximas sub-fases da Fase 4 (projetos, skills, "como trabalho", roadmap) seguem a mesma regra: sem estatísticas sem fonte confirmada.

## Conteúdo de Experiência a partir dos currículos de referência

**Contexto:** a seção 10.2 do documento original tinha `TODO(wellinton)` sobre o período na OKTO Payments ("atual"?) e a conclusão de Sistemas de Informação. O usuário indicou 3 currículos (`Curriculo_Wellinton_Camboim_{Engenheiro_FullStack,Engenheiro_Produto_IA,Desenvolvedor_FullStack}`) como fonte, além de um `Levantamento_Projetos_Okto_U4C.md` que se mostrou ser um relatório de auditoria de segurança real (nomes de clientes, vulnerabilidades, nomes de colegas) — incompatível com a seção 2 de confidencialidade.
**Decisão:** usei os 3 currículos como fonte do texto de Experiência (`src/content/profile.ts`); o levantamento de segurança foi tratado só como contexto de fundo, sem nenhum fato específico citado. OKTO Payments ficou "desde ago/2024" sem data-fim (confirmado pelo usuário, apesar dos currículos citarem "ago/2024 – out/2026"); Sistemas de Informação ficou "Bacharelado... (2017–2020)" sem entrar na divergência entre currículos.
**Consequência:** `content/_todo.md` documenta os itens ainda sem fonte confirmada (rótulos de skills, certificações, números da seção 10.4) para as próximas fases.

## Ícones de marca: `simple-icons` para GitHub, SVG local para LinkedIn

**Contexto:** `lucide-react` não inclui mais logos de marca (GitHub/LinkedIn foram removidos da lib). `simple-icons` também não tem mais o ícone do LinkedIn (provável remoção por pedido de marca).
**Decisão:** GitHub via `simple-icons` (`siGithub`); LinkedIn via SVG local (`src/components/icons/linkedin.ts`) — exatamente a alternativa que a seção 4 do documento já previa ("simple-icons ou SVGs locais").
**Consequência:** `BrandIcon` (`src/components/icons/BrandIcon.tsx`) renderiza qualquer `{ path }` como SVG inline com `currentColor`, então os dois ícones usam o mesmo componente.

## Idioma/tema só no Header, não duplicados no Hero

**Contexto:** a seção 9 lista "botões de idioma e tema" como parte do Hero, mas também existe um Header fixo com âncoras.
**Decisão:** `LocaleSwitcher` e `ThemeToggle` ficam só no `Header` (fixo, visível em toda a página), não duplicados no Hero — mais simples e sem redundância.
**Consequência:** nenhuma — é só uma escolha de layout, registrada para não ser revertida sem querer depois.

## i18n sem middleware, com dois layouts raiz (`[locale]` e `(root)`)

**Contexto:** `output: export` não suporta middleware/rewrites/headers em runtime (confirmado na documentação atual do Next.js e do next-intl), então a negociação de idioma do `next-intl` baseada em middleware não funciona aqui. Ao mesmo tempo, a seção 5 exige uma página `/` que escolhe o idioma (preferência salva → `navigator.language` → `pt`) e redireciona, com `<html lang>` correto por rota.
**Decisão:** `[locale]` fica no nível raiz de `src/app` e seu `layout.tsx` é o próprio "root layout" (com `<html lang={locale}>`), usando `generateStaticParams` para gerar `/pt/`, `/en/`, `/es/` em build time (`setRequestLocale` em layout e página para habilitar renderização estática). A rota `/` vive num route group `(root)` irmão, com seu **próprio** root layout independente (`<html lang="pt">` + `<meta http-equiv="refresh" content="0; url=/pt/">` como fallback sem JS) — padrão oficial do Next.js de "multiple root layouts". Sem `middleware.ts`/`proxy.ts`.
**Consequência:** `globals.css` é importado duas vezes (uma por árvore de layout raiz); é o custo aceito do padrão de múltiplos root layouts. `trailingSlash: true` no `next.config.ts` para o GitHub Pages servir `/pt/index.html` corretamente como diretório.

## Tema sem flash via `next-themes` + `resolvedTheme`

**Contexto:** seção 6 exige alternância de tema sem flash e sem `useState`/`useEffect` que dispare "cascading renders" (regra de lint `react-hooks/set-state-in-effect`, nova no ESLint do React 19/Next 16).
**Decisão:** `ThemeToggle` não usa estado local de "mounted"; em vez disso confia em `resolvedTheme` ser `undefined` no servidor/antes da hidratação e só renderiza o ícone quando definido. O script inline que o `next-themes` injeta (via `attribute="data-theme"`) roda antes da primeira pintura, evitando o flash.
**Consequência:** nenhum estado extra no componente; o botão existe desde o SSR, só o ícone aparece depois da hidratação.

## README bilíngue; CLAUDE.md só em português

**Contexto:** `README.md` é a porta de entrada pública do repositório (público-alvo inclui recrutadores/líderes técnicos internacionais); `CLAUDE.md` é convenção interna de desenvolvimento, não vitrine pública.
**Decisão:** `README.md` em inglês (principal) + `README.pt-BR.md` em português, com link cruzado entre os dois. `CLAUDE.md` permanece só em português.
**Consequência:** mudanças no README precisam ser replicadas nos dois arquivos.

## AGENTS.md fora do versionamento

**Contexto:** o Next.js gera automaticamente um `AGENTS.md` (instruções genéricas do framework para agentes de IA) a cada `next dev`/`next build`; não tem conteúdo específico deste projeto.
**Decisão:** ignorar no git (`.gitignore`) em vez de comitar.
**Consequência:** o arquivo continua sendo gerado localmente, mas não aparece no repositório público nem gera diffs a cada atualização do Next.js.

## npm no lugar de pnpm

**Contexto:** o documento de escopo original pedia pnpm. O ambiente de desenvolvimento não tinha pnpm instalado (só npm).
**Decisão:** usar npm como gerenciador de pacotes.
**Consequência:** comandos no `README.md` e no workflow de deploy usam `npm ci`/`npm run`, não `pnpm`.

## Direção visual: "Terminal Noturno"

**Contexto:** o documento pedia duas direções visuais (paleta + tipografia) para escolha.
**Decisão:** dark-first, retrô/pixel discreto. Fundo `#0b0e11`, texto `#e6e8eb`, acento `#39d2c0`; títulos em IBM Plex Mono, corpo em Inter.
**Consequência:** tokens em `src/app/globals.css`; tema claro definido como contraparte (`:root[data-theme="light"]`), mantendo contraste AA nos dois.

## Citação de "OKTO Payments"

**Contexto:** regra de confidencialidade do projeto exige anonimizar estudos de caso e não expor vínculo empregatício atual sem confirmação.
**Decisão:** citar "OKTO Payments" como empregador na experiência profissional e nos estudos de caso, sem afirmar que é o vínculo atual (evitar "→ atual").
**Consequência:** texto de experiência usa data de início sem data-fim nem palavra "atual".

## Demo do catalog-ai: mídia estática

**Contexto:** GitHub Pages só serve conteúdo estático; catalog-ai é uma aplicação full-stack com backend.
**Decisão:** usar apenas screenshots/GIF do repositório (`docs/screenshots`), sem instância ao vivo.
**Consequência:** sem custo/manutenção de infraestrutura externa para a demo.

## Skills (4.3): sem distinção Aplicado/Em estudo

**Contexto:** a seção 12.2 do documento original previa rótulos "Aplicado"/"Em estudo" por skill de segundo nível, mas várias delas não têm evidência direta nos 3 currículos de referência nem no código público (`catalog-ai`), e o usuário pediu para remover essa distinção da seção.
**Decisão:** `src/content/skills.ts` não guarda nível por skill; `Skills.tsx` renderiza o segundo nível como chips simples (mesmo padrão visual do nível de destaque), sem rótulo de maturidade.
**Consequência:** a pendência de confirmar rótulo por skill (`content/_todo.md`) deixa de existir — não há mais rótulo de maturidade a confirmar nesta seção.

## Skills (4.3): sem campo `icon` no modelo de dados

**Contexto:** o documento original sugeria `{ id, category, tier, level, icon }` como modelo de dados para `content/skills.ts`.
**Decisão:** omitir `icon`. Mapear um ícone confiável (via `simple-icons`/`lucide-react`) para cada uma das ~65 skills listadas não é algo que dê para confirmar sem risco de usar o ícone errado, e não há pedido explícito nem critério de aceite que exija ícone por skill nesta sub-fase.
**Consequência:** o destaque visual por categoria vem só de cor (ver próxima entrada) e tipografia; ícones por skill podem ser adicionados depois, sem mudar a estrutura de dados.

## Skills (4.3): cor por categoria de destaque

**Contexto:** seção 11 do documento original pede "uma cor de destaque por categoria de skill, sempre derivadas dos tokens do tema" — o mesmo princípio vale para as categorias do Tetris (Fase 5), ainda não implementado.
**Decisão:** 4 novas variáveis CSS em `src/app/globals.css` (`--skill-frontend`, `--skill-backend`, `--skill-cloud`, `--skill-domain`), redefinidas no tema claro, todas validadas em ≥ 4.5:1 de contraste contra `--bg` e `--surface` nos dois temas. A categoria "IA aplicada" reaproveita `--accent` (mesma cor de destaque do site), em vez de uma quinta cor nova — reforça a narrativa de foco em IA aplicada.
**Consequência:** essas variáveis ficam disponíveis para reuso nas peças do Tetris por categoria de skill (Fase 5), sem precisar de um novo sistema de cores nessa fase futura.

## Stack do argus-ai corrigido a partir do repositório público

**Contexto:** o campo `stack` do `argus-ai` em `src/content/projects.ts` tinha só "Python" desde a Fase 4.2, seguindo o documento original. O repositório é público; conferindo `pyproject.toml` e o README (`github.com/WellintonCamboim/argus-ai`), as dependências reais incluem `anthropic`, `langchain` e `langchain-openai`.
**Decisão:** atualizar `stack` para "Python, LangChain, Anthropic SDK" nas 3 línguas — mesma fonte verificável (repositório público) já usada para o conteúdo do `catalog-ai`, não é conteúdo inventado.
**Consequência:** este projeto é, hoje, a única evidência direta e confirmada de uso de LangChain (o `catalog-ai` declara explicitamente o contrário no próprio README).

## Tetris (5.3): peças reaproveitam as 5 cores de categoria do Skills, não as 7 da seção 8

**Contexto:** a seção 8 do documento original pede uma cor por "categoria de skill" nas peças do Tetris, listando 7 categorias (front-end, back-end, dados, cloud, IA, segurança, mobile). Mas a ADR "Skills (4.3): cor por categoria de destaque" já tinha decidido, de propósito, só 5 variáveis CSS (`--skill-frontend`, `--skill-backend`, `--skill-cloud`, `--skill-domain`, mais `--accent` para IA) e já registrou a consequência de que "essas variáveis ficam disponíveis para reuso nas peças do Tetris... sem precisar de um novo sistema de cores nessa fase futura". As 7 categorias do brief também não correspondem 1:1 às 5 categorias de destaque do `skills.ts` atual (frontend, backend, cloud, ai, domain) — "segurança" e "mobile" não existem como categoria separada hoje, e "domínio" (PIX/tesouraria) não está na lista de 7 do brief.
**Decisão:** `PIECE_CATEGORY` em `src/lib/tetris/renderer.ts` mapeia os 7 tipos de peça (`I,O,T,S,Z,J,L`) para as 5 categorias já existentes: `I`/`L` → frontend, `O`/`J` → backend (as duas maiores categorias do Skills, com 2 peças cada), `T` → cloud, `S` → ai, `Z` → domain. É um mapeamento arbitrário (não há correspondência "correta" entre forma da peça e categoria), mas resolve a pendência sem introduzir paleta nova.
**Consequência:** o painel do Tetris usa exatamente a mesma paleta por categoria que a seção Skills, reforçando a mesma linguagem visual em vez de um sistema de cores paralelo. Se o usuário quiser 7 cores distintas no futuro, isso exige 2 novas variáveis CSS (`--skill-security`, `--skill-mobile`) validadas em contraste AA nos dois temas — não implementado agora por não ter sido pedido explicitamente.

## Tetris (5.3): `renderer.ts` sem testes de desenho real (sem canvas no ambiente de teste)

**Contexto:** a seção 8 só pede testes Vitest explícitos para `engine.ts` e `ai.ts` ("sem canvas"); o projeto não tem `jsdom`/polyfill de `CanvasRenderingContext2D` instalado, e adicionar um só para testar chamadas de desenho (`fillRect`, `arcTo`...) não traria garantia real sobre o resultado visual.
**Decisão:** só a lógica pura de `renderer.ts` tem teste (`renderer.test.ts`): o mapeamento peça→categoria (`PIECE_CATEGORY`/`pieceColorVar`) e a geometria de célula (`cellRect`). As funções que recebem `CanvasRenderingContext2D` (`drawBoard`, `drawActivePiece`, `renderFrame`) ficam sem teste automatizado, cobertas por verificação visual manual na integração com o Hero (Fase 5.4).
**Consequência:** `readTheme()` depende do DOM (`getComputedStyle`) e também não é testada via Vitest; qualquer regressão de cor por tema precisa ser verificada no navegador, não no CI.

## Tetris (5.2): bot heurístico busca por hard-drop virtual, sem simular o caminho

**Contexto:** a seção 8 do documento pede que o bot "simule todas as rotações e colunas, faça o hard drop virtual e pontue cada posição" com a heurística `score = -0.51·alturaAgregada + 0.76·linhasCompletas − 0.36·buracos − 0.18·irregularidade`. O `engine.ts` (5.1) não tem wall kicks e só valida posições já dadas — não existe uma função pronta para "toda coluna alcançável a partir do spawn".
**Decisão:** `findBestMove` em `src/lib/tetris/ai.ts` testa as 4 rotações em cada coluna candidata usando uma sonda em `y` bem acima do tabuleiro (`PROBE_Y = -BOARD_HEIGHT`) — nessa altura, `isValidPosition` só pode reprovar por limite horizontal (nunca por colisão com a pilha, já que toda célula cai em `y < 0`), então a sonda isola exatamente a legalidade de coluna/rotação. A partir daí, `hardDropPosition` simula a queda real. Isso aproxima "toda coluna alcançável", sem reimplementar movimento lateral turno a turno — consistente com a ADR de 5.1 (o bot já não depende de girar peças encostadas em paredes).
**Consequência:** empates de pontuação são resolvidos pela ordem de iteração (rotação 0→3, coluna da esquerda para a direita) — determinístico, mas arbitrário; não há preferência explícita por "coluna mais à esquerda" como regra de design, é só consequência da busca. `countHoles`/`scorePlacement` ficam exportados por serem úteis tanto para o `ai.test.ts` quanto para o futuro `renderer.ts`/depuração.

## Tetris (5.1): rotação sem wall kicks

**Contexto:** a seção 8 do documento pede "rotação" como uma das responsabilidades do `engine.ts`, sem exigir explicitamente o sistema SRS completo (com tabelas de wall kick). Implementar wall kicks corretos exigiria tabelas de offset por peça e por transição de rotação, sem ganho perceptível para um Tetris que só joga sozinho (o bot já simula todas as colunas e rotações possíveis antes de decidir, em vez de girar peças já posicionadas perto de paredes).
**Decisão:** `rotateClockwise` em `src/lib/tetris/engine.ts` gira a peça num box 4x4 e simplesmente rejeita a rotação se colidir (sem tentar deslocar a peça para "encaixar", como o SRS faz). Cada peça é representada por uma única forma-base por tipo, rotacionada programaticamente (fórmula de rotação 90° num box 4x4) em vez de 4 tabelas manuais por peça.
**Consequência:** perto das paredes, algumas rotações in-place podem ser rejeitadas onde o SRS real permitiria (via kick). Isso não afeta o bot (ele simula hard-drops a partir do spawn, não gira peças já encaixadas), nem os testes do `engine.ts`, que cobrem coordenadas explícitas em vez de depender de kicks.

## Fase 4.5 (roadmap de IA aplicada) removida do site

**Contexto:** a seção "Em evolução: IA aplicada" (`src/content/ai-roadmap.ts` + `AiRoadmap.tsx`) tinha sido implementada seguindo a seção 13 do documento original (5 itens com status Em andamento/Planejado/Em estudo), mas o usuário decidiu não ter esse item no site.
**Decisão:** remover a seção inteira — componente, conteúdo, âncora no Header e chaves de mensagens nos 3 idiomas.
**Consequência:** a Fase 4 termina em 4.4 ("Como trabalho"); a seção 13 do documento original não é mais usada como fonte de conteúdo do site.

## "Como trabalho" (4.4): sem o número de PRs de colegas na evidência de Colaboração

**Contexto:** a seção 12.3 do documento original lista "mais de 200 PRs de colegas integrados" como evidência do traço "Colaboração" — o mesmo número (sem fonte confirmada) que a ADR da Fase 4.1 já tinha decidido não publicar nos estudos de caso, pela mesma regra de não exibir estatística sem fonte confirmada.
**Decisão:** manter a evidência de "Colaboração" qualitativa (code review e pair programming com o time), sem o número "200+ PRs".
**Consequência:** `src/content/working-style.ts` não cita nenhuma estatística; se o número vier a ser confirmado, adicionar depois nas duas seções (estudos de caso e "Como trabalho") de uma vez.
