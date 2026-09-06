export type SeoSeverity = "error" | "warning" | "info" | "pass";

export type SeoCheck = {
  id: string;
  severity: SeoSeverity;
  title: string;
  detail: string;
};

export type RedirectHop = {
  url: string;
  status: number;
  statusText?: string;
  location?: string;
};

export type ImageProbe = {
  url: string;
  reachable: boolean;
  status?: number;
  contentType?: string;
  byteSize?: number;
  width?: number;
  height?: number;
  aspectRatio?: string;
  aspectValue?: number;
  format?: string;
  alt?: string;
  error?: string;
};

export type SocialPreview = {
  title: string;
  description: string;
  image?: string;
  url: string;
  domain: string;
  siteName?: string;
  favicon?: string;
  twitterCard: string;
};

export type OgDebugSuccess = {
  ok: true;
  requestedUrl: string;
  finalUrl: string;
  fetchedAt: string;
  timingMs: number;
  status: number;
  statusText: string;
  contentType?: string;
  redirectChain: RedirectHop[];
  htmlTitle?: string;
  htmlDescription?: string;
  canonical?: string;
  favicon?: string;
  robots?: string;
  tags: Record<string, string>;
  extraImages: string[];
  image?: ImageProbe;
  preview: SocialPreview;
  checks: SeoCheck[];
};

export type OgDebugError = {
  ok: false;
  error: string;
};

export type OgDebugResponse = OgDebugSuccess | OgDebugError;

export type ParsedDocument = {
  htmlTitle?: string;
  htmlDescription?: string;
  canonical?: string;
  favicon?: string;
  robots?: string;
  tags: Record<string, string>;
  extraImages: string[];
};

const META_NAME_RE =
  /^(og|twitter|article|music|video|book|profile|fb|al):/i;

const KNOWN_RATIOS: Array<{ value: number; label: string }> = [
  { value: 1.91, label: "1.91:1" },
  { value: 2, label: "2:1" },
  { value: 16 / 9, label: "16:9" },
  { value: 4 / 3, label: "4:3" },
  { value: 1, label: "1:1" },
  { value: 3 / 2, label: "3:2" },
  { value: 21 / 9, label: "21:9" },
];

export function normalizeHttpUrl(input: string): string | null {
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

export function isBlockedHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (
    host === "localhost" ||
    host === "::1" ||
    host === "0.0.0.0" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host === "metadata.google.internal" ||
    host.endsWith(".internal")
  ) {
    return true;
  }

  const ipv4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4) {
    const [a, b] = [Number(ipv4[1]), Number(ipv4[2])];
    if (a === 0 || a === 10 || a === 127) return true;
    if (a === 169 && b === 254) return true;
    if (a === 192 && b === 168) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 100 && b >= 64 && b <= 127) return true;
  }

  return false;
}

export function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => {
      const code = parseInt(hex, 16);
      return Number.isFinite(code) ? String.fromCodePoint(code) : _;
    })
    .replace(/&#(\d+);/g, (_, dec: string) => {
      const code = Number(dec);
      return Number.isFinite(code) ? String.fromCodePoint(code) : _;
    });
}

export function resolveUrl(href: string, baseUrl: string): string {
  try {
    return new URL(href, baseUrl).toString();
  } catch {
    return href;
  }
}

function stripNoise(html: string): string {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");
}

function extractHead(html: string): string {
  const lower = html.toLowerCase();
  const start = lower.indexOf("<head");
  const end = lower.indexOf("</head>");
  if (start !== -1 && end !== -1 && end > start) {
    return html.slice(start, end + 7);
  }
  return html.slice(0, 400_000);
}

export function parseTagAttributes(tag: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const re =
    /([a-zA-Z_:][a-zA-Z0-9_:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(tag)) !== null) {
    attrs[match[1].toLowerCase()] = decodeHtmlEntities(
      (match[2] ?? match[3] ?? match[4] ?? "").trim()
    );
  }
  return attrs;
}

function isUsableIconHref(href: string): boolean {
  const trimmed = href.trim();
  if (!trimmed) return false;
  if (/^data:,\s*$/i.test(trimmed)) return false;
  return true;
}

