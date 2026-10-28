import { useTranslations } from "next-intl";
import { Mail } from "lucide-react";
import { siGithub } from "simple-icons";
import { BrandIcon } from "@/components/icons/BrandIcon";
import { linkedinIcon } from "@/components/icons/linkedin";
import { siteLinks } from "@/content/links";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section
      id="top"
      className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 pt-20 text-center"
    >
      <p className="font-mono text-sm text-accent">{t("role")}</p>
      <h1 className="text-4xl font-bold sm:text-5xl">{t("name")}</h1>
      <p className="max-w-2xl text-muted-foreground">{t("tagline")}</p>
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
    </section>
  );
}
