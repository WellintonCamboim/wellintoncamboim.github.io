# Decisões de arquitetura

ADRs curtos. Um bloco por decisão, mais recente no topo.

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

## "Como trabalho" (4.4): sem o número de PRs de colegas na evidência de Colaboração

**Contexto:** a seção 12.3 do documento original lista "mais de 200 PRs de colegas integrados" como evidência do traço "Colaboração" — o mesmo número (sem fonte confirmada) que a ADR da Fase 4.1 já tinha decidido não publicar nos estudos de caso, pela mesma regra de não exibir estatística sem fonte confirmada.
**Decisão:** manter a evidência de "Colaboração" qualitativa (code review e pair programming com o time), sem o número "200+ PRs".
**Consequência:** `src/content/working-style.ts` não cita nenhuma estatística; se o número vier a ser confirmado, adicionar depois nas duas seções (estudos de caso e "Como trabalho") de uma vez.
