import { useTranslations } from "next-intl";
import { Mail } from "lucide-react";
import { siGithub } from "simple-icons";
import { BrandIcon } from "@/components/icons/BrandIcon";
import { TetrisCanvas } from "@/components/hero/TetrisCanvas";
import { linkedinIcon } from "@/components/icons/linkedin";
import { siteLinks } from "@/content/links";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col items-center justify-center gap-6 overflow-hidden px-4 pt-20 text-center"
    >
      <div className="absolute inset-0 z-0">
        <TetrisCanvas />
      </div>
      <div className="relative z-10 flex flex-col items-center gap-7">
        <p className="font-mono text-base font-medium tracking-wide text-accent sm:text-lg">
          {t("role")}
        </p>
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">{t("name")}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">{t("tagline")}</p>
        <div className="flex items-center gap-4">
          <a
            href={siteLinks.github}
            aria-label={t("githubLabel")}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-border p-2 hover:bg-surface"
          >
            <BrandIcon icon={siGithub} className="size-5" />
          </a>
          <a
            href={siteLinks.linkedin}
            aria-label={t("linkedinLabel")}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-border p-2 hover:bg-surface"
          >
            <BrandIcon icon={linkedinIcon} className="size-5" />
          </a>
          <a
            href={`mailto:${siteLinks.email}`}
            aria-label={t("emailLabel")}
            className="rounded-md border border-border p-2 hover:bg-surface"
          >
            <Mail aria-hidden="true" className="size-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
