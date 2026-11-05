import type { Locale } from "@/i18n/routing";

export interface CaseStudyEntry {
  title: string;
  context: string;
  challenge: string;
  action: string;
  outcome: string;
  stack: string;
}

export const caseStudies: Record<Locale, CaseStudyEntry[]> = {
  pt: [
    {
      title: "Sistema de tesouraria multi-operador",
      context:
        "PSP que atende múltiplos operadores de iGaming precisava de um sistema de gestão de tesouraria confiável para controlar o dinheiro de cada operador.",
      challenge:
        "Garantir isolamento financeiro e de acesso entre operadores, com cálculo automático e preciso do GGR, dashboards confiáveis e documentação clara para múltiplos consumidores da API.",
      action:
        "Participei desde o início da construção do sistema (Next.js, Prisma, PostgreSQL, Node.js, Redis), implementando controle de acesso dinâmico, modelagem financeira com precisão decimal, cálculo automático do GGR, dashboards e documentação OpenAPI.",
      outcome:
        "Sistema em produção para 8 operadores; aprendizado sobre modelagem financeira multi-tenant e a importância de documentação OpenAPI quando várias equipes consomem a mesma API.",
      stack: "Next.js, Prisma, PostgreSQL, Node.js, Redis",
    },
    {
      title: "Reconciliação financeira ponta a ponta",
      context:
        "Divergências entre o ledger interno e extratos de parceiros precisavam ser identificadas e tratadas de forma confiável.",
      challenge:
        "Entregar uma solução completa — da API ao relatório — cobrindo múltiplos tipos de inconsistência, em uma linguagem (Go) que eu ainda não usava no dia a dia.",
      action:
        "Entreguei de ponta a ponta a Reconciliação Financeira: API em Go, tela no Backoffice e relatório assíncrono por e-mail, cobrindo 15 códigos de inconsistência de ledger.",
      outcome:
        "Processo de reconciliação automatizado e auditável; aprendizado prático de Go para entregar um serviço crítico de confiabilidade financeira.",
      stack: "Go, PostgreSQL, Node.js",
    },
    {
      title: "PIX e aprovações no Internet Banking e Backoffice",
      context:
        "Operações financeiras sensíveis (PIX, aprovações) exigiam fluxos seguros com múltiplas camadas de confirmação.",
      challenge:
        "Implementar fluxos completos de PIX (manual, copia e cola, QR estático/dinâmico, estorno, gestão de chaves) e um fluxo de aprovação maker-checker com 2FA, integrado a um PSP parceiro.",
      action:
        "Desenvolvi as funcionalidades no Internet Banking e Backoffice, com cabine de aprovação com 2FA, gerenciamento de perfis e permissões, e integração com o PSP parceiro.",
      outcome:
        "Fluxos de PIX e aprovação em produção, com segurança de múltiplas camadas; aprendizado sobre modelagem de fluxos financeiros com maker-checker.",
      stack: "Next.js, Node.js, Auth0, Keycloak",
    },
    {
      title: "Isolamento multi-tenant",
      context:
        "Falhas de autorização multi-tenant representam risco direto de um operador acessar dados de outro.",
      challenge:
        "Identificar e corrigir sistematicamente falhas de autorização, sem quebrar funcionalidades existentes, em um sistema já em produção.",
      action:
        "Conduzi, testei e validei a correção de achados de segurança em autorização multi-tenant, com testes de regressão e auditoria de acessos negados.",
      outcome:
        "Isolamento multi-tenant reforçado com suíte de regressão; aprendizado sobre segurança por padrão (secure by default) e a importância de auditorias de acesso negado.",
      stack: "Node.js, PostgreSQL, Keycloak",
    },
  ],
  en: [
    {
      title: "Multi-operator treasury system",
      context:
        "A PSP serving multiple iGaming operators needed a reliable treasury management system to control each operator's funds.",
      challenge:
        "Guarantee financial and access isolation between operators, with accurate automatic GGR (Gross Gaming Revenue, the operator's net result after prizes) calculation, trustworthy dashboards, and clear documentation for multiple API consumers.",
      action:
        "I joined the construction of the system from the ground up (Next.js, Prisma, PostgreSQL, Node.js, Redis), implementing dynamic access control, decimal-precision financial modeling, automatic GGR calculation, dashboards, and OpenAPI documentation.",
      outcome:
        "The system is in production for 8 operators; I learned about multi-tenant financial modeling and how important OpenAPI documentation becomes when several teams consume the same API.",
      stack: "Next.js, Prisma, PostgreSQL, Node.js, Redis",
    },
    {
      title: "End-to-end financial reconciliation",
      context:
        "Discrepancies between the internal ledger and partner statements needed to be identified and handled reliably.",
      challenge:
        "Deliver a complete solution — from the API to the report — covering multiple types of inconsistency, in a language (Go) I hadn't used day-to-day before.",
      action:
        "I delivered the Financial Reconciliation feature end-to-end: a Go API, a Backoffice screen, and an asynchronous email report, covering 15 ledger inconsistency codes.",
      outcome:
        "An automated, auditable reconciliation process; hands-on learning of Go to deliver a service critical to financial reliability.",
      stack: "Go, PostgreSQL, Node.js",
    },
    {
      title: "PIX and approvals in Internet Banking and Backoffice",
      context:
        "Sensitive financial operations (PIX transfers, approvals) required secure flows with multiple layers of confirmation.",
      challenge:
        "Implement complete PIX (Brazil's instant payment system) flows — manual, copy-and-paste, static/dynamic QR code, refunds, key management — and a maker-checker approval flow with 2FA, integrated with a partner PSP.",
      action:
        "I built these features in the Internet Banking and Backoffice apps, including an approval booth with 2FA, profile and permission management, and integration with the partner PSP.",
      outcome:
        "PIX and approval flows now run in production with multiple layers of security; I learned about modeling financial flows with maker-checker controls.",
      stack: "Next.js, Node.js, Auth0, Keycloak",
    },
    {
      title: "Multi-tenant isolation",
      context:
        "Multi-tenant authorization flaws carry a direct risk of one operator accessing another operator's data.",
      challenge:
        "Systematically identify and fix authorization flaws without breaking existing functionality, in a system already running in production.",
      action:
        "I led, tested, and validated the fix for multi-tenant authorization security findings, with regression tests and denied-access audits.",
      outcome:
        "Multi-tenant isolation was strengthened with a regression test suite; I learned about secure-by-default design and the importance of denied-access audits.",
      stack: "Node.js, PostgreSQL, Keycloak",
    },
  ],
  es: [
    {
      title: "Sistema de tesorería multi-operador",
      context:
        "Un PSP que atiende a múltiples operadores de iGaming necesitaba un sistema de gestión de tesorería confiable para controlar el dinero de cada operador.",
      challenge:
        "Garantizar el aislamiento financiero y de acceso entre operadores, con un cálculo automático y preciso del GGR (Gross Gaming Revenue, el resultado neto del operador después de los premios), dashboards confiables y documentación clara para múltiples consumidores de la API.",
      action:
        "Participé desde el inicio en la construcción del sistema (Next.js, Prisma, PostgreSQL, Node.js, Redis), implementando control de acceso dinámico, modelado financiero con precisión decimal, cálculo automático del GGR, dashboards y documentación OpenAPI.",
      outcome:
        "Sistema en producción para 8 operadores; aprendí sobre modelado financiero multi-tenant y la importancia de la documentación OpenAPI cuando varios equipos consumen la misma API.",
      stack: "Next.js, Prisma, PostgreSQL, Node.js, Redis",
    },
    {
      title: "Reconciliación financiera de punta a punta",
      context:
        "Las divergencias entre el ledger interno y los extractos de los socios debían identificarse y tratarse de forma confiable.",
      challenge:
        "Entregar una solución completa —desde la API hasta el informe— que cubriera múltiples tipos de inconsistencia, en un lenguaje (Go) que yo aún no usaba en el día a día.",
      action:
        "Entregué de punta a punta la Reconciliación Financiera: una API en Go, una pantalla en el Backoffice y un informe asíncrono por correo, cubriendo 15 códigos de inconsistencia del ledger.",
      outcome:
        "Un proceso de reconciliación automatizado y auditable; aprendizaje práctico de Go para entregar un servicio crítico para la confiabilidad financiera.",
      stack: "Go, PostgreSQL, Node.js",
    },
    {
      title: "PIX y aprobaciones en el Internet Banking y el Backoffice",
      context:
        "Las operaciones financieras sensibles (PIX, aprobaciones) exigían flujos seguros con múltiples capas de confirmación.",
      challenge:
        "Implementar flujos completos de PIX (el sistema de pagos instantáneos de Brasil) —manual, copiar y pegar, código QR estático/dinámico, reembolso, gestión de claves— y un flujo de aprobación maker-checker con 2FA, integrado con un PSP socio.",
      action:
        "Desarrollé estas funcionalidades en el Internet Banking y el Backoffice, con una cabina de aprobación con 2FA, gestión de perfiles y permisos, e integración con el PSP socio.",
      outcome:
        "Flujos de PIX y aprobación en producción, con seguridad de múltiples capas; aprendí sobre el modelado de flujos financieros con maker-checker.",
      stack: "Next.js, Node.js, Auth0, Keycloak",
    },
    {
      title: "Aislamiento multi-tenant",
      context:
        "Las fallas de autorización multi-tenant representan un riesgo directo de que un operador acceda a los datos de otro.",
      challenge:
        "Identificar y corregir sistemáticamente fallas de autorización sin romper funcionalidades existentes, en un sistema ya en producción.",
      action:
        "Lideré, probé y validé la corrección de hallazgos de seguridad en autorización multi-tenant, con pruebas de regresión y auditoría de accesos denegados.",
      outcome:
        "El aislamiento multi-tenant quedó reforzado con una suite de regresión; aprendí sobre seguridad por defecto (secure by default) y la importancia de las auditorías de acceso denegado.",
      stack: "Node.js, PostgreSQL, Keycloak",
    },
  ],
};
