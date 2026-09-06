import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/site";
import {
  buildChecks,
  buildImageProbe,
  buildPreview,
  isBlockedHost,
  normalizeHttpUrl,
  parseDocument,
  parseImageDimensions,
  resolveUrl,
  type ImageProbe,
  type OgDebugError,
  type OgDebugSuccess,
  type RedirectHop,
} from "@/lib/og-debug";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAGE_TIMEOUT_MS = 10_000;
const IMAGE_TIMEOUT_MS = 6_000;
const MAX_HTML_BYTES = 1_000_000;
const MAX_IMAGE_BYTES = 512_000;
const MAX_REDIRECTS = 8;

const PAGE_HEADERS = {
  Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
  "User-Agent": `Mozilla/5.0 (compatible; FreeDevTools-SEO-Debugger/1.0; +${SITE_URL})`,
};

async function assertSafeUrl(input: string): Promise<void> {
  const url = new URL(input);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Only http(s) URLs are allowed.");
  }
  const hostname = url.hostname.replace(/^\[|\]$/g, "");
  if (isBlockedHost(hostname)) {
    throw new Error("That host cannot be fetched.");
  }
  if (isIP(hostname)) return;
  try {
    const { address } = await lookup(hostname);
    if (isBlockedHost(address)) {
      throw new Error("That host cannot be fetched.");
    }
  } catch (error) {
    if (error instanceof Error && error.message === "That host cannot be fetched.") {
      throw error;
    }
  }
}

