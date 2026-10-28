# camboim-dev

Portfólio pessoal de Wellinton Camboim — site estático e trilíngue (PT/EN/ES), construído com Next.js e publicado no GitHub Pages.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS v4, `next-intl` para i18n, `next-themes` para o tema claro/escuro, Vitest para testes. Veja `CLAUDE.md` para convenções detalhadas.

## Como rodar

Requer Node na versão fixada em `.nvmrc` (use `nvm use`, se disponível).

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Como testar

```bash
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm run test        # Vitest
npm run build       # build de produção (gera export estático em out/)
```

## Como publicar

O deploy é automático: todo push na branch `main` dispara o workflow `.github/workflows/deploy.yml`, que builda o site (`output: export`) e publica no GitHub Pages via GitHub Actions.

Pré-requisito único no repositório do GitHub: em **Settings → Pages → Source**, selecionar **GitHub Actions**.

## Como editar conteúdo

_(a detalhar nas próximas fases, quando `messages/{pt,en,es}.json` e `content/{locale}/...` existirem)_

## Decisões de arquitetura

Ver `docs/decisions.md`.
