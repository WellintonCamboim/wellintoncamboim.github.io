import { BookOpen, FileText, GraduationCap, Lightbulb, Scale, ShieldCheck, Users, Workflow } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { workingTraits, type WorkingTraitId } from "@/content/working-style";
import type { Locale } from "@/i18n/routing";

const traitIcon: Record<WorkingTraitId, typeof Lightbulb> = {
  proactivity: Lightbulb,
  communication: FileText,
  collaboration: Users,
  ownership: Workflow,
  security: ShieldCheck,
  honesty: Scale,
  learning: GraduationCap,
  teaching: BookOpen,
};

export function WorkingStyle() {
  const t = useTranslations("workingStyle");
  const locale = useLocale() as Locale;
  const traits = workingTraits[locale];

  return (
    <section id="working-style" className="scroll-mt-24 px-4 py-20">
      <div className="mx-auto max-w-[var(--content-max-width)]">
        <h2 className="mb-10 text-2xl font-semibold">{t("heading")}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {traits.map((trait) => {
            const Icon = traitIcon[trait.id];
            return (
              <div key={trait.id} className="rounded-md border border-border bg-surface p-5">
                <div className="flex items-center gap-2">
                  <Icon aria-hidden="true" className="size-4 shrink-0 text-accent" />
                  <h3 className="font-mono text-base font-medium text-foreground">{trait.title}</h3>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{trait.evidence}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
