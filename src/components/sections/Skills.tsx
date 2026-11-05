import { useLocale, useTranslations } from "next-intl";
import { highlightSkills, secondarySkills, type HighlightCategoryId } from "@/content/skills";
import type { Locale } from "@/i18n/routing";

const categoryColor: Record<HighlightCategoryId, string> = {
  frontend: "text-skill-frontend border-skill-frontend",
  backend: "text-skill-backend border-skill-backend",
  cloud: "text-skill-cloud border-skill-cloud",
  ai: "text-accent border-accent",
  domain: "text-skill-domain border-skill-domain",
};

export function Skills() {
  const t = useTranslations("skills");
  const locale = useLocale() as Locale;
  const highlightGroups = highlightSkills[locale];
  const secondaryGroups = secondarySkills[locale];

  return (
    <section id="skills" className="scroll-mt-24 px-4 py-20">
      <div className="mx-auto max-w-[var(--content-max-width)]">
        <h2 className="mb-10 text-2xl font-semibold">{t("heading")}</h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {highlightGroups.map((group) => (
            <div
              key={group.id}
              className={`rounded-md border-t-2 border-border bg-surface p-5 ${categoryColor[group.id]}`}
            >
              <h3 className="font-mono text-base font-medium">{group.name}</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full border border-border px-3 py-1 text-sm text-foreground/90"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h3 className="mb-6 mt-14 text-lg font-medium text-foreground">{t("secondaryHeading")}</h3>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {secondaryGroups.map((group) => (
            <div key={group.id} className="rounded-md border border-border bg-surface p-5">
              <h4 className="font-mono text-sm font-medium text-muted-foreground">{group.name}</h4>
              <ul className="mt-3 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full border border-border px-3 py-1 text-sm text-foreground/90"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
