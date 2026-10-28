import { useTranslations } from "next-intl";

export function About() {
  const t = useTranslations("about");

  return (
    <section id="about" className="scroll-mt-24 px-4 py-20">
      <div className="mx-auto max-w-[var(--content-max-width)]">
        <h2 className="mb-6 text-2xl font-semibold">{t("heading")}</h2>
        <p className="max-w-3xl text-muted-foreground">{t("body")}</p>
      </div>
    </section>
  );
}
