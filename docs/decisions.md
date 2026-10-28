# Decisões de arquitetura

ADRs curtos. Um bloco por decisão, mais recente no topo.

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
