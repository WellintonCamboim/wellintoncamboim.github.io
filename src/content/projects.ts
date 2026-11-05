import type { Locale } from "@/i18n/routing";

export interface ProjectEntry {
  name: string;
  tagline: string;
  description: string;
  highlights: string;
  stack: string;
  repoUrl: string;
  featured?: boolean;
  inDevelopment?: boolean;
}

export const projects: Record<Locale, ProjectEntry[]> = {
  pt: [
    {
      name: "catalog-ai",
      tagline: "Mini SaaS multi-tenant com um agente de IA respondendo dúvidas dos clientes via tool calling.",
      description:
        "Cada empresa gerencia seu próprio catálogo, e um agente de IA responde às dúvidas dos clientes consultando o banco de dados real via tool calling, sempre restrito aos dados da empresa do usuário logado. Node.js 22 + Express 5 + TypeScript estrito, MongoDB + Mongoose, JWT (perfis admin/user), Zod, Helmet e rate limiting. Isolamento por company_id em duas camadas (repositório + plugin do Mongoose); o tenant vem só do JWT; retorna 404 em vez de 403 para não revelar a existência de recursos. O agente usa um loop de tool calling próprio (sem LangChain, por decisão de arquitetura documentada), via OpenRouter, com streaming SSE, e defesa estrutural contra prompt injection — as tools só alcançam o tenant do usuário. Front-end em React 19 + Vite + TanStack Query, modo escuro, upload de imagem validado por magic bytes, Docker Compose + Nginx, 86 testes (Vitest, Supertest, Testing Library, mongodb-memory-server), OpenAPI e README em pt-BR/en.",
      highlights: "IA aplicada com segurança (defesa estrutural contra prompt injection), arquitetura multi-tenant documentada e qualidade de testes.",
      stack: "Node.js, Express, TypeScript, MongoDB, React, Vite, OpenRouter, Docker",
      repoUrl: "https://github.com/WellintonCamboim/catalog-ai",
      featured: true,
    },
    {
      name: "argus-ai",
      tagline: "Agente de suporte que investiga bugs e responde dúvidas consultando documentação, logs e banco de dados.",
      description:
        "Agente de suporte que analisa a documentação dos projetos, consulta Grafana e logs, e investiga bancos de dados para responder dúvidas de clientes e investigar bugs. Estruturado em orquestração do agente, tools (Grafana, banco de dados, documentação) e prompts.",
      highlights: "Automação de investigação de suporte combinando observabilidade e dados.",
      stack: "Python",
      repoUrl: "https://github.com/WellintonCamboim/argus-ai",
      inDevelopment: true,
    },
    {
      name: "sosim-cli",
      tagline: "Simulador didático de Sistemas Operacionais em terminal (TUI).",
      description:
        "Simula escalonamento, gerência de memória, deadlock, IPC, sincronização, sistema de arquivos e arquitetura, com animação passo a passo e exportação de relatório. Python + Textual, 7 módulos, testes com pytest, executável via PyInstaller, licença MIT e 7 roteiros de aula.",
      highlights: "Didática, comunicação técnica e domínio de algoritmos clássicos de sistemas operacionais.",
      stack: "Python, Textual, pytest",
      repoUrl: "https://github.com/WellintonCamboim/sosim-cli",
    },
    {
      name: "wellbe",
      tagline: "API de acompanhamento de bem-estar em Go e PostgreSQL.",
      description: "API com Docker Compose e migrations versionadas (golang-migrate). Licença MIT.",
      highlights: "Go fora do trabalho, Docker Compose e migrations versionadas.",
      stack: "Go, PostgreSQL, Docker",
      repoUrl: "https://github.com/WellintonCamboim/wellbe",
    },
  ],
  en: [
    {
      name: "catalog-ai",
      tagline: "Multi-tenant mini SaaS with an AI agent answering customer questions via tool calling.",
      description:
        "Each company manages its own catalog, and an AI agent answers customer questions by querying the real database through tool calling, always restricted to the logged-in user's company data. Node.js 22 + Express 5 + strict TypeScript, MongoDB + Mongoose, JWT (admin/user roles), Zod, Helmet, and rate limiting. Two-layer company_id isolation (repository + Mongoose plugin); the tenant comes only from the JWT; returns 404 instead of 403 to avoid revealing whether a resource exists. The agent runs its own tool-calling loop (no LangChain, a documented architecture decision) via OpenRouter, with SSE streaming, and structural defense against prompt injection — tools can only ever reach the user's own tenant. Front-end in React 19 + Vite + TanStack Query, dark mode, image uploads validated by magic bytes, Docker Compose + Nginx, 86 tests (Vitest, Supertest, Testing Library, mongodb-memory-server), OpenAPI docs, and a bilingual pt-BR/en README.",
      highlights: "Applied AI with security built in (structural prompt-injection defense), documented multi-tenant architecture, and strong test coverage.",
      stack: "Node.js, Express, TypeScript, MongoDB, React, Vite, OpenRouter, Docker",
      repoUrl: "https://github.com/WellintonCamboim/catalog-ai",
      featured: true,
    },
    {
      name: "argus-ai",
      tagline: "A support agent that investigates bugs and answers questions by consulting docs, logs, and databases.",
      description:
        "A support agent that analyzes project documentation, queries Grafana and logs, and investigates databases to answer customer questions and investigate bugs. Structured into agent orchestration, tools (Grafana, database, docs), and prompts.",
      highlights: "Support-investigation automation combining observability and data.",
      stack: "Python",
      repoUrl: "https://github.com/WellintonCamboim/argus-ai",
      inDevelopment: true,
    },
    {
      name: "sosim-cli",
      tagline: "A didactic Operating Systems simulator for the terminal (TUI).",
      description:
        "Simulates scheduling, memory management, deadlocks, IPC, synchronization, file systems, and architecture, with step-by-step animation and report export. Python + Textual, 7 modules, pytest tests, a PyInstaller executable, MIT license, and 7 lesson scripts.",
      highlights: "Teaching ability, technical communication, and command of classic operating-systems algorithms.",
      stack: "Python, Textual, pytest",
      repoUrl: "https://github.com/WellintonCamboim/sosim-cli",
    },
    {
      name: "wellbe",
      tagline: "A wellness-tracking API in Go and PostgreSQL.",
      description: "An API with Docker Compose and versioned migrations (golang-migrate). MIT license.",
      highlights: "Go outside of work, Docker Compose, and versioned migrations.",
      stack: "Go, PostgreSQL, Docker",
      repoUrl: "https://github.com/WellintonCamboim/wellbe",
    },
  ],
  es: [
    {
      name: "catalog-ai",
      tagline: "Mini SaaS multi-tenant con un agente de IA que responde preguntas de clientes mediante tool calling.",
      description:
        "Cada empresa gestiona su propio catálogo, y un agente de IA responde las preguntas de los clientes consultando la base de datos real mediante tool calling, siempre restringido a los datos de la empresa del usuario autenticado. Node.js 22 + Express 5 + TypeScript estricto, MongoDB + Mongoose, JWT (perfiles admin/user), Zod, Helmet y rate limiting. Aislamiento por company_id en dos capas (repositorio + plugin de Mongoose); el tenant proviene solo del JWT; devuelve 404 en lugar de 403 para no revelar la existencia de recursos. El agente usa un loop de tool calling propio (sin LangChain, una decisión de arquitectura documentada), vía OpenRouter, con streaming SSE, y defensa estructural contra prompt injection — las tools solo alcanzan el tenant del usuario. Front-end en React 19 + Vite + TanStack Query, modo oscuro, carga de imágenes validada por magic bytes, Docker Compose + Nginx, 86 pruebas (Vitest, Supertest, Testing Library, mongodb-memory-server), documentación OpenAPI y README en pt-BR/en.",
      highlights: "IA aplicada con seguridad (defensa estructural contra prompt injection), arquitectura multi-tenant documentada y buena cobertura de pruebas.",
      stack: "Node.js, Express, TypeScript, MongoDB, React, Vite, OpenRouter, Docker",
      repoUrl: "https://github.com/WellintonCamboim/catalog-ai",
      featured: true,
    },
    {
      name: "argus-ai",
      tagline: "Un agente de soporte que investiga errores y responde preguntas consultando documentación, logs y bases de datos.",
      description:
        "Agente de soporte que analiza la documentación de los proyectos, consulta Grafana y logs, e investiga bases de datos para responder preguntas de clientes e investigar errores. Estructurado en orquestación del agente, tools (Grafana, base de datos, documentación) y prompts.",
      highlights: "Automatización de investigación de soporte combinando observabilidad y datos.",
      stack: "Python",
      repoUrl: "https://github.com/WellintonCamboim/argus-ai",
      inDevelopment: true,
    },
    {
      name: "sosim-cli",
      tagline: "Un simulador didáctico de Sistemas Operativos en terminal (TUI).",
      description:
        "Simula planificación, gestión de memoria, deadlock, IPC, sincronización, sistema de archivos y arquitectura, con animación paso a paso y exportación de informes. Python + Textual, 7 módulos, pruebas con pytest, ejecutable vía PyInstaller, licencia MIT y 7 guiones de clase.",
      highlights: "Didáctica, comunicación técnica y dominio de algoritmos clásicos de sistemas operativos.",
      stack: "Python, Textual, pytest",
      repoUrl: "https://github.com/WellintonCamboim/sosim-cli",
    },
    {
      name: "wellbe",
      tagline: "Una API de seguimiento de bienestar en Go y PostgreSQL.",
      description: "API con Docker Compose y migraciones versionadas (golang-migrate). Licencia MIT.",
      highlights: "Go fuera del trabajo, Docker Compose y migraciones versionadas.",
      stack: "Go, PostgreSQL, Docker",
      repoUrl: "https://github.com/WellintonCamboim/wellbe",
    },
  ],
};
