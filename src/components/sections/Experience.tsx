import { useLocale, useTranslations } from "next-intl";
import { experience } from "@/content/profile";
import type { Locale } from "@/i18n/routing";

export function Experience() {
  const t = useTranslations("experience");
  const locale = useLocale() as Locale;
  const entries = experience[locale];

  return (
    <section id="experience" className="scroll-mt-24 px-4 py-20">
      <div className="mx-auto max-w-[var(--content-max-width)]">
        <h2 className="mb-10 text-2xl font-semibold">{t("heading")}</h2>
        <ol className="space-y-10 border-l border-border pl-6">
          {entries.map((entry) => (
            <li key={`${entry.company}-${entry.period}`} className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-[1.6rem] top-1.5 size-2.5 rounded-full bg-accent"
              />
              <h3 className="font-mono text-lg font-medium">
                {entry.role} · {entry.company}
              </h3>
              <p className="text-sm text-muted-foreground">
                {entry.period} — {entry.context}
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-foreground/90">
                {entry.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
              <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">
                {t("stackLabel")}: {entry.stack}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
