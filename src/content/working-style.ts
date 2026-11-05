import type { Locale } from "@/i18n/routing";

export type WorkingTraitId =
  | "proactivity"
  | "communication"
  | "collaboration"
  | "ownership"
  | "security"
  | "honesty"
  | "learning"
  | "teaching";

export interface WorkingTrait {
  id: WorkingTraitId;
  title: string;
  evidence: string;
}

export const workingTraits: Record<Locale, WorkingTrait[]> = {
  pt: [
    {
      id: "proactivity",
      title: "Proatividade",
      evidence:
        "Criei agentes de IA e projetos próprios por iniciativa, aprendi Go para entregar a Reconciliação Financeira e montei um inventário de endpoints para auditar o escopo de acesso multi-tenant.",
    },
    {
      id: "communication",
      title: "Comunicação e documentação",
      evidence:
        "Documentação OpenAPI, READMEs bilíngues, decisões de arquitetura registradas em ADRs curtos e commits em Conventional Commits.",
    },
    {
      id: "collaboration",
      title: "Colaboração",
      evidence: "Code review e pair programming com o time, revisando e integrando pull requests dos colegas no dia a dia.",
    },
    {
      id: "ownership",
      title: "Ownership ponta a ponta",
      evidence:
        "Entreguei a Reconciliação Financeira de ponta a ponta: do contrato da API (Go) à tela no Backoffice e ao relatório assíncrono por e-mail.",
    },
    {
      id: "security",
      title: "Segurança por padrão",
      evidence:
        "Conduzi a correção de achados de segurança em autorização multi-tenant, com testes de regressão e auditoria de acessos negados; no catalog-ai, o agente de IA tem defesa estrutural contra prompt injection.",
    },
    {
      id: "honesty",
      title: "Honestidade técnica",
      evidence: "Meus projetos pessoais documentam limitações e melhorias futuras em vez de esconder o que ainda falta.",
    },
    {
      id: "learning",
      title: "Aprendizado contínuo",
      evidence:
        "Pós-graduação em Engenharia de IA Aplicada em andamento, além de ter aprendido Go, Python e construção de agentes de IA no trabalho e nos projetos próprios.",
    },
    {
      id: "teaching",
      title: "Didática",
      evidence:
        "Roteiros de aula escritos para o sosim-cli, com explicações passo a passo pensadas para ensinar conceitos de Sistemas Operacionais.",
    },
  ],
  en: [
    {
      id: "proactivity",
      title: "Proactivity",
      evidence:
        "I created AI agents and personal projects on my own initiative, learned Go to deliver the Financial Reconciliation feature, and built an endpoint inventory to audit multi-tenant access scope.",
    },
    {
      id: "communication",
      title: "Communication and documentation",
      evidence:
        "OpenAPI docs, bilingual READMEs, architecture decisions recorded as short ADRs, and commits in Conventional Commits format.",
    },
    {
      id: "collaboration",
      title: "Collaboration",
      evidence: "Code review and pair programming with the team, reviewing and merging teammates' pull requests day to day.",
    },
    {
      id: "ownership",
      title: "End-to-end ownership",
      evidence:
        "I delivered Financial Reconciliation end-to-end: from the API contract (Go) to the Backoffice screen and the asynchronous email report.",
    },
    {
      id: "security",
      title: "Security by default",
      evidence:
        "I led the fix for multi-tenant authorization security findings, with regression tests and denied-access audits; in catalog-ai, the AI agent has structural defense against prompt injection.",
    },
    {
      id: "honesty",
      title: "Technical honesty",
      evidence: "My personal projects document limitations and future improvements instead of hiding what's still missing.",
    },
    {
      id: "learning",
      title: "Continuous learning",
      evidence:
        "An ongoing postgraduate degree in Applied AI Engineering, plus learning Go, Python, and building AI agents at work and in my own projects.",
    },
    {
      id: "teaching",
      title: "Teaching",
      evidence:
        "Lesson scripts written for sosim-cli, with step-by-step explanations designed to teach Operating Systems concepts.",
    },
  ],
  es: [
    {
      id: "proactivity",
      title: "Proactividad",
      evidence:
        "Creé agentes de IA y proyectos propios por iniciativa, aprendí Go para entregar la Reconciliación Financiera y armé un inventario de endpoints para auditar el alcance de acceso multi-tenant.",
    },
    {
      id: "communication",
      title: "Comunicación y documentación",
      evidence:
        "Documentación OpenAPI, READMEs bilingües, decisiones de arquitectura registradas en ADRs breves y commits en formato Conventional Commits.",
    },
    {
      id: "collaboration",
      title: "Colaboración",
      evidence: "Code review y pair programming con el equipo, revisando e integrando pull requests de los compañeros en el día a día.",
    },
    {
      id: "ownership",
      title: "Ownership de punta a punta",
      evidence:
        "Entregué la Reconciliación Financiera de punta a punta: desde el contrato de la API (Go) hasta la pantalla en el Backoffice y el informe asíncrono por correo.",
    },
    {
      id: "security",
      title: "Seguridad por defecto",
      evidence:
        "Lideré la corrección de hallazgos de seguridad en autorización multi-tenant, con pruebas de regresión y auditoría de accesos denegados; en catalog-ai, el agente de IA tiene defensa estructural contra prompt injection.",
    },
    {
      id: "honesty",
      title: "Honestidad técnica",
      evidence: "Mis proyectos personales documentan limitaciones y mejoras futuras en lugar de ocultar lo que todavía falta.",
    },
    {
      id: "learning",
      title: "Aprendizaje continuo",
      evidence:
        "Un posgrado en curso en Ingeniería de IA Aplicada, además de haber aprendido Go, Python y la construcción de agentes de IA en el trabajo y en mis propios proyectos.",
    },
    {
      id: "teaching",
      title: "Didáctica",
      evidence:
        "Guiones de clase escritos para sosim-cli, con explicaciones paso a paso pensadas para enseñar conceptos de Sistemas Operativos.",
    },
  ],
};
