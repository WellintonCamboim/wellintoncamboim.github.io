# camboim-dev

🇺🇸 English · [🇧🇷 Português (Brasil)](./README.pt-BR.md)

Wellinton Camboim's personal portfolio — a static, trilingual (PT/EN/ES) site built with Next.js and deployed to GitHub Pages.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS v4, `next-intl` for i18n, `next-themes` for light/dark mode, Vitest for testing. See `CLAUDE.md` for detailed conventions (in Portuguese).

## Getting started

Requires the Node version pinned in `.nvmrc` (use `nvm use` if available).

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Testing

```bash
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm run test        # Vitest
npm run build       # production build (generates a static export in out/)
```

## Deploying

Deploys are automatic: every push to `main` triggers `.github/workflows/deploy.yml`, which builds the site (`output: export`) and publishes it to GitHub Pages via GitHub Actions.

One-time setup on the GitHub repository: under **Settings → Pages → Source**, select **GitHub Actions**.

## Editing content

_(to be detailed in later phases, once `messages/{pt,en,es}.json` and `content/{locale}/...` exist)_

## Architecture decisions

See `docs/decisions.md`.
