import { useLocale, useTranslations } from "next-intl";
import { education } from "@/content/profile";
import type { Locale } from "@/i18n/routing";

export function Education() {
  const t = useTranslations("education");
  const locale = useLocale() as Locale;
  const items = education[locale];

  return (
    <section id="education" className="scroll-mt-24 px-4 py-20">
      <div className="mx-auto max-w-[var(--content-max-width)]">
        <h2 className="mb-6 text-2xl font-semibold">{t("heading")}</h2>
        <ul className="space-y-3 text-muted-foreground">
          {items.map((item) => (
            <li key={item} className="border-l-2 border-border pl-4">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
