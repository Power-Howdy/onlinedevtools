import { MetadataRoute } from "next";
import { TOOLS } from "@/lib/tools";
import { JSON_TO_LANG_LANGUAGES } from "@/data/json-to-lang";
import { CRON_PATTERNS } from "@/data/cron-patterns";
import { REGEX_PATTERNS } from "@/data/regex-patterns";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://onlinedevtools.com";

  const toolEntries: MetadataRoute.Sitemap = TOOLS.map((tool) => ({
    url: `${baseUrl}/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const jsonToLangEntries: MetadataRoute.Sitemap = JSON_TO_LANG_LANGUAGES.map((lang) => ({
    url: `${baseUrl}/json-to-${lang}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const cronExplainerEntries: MetadataRoute.Sitemap = CRON_PATTERNS.map((p) => ({
    url: `${baseUrl}/cron-explainer/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const regexEntries: MetadataRoute.Sitemap = REGEX_PATTERNS.map((p) => ({
    url: `${baseUrl}/regex/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    ...toolEntries,
    ...jsonToLangEntries,
    ...cronExplainerEntries,
    ...regexEntries,
  ];
}
