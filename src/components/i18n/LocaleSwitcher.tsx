"use client";

import { useEffect } from "react";
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

type ScrollAnchor = { id: string; offset: number };

const SCROLL_ANCHOR_KEY = "locale-switch-scroll-anchor";

function captureScrollAnchor(): ScrollAnchor | null {
  const sections = document.querySelectorAll<HTMLElement>("section[id]");
  let current: ScrollAnchor | null = null;
  for (const section of sections) {
    const top = section.getBoundingClientRect().top;
    if (top > 150) break;
    current = { id: section.id, offset: top };
  }
  return current;
}

export function LocaleSwitcher() {
  const t = useTranslations("language");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let anchor: ScrollAnchor | null = null;
    try {
      const raw = sessionStorage.getItem(SCROLL_ANCHOR_KEY);
      if (raw) anchor = JSON.parse(raw) as ScrollAnchor;
    } catch {
      anchor = null;
    }
    if (!anchor) return;
    try {
      sessionStorage.removeItem(SCROLL_ANCHOR_KEY);
    } catch { }
    const el = document.getElementById(anchor.id);
    if (!el) return;
    const delta = el.getBoundingClientRect().top - anchor.offset;
    if (delta !== 0) {
      window.scrollBy({ top: delta, behavior: "instant" });
    }
  }, [locale]);

  function handleSelect(loc: Locale) {
    if (loc !== locale) {
      const anchor = captureScrollAnchor();
      try {
        if (anchor) sessionStorage.setItem(SCROLL_ANCHOR_KEY, JSON.stringify(anchor));
      } catch { }
    }
    router.replace(pathname, { locale: loc, scroll: false });
  }

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
            onClick={() => handleSelect(loc)}
            className={
              loc === locale
                ? "flex items-center rounded-md p-1"
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