function firstNonEmpty(...values: Array<string | undefined>): string | undefined {
  for (const value of values) {
    if (value && value.trim()) return value.trim();
  }
  return undefined;
}

export function parseDocument(html: string, baseUrl: string): ParsedDocument {
  const head = stripNoise(extractHead(html));
  const tags: Record<string, string> = {};
  const extraImages: string[] = [];
  let htmlTitle: string | undefined;
  let htmlDescription: string | undefined;
  let canonical: string | undefined;
  let favicon: string | undefined;
  let appleIcon: string | undefined;
  let robots: string | undefined;

  const titleMatch = /<title\b[^>]*>([\s\S]*?)<\/title>/i.exec(head);
  if (titleMatch) {
    htmlTitle = decodeHtmlEntities(titleMatch[1].replace(/\s+/g, " ").trim());
  }

  const metaRe = /<meta\b[^>]*>/gi;
  let metaMatch: RegExpExecArray | null;
  while ((metaMatch = metaRe.exec(head)) !== null) {
    const attrs = parseTagAttributes(metaMatch[0]);
    const key = (attrs.property || attrs.name || attrs.itemprop || "").trim();
    const content = (attrs.content || "").trim();
    if (!key || !content) continue;
    const lower = key.toLowerCase();

    if (lower === "description") {
      htmlDescription = content;
      continue;
    }
    if (lower === "robots") {
      robots = content;
      continue;
    }
    if (META_NAME_RE.test(lower) && !tags[lower]) {
      tags[lower] = content;
    } else if (META_NAME_RE.test(lower) && lower === "og:image") {
      extraImages.push(content);
    }
  }

  const linkRe = /<link\b[^>]*>/gi;
  let linkMatch: RegExpExecArray | null;
  while ((linkMatch = linkRe.exec(head)) !== null) {
    const attrs = parseTagAttributes(linkMatch[0]);
    const rels = (attrs.rel || "").toLowerCase().split(/\s+/).filter(Boolean);
    const href = attrs.href;
    if (!href) continue;
    if (rels.includes("canonical") && !canonical) {
      canonical = resolveUrl(href, baseUrl);
    }
    if (rels.includes("apple-touch-icon") && !appleIcon && isUsableIconHref(href)) {
      appleIcon = resolveUrl(href, baseUrl);
    }
    if ((rels.includes("icon") || rels.includes("shortcut")) && !favicon && isUsableIconHref(href)) {
      favicon = resolveUrl(href, baseUrl);
    }
  }

  const imageCandidates = [
    tags["og:image"],
    tags["og:image:secure_url"],
    tags["og:image:url"],
    tags["twitter:image"],
    tags["twitter:image:src"],
    ...extraImages,
  ]
    .filter((value): value is string => Boolean(value))
    .map((value) => {
      try {
        return new URL(value, baseUrl).toString();
      } catch {
        return value;
      }
    });

  const uniqueImages = Array.from(new Set(imageCandidates));
  const primary = uniqueImages[0];
  if (primary) {
    tags["og:image"] = tags["og:image"]
      ? resolveUrl(tags["og:image"], baseUrl)
      : primary;
  }

  return {
    htmlTitle: htmlTitle || undefined,
    htmlDescription: htmlDescription || undefined,
    canonical,
    favicon: appleIcon || favicon,
    robots,
    tags,
    extraImages: uniqueImages.slice(1),
  };
}

function readUInt16LE(buf: Uint8Array, offset: number): number {
  return buf[offset]! | (buf[offset + 1]! << 8);
}

function readUInt16BE(buf: Uint8Array, offset: number): number {
  return (buf[offset]! << 8) | buf[offset + 1]!;
}

function readUInt32BE(buf: Uint8Array, offset: number): number {
  return (
    ((buf[offset]! << 24) |
      (buf[offset + 1]! << 16) |
      (buf[offset + 2]! << 8) |
      buf[offset + 3]!) >>>
    0
  );
}

