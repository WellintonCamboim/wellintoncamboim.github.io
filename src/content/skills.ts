import type { Locale } from "@/i18n/routing";

export type HighlightCategoryId = "frontend" | "backend" | "cloud" | "ai" | "domain";

export interface HighlightGroup {
  id: HighlightCategoryId;
  name: string;
  skills: string[];
}

export interface SecondaryGroup {
  id: string;
  name: string;
  skills: string[];
}

export const highlightSkills: Record<Locale, HighlightGroup[]> = {
  pt: [
    {
      id: "frontend",
      name: "Front-end e mobile",
      skills: ["TypeScript", "JavaScript", "React", "Vue.js", "Next.js", "React Native"],
    },
    {
      id: "backend",
      name: "Back-end e dados",
      skills: ["Node.js", "Go", "PostgreSQL", "MongoDB", "Mongoose", "Prisma", "Redis"],
    },
    {
      id: "cloud",
      name: "Nuvem e segurança",
      skills: ["AWS", "Autenticação", "RBAC", "Autorização multi-tenant (Auth.js, Keycloak, Auth0)", "OTP/2FA"],
    },
    {
      id: "ai",
      name: "IA aplicada",
      skills: [
        "Agentes de IA",
        "Tool calling",
        "MCP",
        "Claude Agent SDK",
        "AWS Bedrock",
        "Strands Agents",
        "Claude Code",
        "GitHub Copilot",
      ],
    },
    {
      id: "domain",
      name: "Domínio",
      skills: ["PIX", "Tesouraria", "Reconciliação financeira", "Integração com PSP", "BFF e microsserviços"],
    },
  ],
  en: [
    {
      id: "frontend",
      name: "Front-end and mobile",
      skills: ["TypeScript", "JavaScript", "React", "Vue.js", "Next.js", "React Native"],
    },
    {
      id: "backend",
      name: "Back-end and data",
      skills: ["Node.js", "Go", "PostgreSQL", "MongoDB", "Mongoose", "Prisma", "Redis"],
    },
    {
      id: "cloud",
      name: "Cloud and security",
      skills: ["AWS", "Authentication", "RBAC", "Multi-tenant authorization (Auth.js, Keycloak, Auth0)", "OTP/2FA"],
    },
    {
      id: "ai",
      name: "Applied AI",
      skills: [
        "AI agents",
        "Tool calling",
        "MCP",
        "Claude Agent SDK",
        "AWS Bedrock",
        "Strands Agents",
        "Claude Code",
        "GitHub Copilot",
      ],
    },
    {
      id: "domain",
      name: "Domain",
      skills: ["PIX", "Treasury", "Financial reconciliation", "PSP integration", "BFF and microservices"],
    },
  ],
  es: [
    {
      id: "frontend",
      name: "Front-end y mobile",
      skills: ["TypeScript", "JavaScript", "React", "Vue.js", "Next.js", "React Native"],
    },
    {
      id: "backend",
      name: "Back-end y datos",
      skills: ["Node.js", "Go", "PostgreSQL", "MongoDB", "Mongoose", "Prisma", "Redis"],
    },
    {
      id: "cloud",
      name: "Nube y seguridad",
      skills: ["AWS", "Autenticación", "RBAC", "Autorización multi-tenant (Auth.js, Keycloak, Auth0)", "OTP/2FA"],
    },
    {
      id: "ai",
      name: "IA aplicada",
      skills: [
        "Agentes de IA",
        "Tool calling",
        "MCP",
        "Claude Agent SDK",
        "AWS Bedrock",
        "Strands Agents",
        "Claude Code",
        "GitHub Copilot",
      ],
    },
    {
      id: "domain",
      name: "Dominio",
      skills: ["PIX", "Tesorería", "Reconciliación financiera", "Integración con PSP", "BFF y microservicios"],
    },
  ],
};

