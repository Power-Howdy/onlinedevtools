import * as fs from "fs";
import * as path from "path";
import { TOOLS } from "../src/lib/tools";
import { CRON_PATTERNS } from "../src/data/cron-patterns";
import { REGEX_PATTERNS } from "../src/data/regex-patterns";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://onlinedevtools-three.vercel.app";

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatLastmod(d: Date): string {
  return d.toISOString().slice(0, 10);
}

const lastmod = formatLastmod(new Date());

const urlEntries: Array<{
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: number;
}> = [
  {
    loc: baseUrl,
    lastmod,
    changefreq: "weekly",
    priority: 1,
  },
  ...TOOLS.map((tool) => ({
    loc: `${baseUrl}/${tool.slug}`,
    lastmod,
    changefreq: "monthly",
    priority: 0.8,
  })),
  ...CRON_PATTERNS.map((p) => ({
    loc: `${baseUrl}/cron-explainer/${p.slug}`,
    lastmod,
    changefreq: "monthly",
    priority: 0.6,
  })),
  ...REGEX_PATTERNS.map((p) => ({
    loc: `${baseUrl}/regex/${p.slug}`,
    lastmod,
    changefreq: "monthly",
    priority: 0.6,
  })),
];

const urlsetEntries = urlEntries
  .map(
    (e) => `  <url>
    <loc>${escapeXml(e.loc)}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
  )
  .join("\n");

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsetEntries}
</urlset>
`;

const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;

const publicDir = path.join(process.cwd(), "public");
fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemapXml, "utf-8");
fs.writeFileSync(path.join(publicDir, "robots.txt"), robotsTxt, "utf-8");

console.log("Generated public/sitemap.xml and public/robots.txt");
