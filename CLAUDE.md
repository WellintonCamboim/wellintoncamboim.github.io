# CLAUDE.md

Convenções deste projeto para quem (humano ou IA) for trabalhar no código. O documento completo com o escopo do produto está fora do repositório; este arquivo cobre o que importa para codificar aqui.

## Stack

- Next.js (App Router) + React + TypeScript estrito.
- Tailwind CSS v4 (CSS-first, tokens em `src/app/globals.css` via `@theme inline`).
- `next-intl` para i18n (`/pt/`, `/en/`, `/es/`), sem middleware (incompatível com `output: export`); ver `docs/decisions.md` para a estrutura de rotas.
- `next-themes` para tema claro/escuro via atributo `data-theme`.
- Vitest para testes unitários; Playwright para smoke e2e (fases futuras).
- Gerenciador de pacotes: **npm** (decisão registrada em `docs/decisions.md`; o documento original pedia pnpm).
- Node: versão fixada em `.nvmrc`.

## Comandos

```bash
npm run dev          # desenvolvimento local
npm run build        # build de produção (output: export)
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm run test         # Vitest
npm run format       # Prettier --write
npm run format:check # Prettier --check
```

Antes de considerar uma fase concluída, `lint`, `typecheck`, `test` e `build` devem passar.

## Deploy

GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`), disparado em push na `main`. Site de usuário, publicado em `https://wellintoncamboim.github.io/`, sem `basePath`. `next.config.ts` usa `output: "export"` e `images.unoptimized: true`.

## Direção visual

"Terminal Noturno": dark-first, retrô/pixel discreto. Tokens principais em `src/app/globals.css`:

- `--bg` / `--surface` / `--fg` / `--muted-fg` / `--border` / `--accent` / `--accent-fg`, redefinidos em `:root[data-theme="light"]` para o tema claro.
- Tipografia: títulos em IBM Plex Mono (`--font-mono`), corpo em Inter (`--font-sans`), carregadas via `next/font/google` em `src/app/[locale]/layout.tsx`.
- Contraste mínimo AA nos dois temas; `color-scheme` respeitado para controles nativos.

## Regras de conteúdo e confidencialidade (obrigatórias)

Os estudos de caso vêm do trabalho do autor na **OKTO Payments** e precisam ser anonimizados.

**Pode citar:** "OKTO Payments" como empregador (sem afirmar se é o vínculo atual); a categoria do negócio (PSP para operadores de iGaming e entretenimento digital regulado na América Latina); tecnologias; o que foi construído; resultados genéricos.

**Não pode aparecer em nenhum lugar do site, do código ou dos commits:**

- nomes de clientes ou operadores;
- nomes internos de repositórios, serviços, domínios, clusters, tickets (ex.: `IB-438`) ou contas AWS;
- qualquer vulnerabilidade, achado de segurança, segredo, credencial ou detalhe de infraestrutura interna;
- dados pessoais reais de terceiros;
- telefone (usar apenas e-mail, LinkedIn e GitHub).

Estudos de caso seguem o formato **contexto → desafio → o que foi feito → resultado/aprendizado**, em nível conceitual.

## Conteúdo e i18n

- Nenhum texto hardcoded em componente — tudo vem de `messages/{pt,en,es}.json` ou `content/{locale}/...`. Única exceção: a página `/` (`src/app/(root)/page.tsx`), que roda antes de o idioma ser conhecido — usa a cópia fixa trilíngue de `src/content/language-chooser.ts`.
- Nada de conteúdo inventado: informação ainda não confirmada entra como `TODO(wellinton)` e é listada em `content/_todo.md`.
- pt-BR é o idioma-fonte; EN/ES são traduções (tom profissional, não literal).

## Workflow de contribuição

- Commits em Conventional Commits (`feat(hero): ...`, `fix(i18n): ...`).
- Fases pequenas, um ou mais commits por entrega.
- Decisões entre opções razoáveis registradas em `docs/decisions.md` (ADR curto).
