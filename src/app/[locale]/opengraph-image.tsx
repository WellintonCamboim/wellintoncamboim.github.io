import { getTranslations } from "next-intl/server";
import { ImageResponse } from "next/og";
import { routing } from "@/i18n/routing";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

// Unlike page.tsx, an image metadata file under a dynamic segment doesn't
// inherit the layout's generateStaticParams — output: export needs its own.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Generated from the site's own copy (hero name/role/tagline) and theme
// colors — no photo, same reasoning as icon.tsx (see docs/decisions.md).
export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "96px",
        background: "#0b0e11",
      }}
    >
      <div style={{ display: "flex", fontSize: 30, color: "#39d2c0" }}>{t("role")}</div>
      <div
        style={{
          display: "flex",
          fontSize: 76,
          fontWeight: 700,
          color: "#e6e8eb",
          marginTop: 28,
        }}
      >
        {t("name")}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 32,
          color: "#9aa3ac",
          marginTop: 28,
          maxWidth: 920,
        }}
      >
        {t("tagline")}
      </div>
    </div>,
    { ...size },
  );
}
