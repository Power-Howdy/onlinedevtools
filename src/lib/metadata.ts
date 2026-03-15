import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://onlinedevtools-three.vercel.app";

export function toolMetadata(
  title: string,
  description: string,
  slug: string
): Metadata {
  const url = `${baseUrl}/${slug}`;
  return {
    title,
    description,
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
