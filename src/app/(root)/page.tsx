"use client";

import { useEffect } from "react";
import { languageChooserCopy } from "@/content/language-chooser";
import { defaultLocale, locales, type Locale } from "@/i18n/routing";

function detectLocale(): Locale {
  const stored = window.localStorage.getItem("preferred-locale");
  if ((locales as readonly string[]).includes(stored ?? "")) {
    return stored as Locale;
  }

  const candidates = window.navigator.languages ?? [window.navigator.language];
  for (const lang of candidates) {
    const short = lang.slice(0, 2).toLowerCase();
    const match = locales.find((locale) => locale === short);
    if (match) return match;
  }

  return defaultLocale;
}

export default function RootChooserPage() {
  useEffect(() => {
    const target = detectLocale();
    window.location.replace(`/${target}/`);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <p>{languageChooserCopy.redirecting}</p>
      <nav aria-label={languageChooserCopy.navLabel} className="flex gap-4">
        {locales.map((locale) => (
          <a key={locale} href={`/${locale}/`} className="underline">
            {languageChooserCopy.names[locale]}
          </a>
        ))}
      </nav>
      <noscript>
        <p>{languageChooserCopy.noscript}</p>
      </noscript>
    </main>
  );
}
