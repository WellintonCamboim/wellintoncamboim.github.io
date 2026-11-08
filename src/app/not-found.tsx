import type { Metadata } from "next";
import { languageChooserCopy } from "@/content/language-chooser";
import { notFoundCopy } from "@/content/not-found";
import { locales } from "@/i18n/routing";
import "./globals.css";

export const metadata: Metadata = {
  title: "404",
};

// Top-level not-found.tsx, outside both route groups' own root layouts
// ((root)/layout.tsx and [locale]/layout.tsx — see "i18n sem middleware"
// in docs/decisions.md), so it needs its own <html>/<body> the same way
// (root)/layout.tsx does. This is what GitHub Pages serves as 404.html
// for any unmatched static path, so it can't assume a locale.
export default function NotFound() {
  return (
    <html lang="pt">
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
          <p className="text-lg font-semibold">{notFoundCopy.heading}</p>
          <p>{notFoundCopy.body}</p>
          <nav aria-label={languageChooserCopy.navLabel} className="flex gap-4">
            {locales.map((locale) => (
              <a key={locale} href={`/${locale}/`} className="underline">
                {languageChooserCopy.names[locale]}
              </a>
            ))}
          </nav>
        </main>
      </body>
    </html>
  );
}
