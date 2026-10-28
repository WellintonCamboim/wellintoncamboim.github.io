"use client";

import { useLocale, useTranslations } from "next-intl";
import { BR, ES, US } from "country-flag-icons/react/3x2";
import type { ComponentType } from "react";
import { routing, type Locale } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";

const flags: Record<
  Locale,
  ComponentType<{ className?: string; title?: string; "aria-hidden"?: boolean | "true" | "false" }>
> = {
  pt: BR,
  en: US,
  es: ES,
};

export function LocaleSwitcher() {
  const t = useTranslations("language");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div role="group" aria-label={t("label")} className="flex items-center gap-1 text-sm">
      {routing.locales.map((loc) => {
        const Flag = flags[loc];
        return (
          <button
            key={loc}
            type="button"
            title={t(loc)}
            aria-label={t(loc)}
            aria-current={loc === locale ? "true" : undefined}
            onClick={() => router.replace(pathname, { locale: loc })}
            className={
              loc === locale
                ? "flex items-center rounded-md p-1 ring-2 ring-accent ring-offset-1 ring-offset-background"
                : "flex items-center rounded-md p-1 opacity-70 hover:opacity-100"
            }
          >
            <Flag aria-hidden="true" className="h-4 w-5 shrink-0 rounded-[2px]" />
            <span className="sr-only">{t(loc)}</span>
          </button>
        );
      })}
    </div>
  );
}
