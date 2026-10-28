import type { Locale } from "@/i18n/routing";

export const languageChooserCopy: {
  redirecting: string;
  noscript: string;
  navLabel: string;
  names: Record<Locale, string>;
} = {
  redirecting: "Escolhendo idioma… · Choosing language… · Eligiendo idioma…",
  noscript:
    "Seu navegador não executou o redirecionamento automático. Escolha um idioma: · Your browser didn't run the automatic redirect. Choose a language: · Tu navegador no ejecutó la redirección automática. Elige un idioma:",
  navLabel: "Idiomas / Languages / Idiomas",
  names: {
    pt: "Português",
    en: "English",
    es: "Español",
  },
};
