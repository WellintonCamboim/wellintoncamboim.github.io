import { useTranslations } from "next-intl";
import { siteLinks } from "@/content/links";

export function Footer() {
  const t = useTranslations("footer");
  const contact = useTranslations("contact");

  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto flex max-w-[var(--content-max-width)] flex-col items-center gap-3 px-4 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <p>{t("rights", { year: new Date().getFullYear() })}</p>
        <div className="flex gap-4">
          <a href={`mailto:${siteLinks.email}`} className="hover:text-foreground">
            {contact("emailLabel")}
          </a>
          <a
            href={siteLinks.linkedin}
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground"
          >
            {contact("linkedinLabel")}
          </a>
          <a
            href={siteLinks.github}
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground"
          >
            {contact("githubLabel")}
          </a>
        </div>
      </div>
    </footer>
  );
}
