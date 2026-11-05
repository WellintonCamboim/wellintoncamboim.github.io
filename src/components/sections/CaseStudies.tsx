import { ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { caseStudies } from "@/content/case-studies";
import type { Locale } from "@/i18n/routing";

export function CaseStudies() {
  const t = useTranslations("caseStudies");
  const locale = useLocale() as Locale;
  const entries = caseStudies[locale];

  return (
    <section id="case-studies" className="scroll-mt-24 px-4 py-20">
      <div className="mx-auto max-w-[var(--content-max-width)]">
        <h2 className="mb-10 text-2xl font-semibold">{t("heading")}</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {entries.map((entry) => (
            <details
              key={entry.title}
              className="group rounded-md border border-border bg-surface p-5 open:ring-1 open:ring-accent"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-3 font-mono text-lg font-medium text-foreground [&::-webkit-details-marker]:hidden">
                <span>{entry.title}</span>
                <ChevronDown
                  aria-hidden="true"
                  className="mt-1 size-4 shrink-0 text-accent transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">{entry.context}</p>
              <div className="mt-4 space-y-3 text-sm text-foreground/90">
                <p>
                  <span className="font-medium text-foreground">{t("challengeLabel")}:</span>{" "}
                  {entry.challenge}
                </p>
                <p>
                  <span className="font-medium text-foreground">{t("actionLabel")}:</span>{" "}
                  {entry.action}
                </p>
                <p>
                  <span className="font-medium text-foreground">{t("outcomeLabel")}:</span>{" "}
                  {entry.outcome}
                </p>
              </div>
              <p className="mt-4 text-xs uppercase tracking-wide text-muted-foreground">
                {t("stackLabel")}: {entry.stack}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
