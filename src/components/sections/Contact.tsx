import { useTranslations } from "next-intl";
import { Mail, MapPin } from "lucide-react";
import { siGithub } from "simple-icons";
import { BrandIcon } from "@/components/icons/BrandIcon";
import { linkedinIcon } from "@/components/icons/linkedin";
import { siteLinks } from "@/content/links";

export function Contact() {
  const t = useTranslations("contact");

  return (
    <section id="contact" className="scroll-mt-24 px-4 py-20">
      <div className="mx-auto max-w-[var(--content-max-width)]">
        <h2 className="mb-4 text-2xl font-semibold">{t("heading")}</h2>
        <p className="mb-6 max-w-2xl text-muted-foreground">{t("intro")}</p>
        <dl className="flex flex-col gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Mail aria-hidden="true" className="size-4 text-accent" />
            <dt className="sr-only">{t("emailLabel")}</dt>
            <dd>
              <a href={`mailto:${siteLinks.email}`} className="hover:text-accent">
                {siteLinks.email}
              </a>
            </dd>
          </div>
          <div className="flex items-center gap-2">
            <BrandIcon icon={linkedinIcon} className="size-4 text-accent" />
            <dt className="sr-only">{t("linkedinLabel")}</dt>
            <dd>
              <a
                href={siteLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hover:text-accent"
              >
                {siteLinks.linkedin.replace("https://", "")}
              </a>
            </dd>
          </div>
          <div className="flex items-center gap-2">
            <BrandIcon icon={siGithub} className="size-4 text-accent" />
            <dt className="sr-only">{t("githubLabel")}</dt>
            <dd>
              <a
                href={siteLinks.github}
                target="_blank"
                rel="noreferrer"
                className="hover:text-accent"
              >
                {siteLinks.github.replace("https://", "")}
              </a>
            </dd>
          </div>
          <div className="flex items-center gap-2">
            <MapPin aria-hidden="true" className="size-4 text-accent" />
            <dt className="sr-only">{t("locationLabel")}</dt>
            <dd>{t("location")}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
