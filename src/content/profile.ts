import type { Locale } from "@/i18n/routing";

export interface ExperienceEntry {
  company: string;
  role: string;
  period: string;
  context: string;
  highlights: string[];
  stack: string;
}

export const experience: Record<Locale, ExperienceEntry[]> = {
  pt: [
    {
      company: "OKTO Payments",
      role: "Engenheiro de Software Full-Stack",
      period: "desde ago/2024",
      context: "PSP para operadores de iGaming e entretenimento digital regulado na América Latina.",
      highlights: [
        "Participei desde o início da construção do Treasury Management System (Next.js, Prisma, PostgreSQL, Node.js, Redis): controle de acesso dinâmico, modelagem financeira, o cálculo automático do GGR (Gross Gaming Revenue), dashboards e documentação OpenAPI, com deploy multi-tenant para 8 operadores.",
        "Desenvolvi funcionalidades no Internet Banking e no Backoffice, como fluxos completos de PIX (manual, copia e cola, QR Code estático e dinâmico, estorno e gestão de chaves), cabine de aprovação com 2FA, gerenciamento de perfis e permissões, e integração com PSP parceiro.",
        "Entreguei de ponta a ponta a Reconciliação Financeira: API em Go, tela no Backoffice e relatório assíncrono por e-mail, cobrindo 15 códigos de inconsistência de Ledger.",
        "Conduzi, testei e validei a correção de achados de segurança em autorização multi-tenant, com testes de regressão e auditoria de acessos negados.",
        "Criei agentes de IA em Python: monitoramento de risco de transferências (AWS Bedrock + Strands Agents) e investigação de incidentes PIX (Claude Agent SDK, integrado a Grafana e Jira).",
        "Uso IA no planejamento e no desenvolvimento diário (Claude Code, GitHub Copilot), validando tudo com testes automatizados, code review e pipelines no GitHub Actions.",
      ],
      stack: "Node.js, Go, PostgreSQL, Redis, Docker, Auth0, Keycloak, AWS, Next.js",
    },
    {
      company: "Conta XIP",
      role: "Desenvolvedor Full-Stack",
      period: "jul/2022 – jul/2024",
      context: "Remoto · App financeiro (XIP+) para clientes da Solar Coca-Cola.",
      highlights: [
        "Atuei na API interna (Node.js), no aplicativo principal (React Native) e no Backoffice, integrando APIs REST entre os serviços.",
        "Liderei a squad de Sustentação N3: investigação de bugs reportados pelo suporte, análises para as áreas comercial e de compliance, e scripts de atualização de dados em PostgreSQL e MongoDB.",
        "Conduzi investigações e correções de segurança da informação.",
        "Participei de grupos de trabalho ligados a tecnologia e negócio, com elaboração de documentações técnicas e para os setores comercial e de produto.",
      ],
      stack: "Node.js, React Native, PostgreSQL, MongoDB, AWS",
    },
    {
      company: "Tentáculo.Digital",
      role: "Desenvolvedor Full-Stack",
      period: "jun/2020 – jun/2022",
      context: "Remoto · Software house.",
      highlights: [
        "Atuei em produtos internos e em projetos de clientes, principalmente do setor financeiro, em front-end, mobile e back-end (React, Angular, React Native, Node.js, Java).",
        "Participei da construção de produtos do zero, com contato direto com clientes e stakeholders para levantamento e validação de requisitos.",
        "Testes de software, code review em pull requests, entendimento de regras de negócio e correção de bugs.",
      ],
      stack: "React, Angular, React Native, Node.js, Java, MongoDB",
    },
    {
      company: "Instituto Federal Catarinense (IFC)",
      role: "Desenvolvedor Back-end",
      period: "fev/2019 – fev/2020",
      context: "Camboriú, SC · Projeto de pesquisa com TAF International Project e FAPESC.",
      highlights: [
        "Participei do desenvolvimento do back-end de um sistema de monitoramento e automação do cultivo de peixes, com leitura de dados de sensores de qualidade da água.",
        "Apoiei a gerência de projeto na investigação do problema e no desenvolvimento da solução.",
        "Testes, validação de regras de negócio e modelagem do sistema em UML.",
      ],
      stack: "Java, Spring Boot, React",
    },
  ],
  en: [
    {
      company: "OKTO Payments",
      role: "Full-Stack Software Engineer",
      period: "since Aug 2024",
      context:
        "Payment service provider (PSP) for regulated iGaming and digital entertainment operators in Latin America.",
      highlights: [
        "Joined from the ground up to build the Treasury Management System (Next.js, Prisma, PostgreSQL, Node.js, Redis): dynamic access control, financial modeling, automatic GGR calculation (Gross Gaming Revenue, the operator's net result after prizes), dashboards, and OpenAPI docs, deployed multi-tenant for 8 operators.",
        "Built features in the Internet Banking and Backoffice apps, such as complete PIX (Brazil's instant payment system) flows — manual, copy-and-paste, static and dynamic QR codes, refunds, and key management — an approval-booth flow with 2FA, profile and permission management, and integration with a partner PSP.",
        "Delivered end-to-end Financial Reconciliation: a Go API, a Backoffice screen, and an asynchronous email report, covering 15 Ledger inconsistency codes.",
        "Led, tested, and validated the fix for multi-tenant authorization security findings, with regression tests and denied-access audits.",
        "Built AI agents in Python: transfer risk monitoring (AWS Bedrock + Strands Agents) and PIX incident investigation (Claude Agent SDK, integrated with Grafana and Jira).",
        "Use AI for daily planning and development (Claude Code, GitHub Copilot), validating everything with automated tests, code review, and GitHub Actions pipelines.",
      ],
      stack: "Node.js, Go, PostgreSQL, Redis, Docker, Auth0, Keycloak, AWS, Next.js",
    },
    {
      company: "Conta XIP",
      role: "Full-Stack Developer",
      period: "Jul 2022 – Jul 2024",
      context: "Remote · Financial app (XIP+) for Solar Coca-Cola's customers.",
      highlights: [
        "Worked on the internal API (Node.js), the main app (React Native), and the Backoffice, integrating REST APIs across services.",
        "Led the tier-3 support squad: investigated bugs reported by the support team, provided analysis for the sales and compliance teams, and ran data-update scripts in PostgreSQL and MongoDB.",
        "Led information-security investigations and fixes.",
        "Took part in cross-functional tech-and-business working groups, producing technical documentation as well as materials for the sales and product teams.",
      ],
      stack: "Node.js, React Native, PostgreSQL, MongoDB, AWS",
    },
    {
      company: "Tentáculo.Digital",
      role: "Full-Stack Developer",
      period: "Jun 2020 – Jun 2022",
      context: "Remote · Software house.",
      highlights: [
        "Worked on internal products and client projects, mostly in the financial sector, across front-end, mobile, and back-end (React, Angular, React Native, Node.js, Java).",
        "Took part in building products from the ground up, working directly with clients and stakeholders to gather and validate requirements.",
        "Software testing, pull request code reviews, business rule analysis, and bug fixes.",
      ],
      stack: "React, Angular, React Native, Node.js, Java, MongoDB",
    },
    {
      company: "Instituto Federal Catarinense (IFC)",
      role: "Back-end Developer",
      period: "Feb 2019 – Feb 2020",
      context: "Camboriú, SC · Research project with the TAF International Project and FAPESC.",
      highlights: [
        "Took part in building the back-end of a fish-farming monitoring and automation system, reading data from water-quality sensors.",
        "Supported project management in investigating the problem and developing the solution.",
        "Wrote tests, validated business rules, and modeled the system in UML.",
      ],
      stack: "Java, Spring Boot, React",
    },
  ],
  es: [
    {
      company: "OKTO Payments",
      role: "Ingeniero de Software Full-Stack",
      period: "desde ago. 2024",
      context:
        "Proveedor de servicios de pago (PSP) para operadores regulados de iGaming y entretenimiento digital en América Latina.",
      highlights: [
        "Participé desde el inicio en la construcción del Treasury Management System (Next.js, Prisma, PostgreSQL, Node.js, Redis): control de acceso dinámico, modelado financiero, el cálculo automático del GGR (Gross Gaming Revenue, el resultado neto del operador después de los premios), dashboards y documentación OpenAPI, con despliegue multi-tenant para 8 operadores.",
        "Desarrollé funcionalidades en el Internet Banking y el Backoffice, como flujos completos de PIX (el sistema de pagos instantáneos de Brasil): manual, copiar y pegar, código QR estático y dinámico, reembolsos y gestión de claves, una cabina de aprobación con 2FA, gestión de perfiles y permisos, e integración con un PSP socio.",
        "Entregué de punta a punta la Reconciliación Financiera: API en Go, pantalla en el Backoffice e informe asíncrono por correo, cubriendo 15 códigos de inconsistencia del Ledger.",
        "Lideré, probé y validé la corrección de hallazgos de seguridad en autorización multi-tenant, con pruebas de regresión y auditoría de accesos denegados.",
        "Creé agentes de IA en Python: monitoreo de riesgo de transferencias (AWS Bedrock + Strands Agents) e investigación de incidentes de PIX (Claude Agent SDK, integrado con Grafana y Jira).",
        "Uso IA en la planificación y el desarrollo diario (Claude Code, GitHub Copilot), validando todo con pruebas automatizadas, code review y pipelines de GitHub Actions.",
      ],
      stack: "Node.js, Go, PostgreSQL, Redis, Docker, Auth0, Keycloak, AWS, Next.js",
    },
    {
      company: "Conta XIP",
      role: "Desarrollador Full-Stack",
      period: "jul. 2022 – jul. 2024",
      context: "Remoto · Aplicación financiera (XIP+) para los clientes de Solar Coca-Cola.",
      highlights: [
        "Trabajé en la API interna (Node.js), en la aplicación principal (React Native) y en el Backoffice, integrando APIs REST entre los servicios.",
        "Lideré el equipo de soporte de nivel 3: investigación de errores reportados por el equipo de soporte, análisis para las áreas comercial y de cumplimiento, y scripts de actualización de datos en PostgreSQL y MongoDB.",
        "Lideré investigaciones y correcciones de seguridad de la información.",
        "Participé en grupos de trabajo multidisciplinarios de tecnología y negocio, elaborando documentación técnica y materiales para los equipos comercial y de producto.",
      ],
      stack: "Node.js, React Native, PostgreSQL, MongoDB, AWS",
    },
    {
      company: "Tentáculo.Digital",
      role: "Desarrollador Full-Stack",
      period: "jun. 2020 – jun. 2022",
      context: "Remoto · Software house.",
      highlights: [
        "Trabajé en productos internos y proyectos de clientes, principalmente del sector financiero, en front-end, mobile y back-end (React, Angular, React Native, Node.js, Java).",
        "Participé en la construcción de productos desde cero, con contacto directo con clientes y stakeholders para el levantamiento y validación de requisitos.",
        "Pruebas de software, code review en pull requests, análisis de reglas de negocio y corrección de errores.",
      ],
      stack: "React, Angular, React Native, Node.js, Java, MongoDB",
    },
    {
      company: "Instituto Federal Catarinense (IFC)",
      role: "Desarrollador Back-end",
      period: "feb. 2019 – feb. 2020",
      context: "Camboriú, SC · Proyecto de investigación con TAF International Project y FAPESC.",
      highlights: [
        "Participé en el desarrollo del back-end de un sistema de monitoreo y automatización del cultivo de peces, con lectura de datos de sensores de calidad del agua.",
        "Apoyé a la gerencia de proyecto en la investigación del problema y en el desarrollo de la solución.",
        "Pruebas, validación de reglas de negocio y modelado del sistema en UML.",
      ],
      stack: "Java, Spring Boot, React",
    },
  ],
};

