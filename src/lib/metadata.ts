import type { Metadata } from "next";
import { TOOLS } from "@/lib/tools";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://onlinedevtools-three.vercel.app";

/** Site-wide keywords added to every page (branding + discoverability). */
const SITE_KEYWORDS = [
  "free",
  "devtools",
  "online",
  "Severus Snape",
  "Full Stack Developer",
  "Javascript Developer",
  "Next.js Developer",
  "React Developer",
  "TypeScript Developer",
];

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

export function toolMetadata(
  title: string,
  description: string,
  slug: string,
  keywords?: string[]
): Metadata {
  const url = `${baseUrl}/${slug}`;
  const allKeywords = [...(keywords ?? []), ...SITE_KEYWORDS];
  return {
    title,
    description,
    keywords: allKeywords,
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: "Online Dev Tools",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}
