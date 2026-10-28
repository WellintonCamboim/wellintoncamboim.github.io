import { getTranslations, setRequestLocale } from "next-intl/server";
import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");

  return (
    <main
      id="main-content"
      className="flex min-h-screen flex-col items-center justify-center gap-6 p-8"
    >
      <div className="flex items-center gap-4">
        <LocaleSwitcher />
        <ThemeToggle />
      </div>
      <p className="text-center text-muted-foreground">{t("placeholder")}</p>
    </main>
  );
}