function readInt32LE(buf: Uint8Array, offset: number): number {
  return (
    buf[offset]! |
    (buf[offset + 1]! << 8) |
    (buf[offset + 2]! << 16) |
    (buf[offset + 3]! << 24)
  );
}

function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y) {
    const next = x % y;
    x = y;
    y = next;
  }
  return x || 1;
}

export function formatAspectRatio(width: number, height: number): string {
  if (!width || !height) return "";
  const ratio = width / height;
  const known = KNOWN_RATIOS.find((item) => Math.abs(item.value - ratio) < 0.03);
  if (known) return known.label;
  const divisor = gcd(width, height);
  const rw = width / divisor;
  const rh = height / divisor;
  if (rw <= 30 && rh <= 30) return `${rw}:${rh}`;
  return `${ratio.toFixed(2)}:1`;
}

export function parseImageDimensions(
  buf: Uint8Array
): { width: number; height: number; format: string } | null {
  if (buf.length < 10) return null;

  if (
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47 &&
    buf.length >= 24
  ) {
    return {
      width: readUInt32BE(buf, 16),
      height: readUInt32BE(buf, 20),
      format: "png",
    };
  }

  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) {
    return {
      width: readUInt16LE(buf, 6),
      height: readUInt16LE(buf, 8),
      format: "gif",
    };
  }

  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let offset = 2;
    while (offset + 8 < buf.length) {
      if (buf[offset] !== 0xff) {
        offset += 1;
        continue;
      }
      let marker = buf[offset + 1]!;
      while (marker === 0xff && offset + 1 < buf.length) {
        offset += 1;
        marker = buf[offset + 1]!;
      }
      if (
        marker === 0xd8 ||
        marker === 0xd9 ||
        (marker >= 0xd0 && marker <= 0xd7) ||
        marker === 0x01
      ) {
        offset += 2;
        continue;
      }
      if (offset + 4 >= buf.length) break;
      const length = readUInt16BE(buf, offset + 2);
      const isSof =
        marker >= 0xc0 &&
        marker <= 0xcf &&
        marker !== 0xc4 &&
        marker !== 0xc8 &&
        marker !== 0xcc;
      if (isSof && offset + 8 < buf.length) {
        return {
          width: readUInt16BE(buf, offset + 7),
          height: readUInt16BE(buf, offset + 5),
          format: "jpeg",
        };
      }
      offset += 2 + length;
    }
  }

  if (
    buf.length >= 30 &&
    buf[0] === 0x52 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x46 &&
    buf[8] === 0x57 &&
    buf[9] === 0x45 &&
    buf[10] === 0x42 &&
    buf[11] === 0x50
  ) {
    const fourcc = String.fromCharCode(
      buf[12]!,
      buf[13]!,
      buf[14]!,
      buf[15]!
    );
    if (fourcc === "VP8 " && buf.length >= 30) {
      return {
        width: readUInt16LE(buf, 26) & 0x3fff,
        height: readUInt16LE(buf, 28) & 0x3fff,
        format: "webp",
      };
    }
    if (fourcc === "VP8L" && buf.length >= 25) {
      const bits =
        buf[21]! | (buf[22]! << 8) | (buf[23]! << 16) | (buf[24]! << 24);
      return {
        width: (bits & 0x3fff) + 1,
        height: ((bits >> 14) & 0x3fff) + 1,
        format: "webp",
      };
    }
    if (fourcc === "VP8X" && buf.length >= 30) {
      return {
        width: 1 + buf[24]! + (buf[25]! << 8) + (buf[26]! << 16),
        height: 1 + buf[27]! + (buf[28]! << 8) + (buf[29]! << 16),
        format: "webp",
      };
    }
  }

  if (buf[0] === 0x42 && buf[1] === 0x4d && buf.length >= 26) {
    return {
      width: readInt32LE(buf, 18),
      height: Math.abs(readInt32LE(buf, 22)),
      format: "bmp",
    };
  }

  const asText = new TextDecoder("utf-8", { fatal: false }).decode(
    buf.subarray(0, Math.min(buf.length, 2048))
  );
  if (/<svg\b/i.test(asText)) {
    const viewBox = /viewBox\s*=\s*["']?\s*[\d.-]+\s+[\d.-]+\s+([\d.]+)\s+([\d.]+)/i.exec(
      asText
    );
    const width = /(?:\s|^)width\s*=\s*["']?([\d.]+)/i.exec(asText);
    const height = /(?:\s|^)height\s*=\s*["']?([\d.]+)/i.exec(asText);
    const w = Number(width?.[1] ?? viewBox?.[1]);
    const h = Number(height?.[1] ?? viewBox?.[2]);
    if (w && h) return { width: Math.round(w), height: Math.round(h), format: "svg" };
    return { width: 0, height: 0, format: "svg" };
  }

  return null;
}

export function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function buildPreview(
  doc: ParsedDocument,
  finalUrl: string
): SocialPreview {
  const { tags } = doc;
  const title =
    firstNonEmpty(tags["og:title"], tags["twitter:title"], doc.htmlTitle) ??
    "No title found";
  const description =
    firstNonEmpty(
      tags["og:description"],
      tags["twitter:description"],
      doc.htmlDescription
    ) ?? "";
  const image = firstNonEmpty(
    tags["og:image"],
    tags["og:image:secure_url"],
    tags["twitter:image"],
    tags["twitter:image:src"]
  );
  const url =
    firstNonEmpty(tags["og:url"], doc.canonical, finalUrl) ?? finalUrl;
  const twitterCard = (
    tags["twitter:card"] ||
    (image ? "summary_large_image" : "summary")
  ).toLowerCase();

  return {
    title,
    description:
      description || "No description found for this URL.",
    image,
    url,
    domain: hostnameOf(url || finalUrl),
    siteName: firstNonEmpty(tags["og:site_name"], hostnameOf(finalUrl)),
    favicon: doc.favicon,
    twitterCard,
  };
}

export function buildImageProbe(input: {
  url: string;
  reachable: boolean;
  status?: number;
  contentType?: string;
  byteSize?: number;
  width?: number;
  height?: number;
  format?: string;
  alt?: string;
  error?: string;
}): ImageProbe {
  const width = input.width && input.width > 0 ? input.width : undefined;
  const height = input.height && input.height > 0 ? input.height : undefined;
  return {
    ...input,
    width,
    height,
    aspectRatio:
      width && height ? formatAspectRatio(width, height) : undefined,
    aspectValue: width && height ? width / height : undefined,
  };
}

function pass(id: string, title: string, detail: string): SeoCheck {
  return { id, severity: "pass", title, detail };
}

function error(id: string, title: string, detail: string): SeoCheck {
  return { id, severity: "error", title, detail };
}

function warn(id: string, title: string, detail: string): SeoCheck {
  return { id, severity: "warning", title, detail };
}

function info(id: string, title: string, detail: string): SeoCheck {
  return { id, severity: "info", title, detail };
}

export function buildChecks(input: {
  status: number;
  finalUrl: string;
  redirectChain: RedirectHop[];
  doc: ParsedDocument;
  preview: SocialPreview;
  image?: ImageProbe;
}): SeoCheck[] {
  const { status, finalUrl, redirectChain, doc, preview, image } = input;
  const { tags } = doc;
  const checks: SeoCheck[] = [];

  if (status >= 200 && status < 300) {
    checks.push(pass("http-status", "HTTP status is OK", `The page responded with ${status}.`));
  } else if (status >= 300 && status < 400) {
    checks.push(
      warn(
        "http-status",
        "Unexpected redirect status",
        `The final response status is ${status}. Social crawlers may not follow further hops.`
      )
    );
  } else {
    checks.push(
      error(
        "http-status",
        `HTTP ${status} from origin`,
        "Crawlers may refuse to generate a preview for an error page."
      )
    );
  }

  const hops = redirectChain.filter((hop) => hop.status >= 300 && hop.status < 400);
  if (hops.length === 0) {
    checks.push(pass("redirects", "No redirect chain", "The requested URL is the final document."));
  } else if (hops.length <= 2) {
    checks.push(
      info(
        "redirects",
        `${hops.length} redirect${hops.length === 1 ? "" : "s"} followed`,
        hops.map((hop) => `${hop.status} → ${hop.location ?? ""}`).join(" · ")
      )
    );
  } else {
    checks.push(
      warn(
        "redirects",
        "Long redirect chain",
        `${hops.length} hops. Facebook and X often follow only a few redirects.`
      )
    );
  }

  if (tags["og:title"]) {
    checks.push(pass("og-title", "og:title is set", tags["og:title"]));
  } else {
    checks.push(
      error(
        "og-title",
        "Missing og:title",
        preview.title && preview.title !== "No title found"
          ? `Falling back to "${preview.title}". Add <meta property="og:title">.`
          : "Add <meta property=\"og:title\"> so shares have a headline."
      )
    );
  }

  if (tags["og:description"]) {
    checks.push(pass("og-description", "og:description is set", tags["og:description"]));
  } else {
    checks.push(
      error(
        "og-description",
        "Missing og:description",
        "Add <meta property=\"og:description\">. Facebook and LinkedIn use this for the snippet."
      )
    );
  }

  if (tags["og:image"] || tags["twitter:image"]) {
    checks.push(
      pass(
        "og-image",
        "Share image is set",
        tags["og:image"] || tags["twitter:image"] || preview.image || ""
      )
    );
  } else {
    checks.push(
      error(
        "og-image",
        "Missing og:image",
        "Without an image, Facebook, LinkedIn, and Discord show a blank or generic card."
      )
    );
  }

  if (tags["og:url"]) {
    checks.push(pass("og-url", "og:url is set", tags["og:url"]));
  } else {
    checks.push(
      warn(
        "og-url",
        "Missing og:url",
        "Recommended. og:url tells crawlers the canonical share URL."
      )
    );
  }

  if (tags["og:type"]) {
    checks.push(pass("og-type", "og:type is set", tags["og:type"]));
  } else {
    checks.push(
      warn(
        "og-type",
        "Missing og:type",
        'Recommended value is "website" (or "article" for posts).'
      )
    );
  }

  if (tags["og:site_name"]) {
    checks.push(pass("og-site-name", "og:site_name is set", tags["og:site_name"]));
  } else {
    checks.push(
      info(
        "og-site-name",
        "Missing og:site_name",
        "Slack and some Facebook placements show the site name."
      )
    );
  }

  if (tags["twitter:card"]) {
    const card = tags["twitter:card"].toLowerCase();
    if (
      card === "summary" ||
      card === "summary_large_image" ||
      card === "app" ||
      card === "player"
    ) {
      checks.push(pass("twitter-card", "twitter:card is set", tags["twitter:card"]));
    } else {
      checks.push(
        warn(
          "twitter-card",
          "Unknown twitter:card value",
          `Got "${tags["twitter:card"]}". Use summary or summary_large_image.`
        )
      );
    }
  } else {
    checks.push(
      warn(
        "twitter-card",
        "Missing twitter:card",
        "X falls back to Open Graph, but twitter:card should be set explicitly."
      )
    );
  }

  if (tags["twitter:title"] || tags["og:title"]) {
    checks.push(
      pass(
        "twitter-title",
        "Twitter title available",
        tags["twitter:title"] || `Falls back to og:title: ${tags["og:title"]}`
      )
    );
  } else {
    checks.push(warn("twitter-title", "Missing Twitter title", "Add twitter:title or og:title."));
  }

  if (doc.canonical) {
    checks.push(pass("canonical", "Canonical URL is set", doc.canonical));
    if (tags["og:url"]) {
      try {
        const a = new URL(doc.canonical);
        const b = new URL(tags["og:url"], finalUrl);
        if (a.href !== b.href) {
          checks.push(
            warn(
              "canonical-mismatch",
              "Canonical and og:url differ",
              `${doc.canonical} vs ${b.href}`
            )
          );
        } else {
          checks.push(
            pass("canonical-mismatch", "Canonical matches og:url", doc.canonical)
          );
        }
      } catch {
        checks.push(
          warn("canonical-mismatch", "Could not compare canonical and og:url", "")
        );
      }
    }
  } else {
    checks.push(
      warn(
        "canonical",
        "Missing canonical URL",
        "Add <link rel=\"canonical\"> to avoid duplicate-URL previews."
      )
    );
  }

  if (doc.favicon) {
    checks.push(pass("favicon", "Favicon found", doc.favicon));
  } else {
    checks.push(
      warn(
        "favicon",
        "No favicon link",
        "Slack and some Discord embeds show the favicon next to the site name. Browsers may still request /favicon.ico."
      )
    );
  }

  if (doc.htmlTitle) {
    checks.push(pass("html-title", "HTML title is set", doc.htmlTitle));
  } else {
    checks.push(warn("html-title", "Missing <title>", "Search engines and some crawlers use the document title."));
  }

  if (doc.htmlDescription) {
    checks.push(pass("meta-description", "Meta description is set", doc.htmlDescription));
  } else {
    checks.push(
      info(
        "meta-description",
        "Missing meta description",
        "Not required for social cards if og:description exists, but useful for SEO."
      )
    );
  }

  const titleLen = preview.title.length;
  if (titleLen > 90) {
    checks.push(
      warn(
        "title-length",
        "Title may be truncated",
        `${titleLen} characters. Facebook often cuts around 60–80 characters.`
      )
    );
  } else if (titleLen > 0 && preview.title !== "No title found") {
    checks.push(
      pass("title-length", "Title length looks fine", `${titleLen} characters.`)
    );
  }

  const descLen = preview.description.length;
  if (descLen > 300) {
    checks.push(
      warn(
        "description-length",
        "Description may be truncated",
        `${descLen} characters. Most platforms show about 100–200.`
      )
    );
  } else if (preview.description && preview.description !== "No description found for this URL.") {
    checks.push(
      pass("description-length", "Description length looks fine", `${descLen} characters.`)
    );
  }

  const imageAlt = firstNonEmpty(tags["og:image:alt"], tags["twitter:image:alt"]);
  if (preview.image) {
    if (imageAlt) {
      checks.push(pass("image-alt", "Image alt text is set", imageAlt));
    } else {
      checks.push(
        warn(
          "image-alt",
          "Missing image alt text",
          "Add og:image:alt (and twitter:image:alt) so the share image has an accessible description."
        )
      );
    }

    if (preview.image.startsWith("http://") && finalUrl.startsWith("https://")) {
      checks.push(
        warn(
          "image-https",
          "Share image is not HTTPS",
          "Mixed-content images can be blocked by crawlers and browsers."
        )
      );
    } else if (preview.image.startsWith("https://")) {
      checks.push(pass("image-https", "Share image uses HTTPS", preview.image));
    }
  }

  if (image) {
    if (!image.reachable) {
      checks.push(
        error(
          "image-reachable",
          "Share image could not be fetched",
          image.error || "The image URL did not return a usable image."
        )
      );
    } else {
      checks.push(
        pass(
          "image-reachable",
          "Share image is reachable",
          image.status ? `HTTP ${image.status}` : "Fetched successfully."
        )
      );
    }

    if (image.width && image.height) {
      if (image.width < 200 || image.height < 200) {
        checks.push(
          error(
            "image-too-small",
            "Your OG image is too small",
            `Facebook requires at least 200×200. This image is ${image.width}×${image.height}. Use 1200×630 for best results.`
          )
        );
      } else if (image.width < 600 || image.height < 315) {
        checks.push(
          warn(
            "image-too-small",
            "Your OG image is too small",
            `This image is ${image.width}×${image.height}. Facebook recommends at least 600×315, and 1200×630 for large link previews.`
          )
        );
      } else if (image.width < 1200 || image.height < 630) {
        checks.push(
          warn(
            "image-recommended-size",
            "OG image is smaller than recommended",
            `This image is ${image.width}×${image.height}. 1200×630 (1.91:1) is the usual recommendation for Facebook, LinkedIn, and X.`
          )
        );
      } else {
        checks.push(
          pass(
            "image-recommended-size",
            "Image meets the recommended size",
            `${image.width}×${image.height}${image.aspectRatio ? ` · ${image.aspectRatio}` : ""}`
          )
        );
      }

      if (image.aspectValue) {
        const delta = Math.abs(image.aspectValue - 1.91);
        if (delta > 0.25 && (image.width >= 200 || image.height >= 200)) {
          checks.push(
            warn(
              "image-aspect",
              "Image aspect ratio is off 1.91:1",
              `Detected ${image.aspectRatio ?? image.aspectValue.toFixed(2)}. Facebook, LinkedIn, and large X cards crop to about 1.91:1.`
            )
          );
        } else {
          checks.push(
            pass(
              "image-aspect",
              "Image aspect ratio looks good",
              image.aspectRatio || image.aspectValue.toFixed(2)
            )
          );
        }
      }

      const declaredW = Number(tags["og:image:width"]);
      const declaredH = Number(tags["og:image:height"]);
      if (declaredW && declaredH && (declaredW !== image.width || declaredH !== image.height)) {
        checks.push(
          warn(
            "image-declared-size",
            "og:image width/height do not match the file",
            `Tags say ${declaredW}×${declaredH}, file is ${image.width}×${image.height}.`
          )
        );
      }
    } else if (image.reachable) {
      checks.push(
        info(
          "image-dimensions",
          "Could not read image dimensions",
          "The file was fetched, but width and height were not in the header."
        )
      );
    }

    if (image.byteSize && image.byteSize > 8 * 1024 * 1024) {
      checks.push(
        warn(
          "image-filesize",
          "Share image is larger than 8 MB",
          `${formatBytes(image.byteSize)}. Facebook may reject very large images.`
        )
      );
    }
  }

  if (!Object.keys(tags).length) {
    checks.push(
      error(
        "no-social-tags",
        "No Open Graph or Twitter Card tags",
        "The page has no og:* or twitter:* meta tags. Social apps will guess from the HTML title and description."
      )
    );
  }

  return checks;
}

export function scoreChecks(checks: SeoCheck[]): {
  score: number;
  passed: number;
  errors: number;
  warnings: number;
} {
  const passed = checks.filter((check) => check.severity === "pass").length;
  const errors = checks.filter((check) => check.severity === "error").length;
  const warnings = checks.filter((check) => check.severity === "warning").length;
  const total = passed + errors + warnings;
  return {
    score: total ? Math.round((passed / total) * 100) : 0,
    passed,
    errors,
    warnings,
  };
}

export function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function buildRecommendedMetaHtml(result: OgDebugSuccess): string {
  const { preview, tags, canonical, htmlTitle, htmlDescription, image } = result;
  const title = tags["og:title"] || preview.title;
  const description =
    tags["og:description"] ||
    (preview.description !== "No description found for this URL."
      ? preview.description
      : "");
  const url = tags["og:url"] || canonical || preview.url;
  const imageUrl = tags["og:image"] || preview.image || "";
  const card =
    tags["twitter:card"] ||
    (imageUrl ? "summary_large_image" : "summary");
  const width = image?.width ?? tags["og:image:width"];
  const height = image?.height ?? tags["og:image:height"];
  const alt = tags["og:image:alt"] || tags["twitter:image:alt"] || title;

  const lines = [
    "<!-- Primary -->",
    `<title>${escapeAttr(htmlTitle || title)}</title>`,
    description
      ? `<meta name="description" content="${escapeAttr(htmlDescription || description)}" />`
      : `<meta name="description" content="" />`,
    url ? `<link rel="canonical" href="${escapeAttr(url)}" />` : "",
    "",
    "<!-- Open Graph -->",
    `<meta property="og:type" content="${escapeAttr(tags["og:type"] || "website")}" />`,
    `<meta property="og:title" content="${escapeAttr(title)}" />`,
    description
      ? `<meta property="og:description" content="${escapeAttr(description)}" />`
      : `<meta property="og:description" content="" />`,
    url ? `<meta property="og:url" content="${escapeAttr(url)}" />` : "",
    tags["og:site_name"] || preview.siteName
      ? `<meta property="og:site_name" content="${escapeAttr(tags["og:site_name"] || preview.siteName || "")}" />`
      : "",
    imageUrl ? `<meta property="og:image" content="${escapeAttr(imageUrl)}" />` : "",
    width ? `<meta property="og:image:width" content="${escapeAttr(String(width))}" />` : "",
    height ? `<meta property="og:image:height" content="${escapeAttr(String(height))}" />` : "",
    imageUrl ? `<meta property="og:image:alt" content="${escapeAttr(alt)}" />` : "",
    "",
    "<!-- Twitter / X -->",
    `<meta name="twitter:card" content="${escapeAttr(card)}" />`,
    `<meta name="twitter:title" content="${escapeAttr(tags["twitter:title"] || title)}" />`,
    description
      ? `<meta name="twitter:description" content="${escapeAttr(tags["twitter:description"] || description)}" />`
      : "",
    imageUrl
      ? `<meta name="twitter:image" content="${escapeAttr(tags["twitter:image"] || imageUrl)}" />`
      : "",
    alt ? `<meta name="twitter:image:alt" content="${escapeAttr(tags["twitter:image:alt"] || alt)}" />` : "",
  ];

  return lines.filter((line) => line !== "").join("\n");
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function buildReportMarkdown(result: OgDebugSuccess): string {
  const score = scoreChecks(result.checks);
  const image = result.image;
  const lines = [
    `# Social Preview / SEO Report`,
    ``,
    `- Requested URL: ${result.requestedUrl}`,
    `- Final URL: ${result.finalUrl}`,
    `- Fetched: ${result.fetchedAt}`,
    `- HTTP: ${result.status} ${result.statusText}`.trim(),
    `- Time: ${result.timingMs} ms`,
    `- Score: ${score.score}/100 (${score.passed} passed, ${score.warnings} warnings, ${score.errors} errors)`,
    ``,
    `## Preview`,
    ``,
    `- Title: ${result.preview.title}`,
    `- Description: ${result.preview.description}`,
    `- Image: ${result.preview.image || "(none)"}`,
    `- Canonical: ${result.canonical || "(none)"}`,
    `- Favicon: ${result.favicon || "(none)"}`,
    `- Twitter card: ${result.preview.twitterCard}`,
    ``,
    `## Redirect chain`,
    ``,
    ...(result.redirectChain.length
      ? result.redirectChain.map(
          (hop, index) =>
            `${index + 1}. ${hop.status} ${hop.url}${hop.location ? ` → ${hop.location}` : ""}`
        )
      : ["(none)"]),
    ``,
    `## Image`,
    ``,
    image
      ? [
          `- URL: ${image.url}`,
          `- Reachable: ${image.reachable ? "yes" : "no"}`,
          image.width && image.height
            ? `- Dimensions: ${image.width}×${image.height} (${image.aspectRatio ?? "unknown ratio"})`
            : "- Dimensions: unknown",
          image.format ? `- Format: ${image.format}` : "",
          image.byteSize ? `- Size: ${formatBytes(image.byteSize)}` : "",
          image.alt ? `- Alt: ${image.alt}` : "- Alt: (missing)",
          image.error ? `- Error: ${image.error}` : "",
        ]
          .filter(Boolean)
          .join("\n")
      : "(no image)",
    ``,
    `## Checks`,
    ``,
    ...result.checks.map(
      (check) =>
        `- [${check.severity === "pass" ? "x" : " "}] ${check.severity.toUpperCase()} ${check.title}${check.detail ? ` — ${check.detail}` : ""}`
    ),
    ``,
    `## Tags`,
    ``,
    ...Object.entries(result.tags).map(([key, value]) => `- ${key}: ${value}`),
    ``,
    `## Recommended meta tags`,
    ``,
    "```html",
    buildRecommendedMetaHtml(result),
    "```",
    ``,
  ];

  return lines.join("\n");
}

export function suggestedFilename(url: string, ext: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return `social-preview-${host}.${ext}`;
  } catch {
    return `social-preview-report.${ext}`;
  }
}
