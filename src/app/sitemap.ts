import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/links";
import { locales } from "@/i18n/routing";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${siteUrl}/${locale}/`,
    alternates: {
      languages: Object.fromEntries(locales.map((loc) => [loc, `${siteUrl}/${loc}/`])),
    },
  }));
}
