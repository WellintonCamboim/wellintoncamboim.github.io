import { useLocale, useTranslations } from "next-intl";
import { siGithub } from "simple-icons";
import { BrandIcon } from "@/components/icons/BrandIcon";
import { projects } from "@/content/projects";
import type { Locale } from "@/i18n/routing";

export function Projects() {
  const t = useTranslations("projects");
  const locale = useLocale() as Locale;
  const entries = projects[locale];

  return (
    <section id="projects" className="scroll-mt-24 px-4 py-20">
      <div className="mx-auto max-w-[var(--content-max-width)]">
        <h2 className="mb-10 text-2xl font-semibold">{t("heading")}</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {entries.map((entry) => (
            <article
              key={entry.name}
              className={`rounded-md border border-border bg-surface p-5 ${entry.featured ? "sm:col-span-2" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-mono text-lg font-medium text-foreground">{entry.name}</h3>
                {entry.inDevelopment && (
                  <span className="shrink-0 rounded-full border border-accent px-2 py-0.5 text-xs font-mono text-accent">
                    {t("inDevelopmentBadge")}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{entry.tagline}</p>
              <p className="mt-3 text-sm text-foreground/90">{entry.description}</p>
              <p className="mt-3 text-sm text-foreground/90">
                <span className="font-medium text-foreground">{t("demonstratesLabel")}:</span> {entry.highlights}
              </p>
              <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">
                {t("stackLabel")}: {entry.stack}
              </p>
              <a
                href={entry.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm text-accent hover:underline"
              >
                <BrandIcon icon={siGithub} className="size-4" />
                {t("repoLinkLabel")}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
