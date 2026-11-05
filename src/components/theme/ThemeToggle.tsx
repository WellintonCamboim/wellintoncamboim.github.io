"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

const subscribe = () => () => {};

function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

export function ThemeToggle() {
  const t = useTranslations("theme");
  const { resolvedTheme, setTheme } = useTheme();
  const hydrated = useHydrated();
  const isDark = hydrated && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-pressed={isDark}
      aria-label={isDark ? t("toggleToLight") : t("toggleToDark")}
      className="inline-flex size-9 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-surface"
    >
      {hydrated &&
        (isDark ? (
          <Sun aria-hidden="true" className="size-4" />
        ) : (
          <Moon aria-hidden="true" className="size-4" />
        ))}
    </button>
  );
}