export const education: Record<Locale, string[]> = {
  pt: [
    "Pós-graduação em Engenharia de IA Aplicada — UNIPDS (fev/2026 → previsão ago/2027)",
    "Pós-graduação Lato Sensu em Gestão e Negócios (BI e E-commerce) — Instituto Federal Catarinense (2018–2019)",
    "Bacharelado em Engenharia Ambiental — Univali (2010–2016)",
    "Bacharelado em Sistemas de Informação — Instituto Federal Catarinense (2017–2020)",
  ],
  en: [
    "Postgraduate degree in Applied AI Engineering — UNIPDS (Feb 2026 → expected Aug 2027)",
    "Postgraduate certificate in Business Management (BI and E-commerce) — Instituto Federal Catarinense (2018–2019)",
    "B.Eng. in Environmental Engineering — Univali (2010–2016)",
    "B.Sc. in Information Systems — Instituto Federal Catarinense (2017–2020)",
  ],
  es: [
    "Posgrado en Ingeniería de IA Aplicada — UNIPDS (feb. 2026 → previsto ago. 2027)",
    "Posgrado en Gestión y Negocios (BI y E-commerce) — Instituto Federal Catarinense (2018–2019)",
    "Ingeniería Ambiental — Univali (2010–2016)",
    "Licenciatura en Sistemas de Información — Instituto Federal Catarinense (2017–2020)",
  ],
};