async function readLimited(response: Response, maxBytes: number): Promise<Uint8Array> {
  if (!response.body) {
    const buffer = new Uint8Array(await response.arrayBuffer());
    return buffer.subarray(0, maxBytes);
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;

  try {
    while (received < maxBytes) {
      const { done, value } = await reader.read();
      if (done || !value) break;
      chunks.push(value);
      received += value.length;
    }
  } finally {
    try {
      await reader.cancel();
    } catch {
      // ignore
    }
  }

  const out = new Uint8Array(Math.min(received, maxBytes));
  let offset = 0;
  for (const chunk of chunks) {
    const take = Math.min(chunk.length, out.length - offset);
    out.set(chunk.subarray(0, take), offset);
    offset += take;
    if (offset >= out.length) break;
  }
  return out;
}

function parseTotalSize(response: Response, downloaded: number): number | undefined {
  const contentRange = response.headers.get("content-range");
  const rangeTotal = contentRange?.match(/\/(\d+)\s*$/)?.[1];
  if (rangeTotal) return Number(rangeTotal);
  const contentLength = response.headers.get("content-length");
  if (contentLength && /^\d+$/.test(contentLength)) return Number(contentLength);
  if (downloaded > 0) return downloaded;
  return undefined;
}

async function fetchFollow(
  url: string,
  init: RequestInit
): Promise<{ response: Response; chain: RedirectHop[]; finalUrl: string }> {
  const chain: RedirectHop[] = [];
  let current = url;

  for (let hop = 0; hop < MAX_REDIRECTS; hop += 1) {
    await assertSafeUrl(current);
    const response = await fetch(current, { ...init, redirect: "manual" });
    const location = response.headers.get("location") ?? undefined;
    const opaque = response.type === "opaqueredirect" || response.status === 0;

    if (opaque) {
      const followed = await fetch(current, { ...init, redirect: "follow" });
      const finalUrl = followed.url || current;
      if (finalUrl !== current) {
        chain.push({
          url: current,
          status: 302,
          statusText: "Found",
          location: finalUrl,
        });
      }
      chain.push({
        url: finalUrl,
        status: followed.status,
        statusText: followed.statusText,
      });
      return { response: followed, chain, finalUrl };
    }

    chain.push({
      url: current,
      status: response.status,
      statusText: response.statusText,
      location,
    });

    if (response.status >= 300 && response.status < 400 && location) {
      current = resolveUrl(location, current);
      continue;
    }

    return { response, chain, finalUrl: current };
  }

  throw new Error(`Stopped after ${MAX_REDIRECTS} redirects.`);
}

async function probeImage(
  imageUrl: string,
  alt?: string
): Promise<ImageProbe> {
  try {
    await assertSafeUrl(imageUrl);
    const response = await fetch(imageUrl, {
      redirect: "follow",
      signal: AbortSignal.timeout(IMAGE_TIMEOUT_MS),
      headers: {
        Accept: "image/*,*/*;q=0.8",
        Range: `bytes=0-${MAX_IMAGE_BYTES - 1}`,
        "User-Agent": PAGE_HEADERS["User-Agent"],
      },
    });

    const bytes = await readLimited(response, MAX_IMAGE_BYTES);
    const parsed = parseImageDimensions(bytes);
    const contentType = response.headers.get("content-type") ?? undefined;

    return buildImageProbe({
      url: imageUrl,
      reachable: response.ok || response.status === 206,
      status: response.status,
      contentType,
      byteSize: parseTotalSize(response, bytes.byteLength),
      width: parsed?.width,
      height: parsed?.height,
      format: parsed?.format,
      alt,
      error:
        response.ok || response.status === 206
          ? undefined
          : `Image URL responded with ${response.status}.`,
    });
  } catch (error) {
    return buildImageProbe({
      url: imageUrl,
      reachable: false,
      alt,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch the share image.",
    });
  }
}

export async function GET(
  request: Request
): Promise<NextResponse<OgDebugSuccess | OgDebugError>> {
  const { searchParams } = new URL(request.url);
  const urlParam = searchParams.get("url") ?? "";
  const normalized = normalizeHttpUrl(urlParam);

  if (!normalized) {
    return NextResponse.json(
      { ok: false, error: "Please provide a valid http(s) URL." },
      { status: 400 }
    );
  }

  try {
    await assertSafeUrl(normalized);
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "That URL cannot be fetched.",
      },
      { status: 400 }
    );
  }

  const started = Date.now();

  try {
    const { response, chain, finalUrl } = await fetchFollow(normalized, {
      signal: AbortSignal.timeout(PAGE_TIMEOUT_MS),
      headers: PAGE_HEADERS,
    });

    const htmlBytes = await readLimited(response, MAX_HTML_BYTES);
    const html = new TextDecoder("utf-8", { fatal: false }).decode(htmlBytes);
    const looksLikeHtml = /<html[\s>]|<head[\s>]|<meta[\s>]/i.test(html);
    const contentType = response.headers.get("content-type") ?? undefined;

    if (!looksLikeHtml && contentType && !/html|xml|text\//i.test(contentType)) {
      return NextResponse.json(
        {
          ok: false,
          error: `The URL did not return HTML (got ${contentType}).`,
        },
        { status: 422 }
      );
    }

    const doc = parseDocument(html, finalUrl);
    const preview = buildPreview(doc, finalUrl);
    const declaredWidth = Number(doc.tags["og:image:width"]);
    const declaredHeight = Number(doc.tags["og:image:height"]);
    const imageAlt = doc.tags["og:image:alt"] || doc.tags["twitter:image:alt"];

    let image: ImageProbe | undefined;
    if (preview.image) {
      image = await probeImage(preview.image, imageAlt);
      if (!image.width && declaredWidth) image.width = declaredWidth;
      if (!image.height && declaredHeight) image.height = declaredHeight;
      if (image.width && image.height && !image.aspectRatio) {
        image = buildImageProbe(image);
      }
    }

    const result: OgDebugSuccess = {
      ok: true,
      requestedUrl: normalized,
      finalUrl,
      fetchedAt: new Date().toISOString(),
      timingMs: Date.now() - started,
      status: response.status,
      statusText: response.statusText,
      contentType,
      redirectChain: chain,
      htmlTitle: doc.htmlTitle,
      htmlDescription: doc.htmlDescription,
      canonical: doc.canonical,
      favicon: doc.favicon,
      robots: doc.robots,
      tags: doc.tags,
      extraImages: doc.extraImages,
      image,
      preview,
      checks: buildChecks({
        status: response.status,
        finalUrl,
        redirectChain: chain,
        doc,
        preview,
        image,
      }),
    };

    return NextResponse.json(result);
  } catch (error) {
    const aborted =
      error instanceof Error &&
      (error.name === "TimeoutError" || error.name === "AbortError");
    console.error("Error fetching URL for OG scrape:", error);
    return NextResponse.json(
      {
        ok: false,
        error: aborted
          ? "The request timed out. The site may be slow or blocking this server."
          : "Failed to fetch the URL. It might be blocking bots or not reachable from the server.",
      },
      { status: 500 }
    );
  }
}