export const secondarySkills: Record<Locale, SecondaryGroup[]> = {
  pt: [
    {
      id: "testing",
      name: "Testes e qualidade",
      skills: ["Vitest", "Jest", "Supertest", "Testing Library", "Playwright"],
    },
    {
      id: "api-security",
      name: "Segurança de API",
      skills: ["Helmet", "Rate limiting", "Validação com Zod"],
    },
    {
      id: "infra",
      name: "Infraestrutura",
      skills: ["Docker", "Nginx", "Kubernetes", "Helm", "IRSA", "GitHub Actions", "GitOps"],
    },
    {
      id: "data-messaging",
      name: "Dados e mensageria",
      skills: ["GraphQL", "MySQL", "RabbitMQ", "Kafka", "Bull/filas", "ElasticSearch"],
    },
    {
      id: "bi",
      name: "BI",
      skills: ["Metabase", "Power BI"],
    },
    {
      id: "ai-tools",
      name: "IA",
      skills: [
        "OpenRouter",
        "RAG",
        "Embeddings",
        "Bancos vetoriais",
        "LangChain/LlamaIndex",
        "Avaliação de LLM (evals)",
        "Guardrails",
        "Fine-tuning",
      ],
    },
    {
      id: "methodologies",
      name: "Metodologias",
      skills: ["Scrum", "Kanban", "Métodos ágeis"],
    },
  ],
  en: [
    {
      id: "testing",
      name: "Testing and quality",
      skills: ["Vitest", "Jest", "Supertest", "Testing Library", "Playwright"],
    },
    {
      id: "api-security",
      name: "API security",
      skills: ["Helmet", "Rate limiting", "Validation with Zod"],
    },
    {
      id: "infra",
      name: "Infrastructure",
      skills: ["Docker", "Nginx", "Kubernetes", "Helm", "IRSA", "GitHub Actions", "GitOps"],
    },
    {
      id: "data-messaging",
      name: "Data and messaging",
      skills: ["GraphQL", "MySQL", "RabbitMQ", "Kafka", "Bull/queues", "ElasticSearch"],
    },
    {
      id: "bi",
      name: "BI",
      skills: ["Metabase", "Power BI"],
    },
    {
      id: "ai-tools",
      name: "AI",
      skills: [
        "OpenRouter",
        "RAG",
        "Embeddings",
        "Vector databases",
        "LangChain/LlamaIndex",
        "LLM evaluation (evals)",
        "Guardrails",
        "Fine-tuning",
      ],
    },
    {
      id: "methodologies",
      name: "Methodologies",
      skills: ["Scrum", "Kanban", "Agile methods"],
    },
  ],
  es: [
    {
      id: "testing",
      name: "Pruebas y calidad",
      skills: ["Vitest", "Jest", "Supertest", "Testing Library", "Playwright"],
    },
    {
      id: "api-security",
      name: "Seguridad de API",
      skills: ["Helmet", "Rate limiting", "Validación con Zod"],
    },
    {
      id: "infra",
      name: "Infraestructura",
      skills: ["Docker", "Nginx", "Kubernetes", "Helm", "IRSA", "GitHub Actions", "GitOps"],
    },
    {
      id: "data-messaging",
      name: "Datos y mensajería",
      skills: ["GraphQL", "MySQL", "RabbitMQ", "Kafka", "Bull/colas", "ElasticSearch"],
    },
    {
      id: "bi",
      name: "BI",
      skills: ["Metabase", "Power BI"],
    },
    {
      id: "ai-tools",
      name: "IA",
      skills: [
        "OpenRouter",
        "RAG",
        "Embeddings",
        "Bases de datos vectoriales",
        "LangChain/LlamaIndex",
        "Evaluación de LLM (evals)",
        "Guardrails",
        "Fine-tuning",
      ],
    },
    {
      id: "methodologies",
      name: "Metodologías",
      skills: ["Scrum", "Kanban", "Métodos ágiles"],
    },
  ],
};
