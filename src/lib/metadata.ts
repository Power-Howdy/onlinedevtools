import type { Metadata } from "next";
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_OG_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/site";
import { TOOLS } from "@/lib/tools";

const baseUrl = SITE_URL;

/** Extra keywords merged onto every tool page (keep short and on-topic). */
const TOOL_PAGE_SITE_KEYWORDS = [
  "free developer utilities",
  "online developer tools",
  "no signup",
  "browser based",
  SITE_NAME.toLowerCase(),
];

export function getHomeMetadata(): Metadata {
  return {
    title: {
      absolute: SITE_TITLE,
    },
    description: SITE_DESCRIPTION,
    keywords: SITE_KEYWORDS,
    robots: { index: true, follow: true },
    openGraph: {
      title: SITE_TITLE,
      description: SITE_OG_DESCRIPTION,
      url: baseUrl,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
      images: [
        {
          url: "/assets/image.png",
          alt: `${SITE_NAME} – free developer utilities, no sign-up`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_TITLE,
      description: SITE_OG_DESCRIPTION,
      images: ["/assets/image.png"],
    },
    alternates: {
      canonical: baseUrl,
    },
  };
}

export function getToolMetadata(slug: string): Metadata {
  const tool = TOOLS.find((t) => t.slug === slug);
  if (!tool) return {};
  return toolMetadata(
    tool.seoTitle ?? tool.title,
    tool.seoDescription ?? tool.description,
    slug,
    tool.keywords
  );
}

export function getToolOgImageUrl(slug: string): string {
  return `${baseUrl}/api/og/tools/${slug}`;
}

export function toolMetadata(
  title: string,
  description: string,
  slug: string,
  keywords?: string[]
): Metadata {
  const url = `${baseUrl}/${slug}`;
  const ogImageUrl = getToolOgImageUrl(slug);
  const allKeywords = [...(keywords ?? []), ...TOOL_PAGE_SITE_KEYWORDS];
  return {
    title,
    description,
    keywords: allKeywords,
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      images: [{ url: ogImageUrl, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: url,
    },
  };
}
