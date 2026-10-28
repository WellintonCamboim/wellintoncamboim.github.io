"use client";

import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LocaleSwitcher() {
  const t = useTranslations("language");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div role="group" aria-label={t("label")} className="flex items-center gap-1 text-sm">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          aria-current={loc === locale ? "true" : undefined}
          onClick={() => router.replace(pathname, { locale: loc })}
          className={
            loc === locale
              ? "rounded-md bg-accent px-2 py-1 text-accent-foreground"
              : "rounded-md px-2 py-1 text-muted-foreground hover:text-foreground"
          }
        >
          {t(loc)}
        </button>
      ))}
    </div>
  );
}
