import { NextResponse } from "next/server";

type OgMeta = {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  siteName?: string;
  [key: string]: string | undefined;
};

type OgSuccess = {
  ok: true;
  meta: OgMeta;
  warnings?: string[];
};

type OgError = {
  ok: false;
  error: string;
};

function normalizeUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  try {
    const hasProtocol = /^https?:\/\//i.test(trimmed);
    const url = new URL(hasProtocol ? trimmed : `https://${trimmed}`);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

function extractOgMeta(html: string, baseUrl: string): OgSuccess {
  const meta: OgMeta = {};
  const warnings: string[] = [];

  const metaTagRegex =
    /<meta\s+[^>]*(?:property|name)\s*=\s*"(og:[^"]+|twitter:[^"]+)"[^>]*>/gi;
  const contentRegex = /content\s*=\s*"([^"]*)"/i;

  const allTags: Record<string, string> = {};

  let match: RegExpExecArray | null;
  while ((match = metaTagRegex.exec(html)) !== null) {
    const fullTag = match[0];
    const propertyMatch =
      /(?:property|name)\s*=\s*"(og:[^"]+|twitter:[^"]+)"/i.exec(fullTag);
    const contentMatch = contentRegex.exec(fullTag);
    if (!propertyMatch || !contentMatch) continue;
    const key = propertyMatch[1].toLowerCase();
    const value = contentMatch[1].trim();
    if (!value) continue;
    allTags[key] = value;
  }

  const ogTitle = allTags["og:title"] ?? allTags["twitter:title"];
  const ogDescription =
    allTags["og:description"] ?? allTags["twitter:description"];
  const ogImage = allTags["og:image"] ?? allTags["twitter:image"];
  const ogUrl = allTags["og:url"];
  const ogSiteName = allTags["og:site_name"];

  if (ogTitle) meta.title = ogTitle;
  if (ogDescription) meta.description = ogDescription;
  if (ogImage) {
    try {
      const url = new URL(ogImage, baseUrl);
      meta.image = url.toString();
    } catch {
      meta.image = ogImage;
      warnings.push("og:image could not be resolved to an absolute URL.");
    }
  }
  if (ogUrl) {
    try {
      const url = new URL(ogUrl, baseUrl);
      meta.url = url.toString();
    } catch {
      meta.url = ogUrl;
    }
  }
  if (ogSiteName) meta.siteName = ogSiteName;

  Object.assign(meta, allTags);

  if (!Object.keys(allTags).length) {
    warnings.push("No Open Graph or Twitter Card meta tags were found.");
  }

  return { ok: true, meta, warnings: warnings.length ? warnings : undefined };
}

export async function GET(request: Request): Promise<NextResponse<OgSuccess | OgError>> {
  const { searchParams } = new URL(request.url);
  const urlParam = searchParams.get("url") ?? "";
  const normalized = normalizeUrl(urlParam);

  if (!normalized) {
    return NextResponse.json(
      { ok: false, error: "Please provide a valid http(s) URL." },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(normalized, {
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; OnlineDevTools-OG-Scraper/1.0; +https://onlinedevtools.com)",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: `Upstream server responded with status ${response.status}.`,
        },
        { status: 502 }
      );
    }

    const html = await response.text();
    const result = extractOgMeta(html, normalized);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching URL for OG scrape:", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Failed to fetch the URL. It might be blocking bots or not reachable from the server.",
      },
      { status: 500 }
    );
  }
}

