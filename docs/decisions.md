# Decisões de arquitetura

ADRs curtos. Um bloco por decisão, mais recente no topo.

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
