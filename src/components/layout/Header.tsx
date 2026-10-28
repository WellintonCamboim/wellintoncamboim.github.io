import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function Header() {
  const t = useTranslations("nav");
  const common = useTranslations("common");

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-foreground"
      >
        {t("skipToContent")}
      </a>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-[var(--content-max-width)] items-center justify-between gap-4 px-4 py-3">
          <a href="#top" className="font-mono text-sm font-medium text-foreground">
            {common("siteTitle")}
          </a>
          <nav className="hidden items-center gap-6 text-sm sm:flex">
            <a href="#about" className="text-muted-foreground hover:text-foreground">
              {t("about")}
            </a>
            <a href="#experience" className="text-muted-foreground hover:text-foreground">
              {t("experience")}
            </a>
            <a href="#education" className="text-muted-foreground hover:text-foreground">
              {t("education")}
            </a>
            <a href="#contact" className="text-muted-foreground hover:text-foreground">
              {t("contact")}
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>
    </>
  );
}
