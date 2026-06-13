import { ImageResponse } from "next/og";
import {
  __iconNode as ArrowLeftRightIconNode,
} from "lucide-react/dist/esm/icons/arrow-left-right.js";
import { __iconNode as BarcodeIconNode } from "lucide-react/dist/esm/icons/barcode.js";
import { __iconNode as BracesIconNode } from "lucide-react/dist/esm/icons/braces.js";
import { __iconNode as CalendarDaysIconNode } from "lucide-react/dist/esm/icons/calendar-days.js";
import { __iconNode as ClockIconNode } from "lucide-react/dist/esm/icons/clock.js";
import { __iconNode as CodeIconNode } from "lucide-react/dist/esm/icons/code.js";
import { __iconNode as Columns3IconNode } from "lucide-react/dist/esm/icons/columns-3.js";
import { __iconNode as CookieIconNode } from "lucide-react/dist/esm/icons/cookie.js";
import { __iconNode as DatabaseIconNode } from "lucide-react/dist/esm/icons/database.js";
import { __iconNode as EyeIconNode } from "lucide-react/dist/esm/icons/eye.js";
import { __iconNode as FileCodeIconNode } from "lucide-react/dist/esm/icons/file-code.js";
import { __iconNode as FileSpreadsheetIconNode } from "lucide-react/dist/esm/icons/file-spreadsheet.js";
import { __iconNode as FileTextIconNode } from "lucide-react/dist/esm/icons/file-text.js";
import { __iconNode as FingerprintIconNode } from "lucide-react/dist/esm/icons/fingerprint-pattern.js";
import { __iconNode as GitBranchIconNode } from "lucide-react/dist/esm/icons/git-branch.js";
import { __iconNode as GitCompareIconNode } from "lucide-react/dist/esm/icons/git-compare.js";
import { __iconNode as HashIconNode } from "lucide-react/dist/esm/icons/hash.js";
import { __iconNode as IdCardIconNode } from "lucide-react/dist/esm/icons/id-card.js";
import { __iconNode as KeyIconNode } from "lucide-react/dist/esm/icons/key.js";
import { __iconNode as LanguagesIconNode } from "lucide-react/dist/esm/icons/languages.js";
import { __iconNode as Link2IconNode } from "lucide-react/dist/esm/icons/link-2.js";
import { __iconNode as PaletteIconNode } from "lucide-react/dist/esm/icons/palette.js";
import { __iconNode as PenLineIconNode } from "lucide-react/dist/esm/icons/pen-line.js";
import { __iconNode as ReceiptIconNode } from "lucide-react/dist/esm/icons/receipt.js";
import { __iconNode as SearchCodeIconNode } from "lucide-react/dist/esm/icons/search-code.js";
import { __iconNode as ShieldIconNode } from "lucide-react/dist/esm/icons/shield.js";
import { __iconNode as ShuffleIconNode } from "lucide-react/dist/esm/icons/shuffle.js";
import { __iconNode as TerminalIconNode } from "lucide-react/dist/esm/icons/terminal.js";
import { __iconNode as UserCogIconNode } from "lucide-react/dist/esm/icons/user-cog.js";
import { __iconNode as VaultIconNode } from "lucide-react/dist/esm/icons/vault.js";
import { TOOLS, type ToolCategory } from "@/lib/tools";
import { SITE_DISPLAY_HOST } from "@/lib/site";

export const runtime = "edge";

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

const CATEGORY_ACCENTS: Record<ToolCategory, string> = {
  JSON: "#2563eb",
  "Data & Format": "#0f766e",
  Encoding: "#7c3aed",
  "Security & Auth": "#b91c1c",
  Generators: "#ea580c",
  Time: "#0891b2",
  Utilities: "#4f46e5",
};

type IconNode = Array<[string, Record<string, string>]>;

const TOOL_ICON_NODES: Record<string, IconNode> = {
  "json-formatter": BracesIconNode,
  "json-to-csv": FileSpreadsheetIconNode,
  "json-to-code": CodeIconNode,
  "json-compare": GitCompareIconNode,
  "format-converter": ArrowLeftRightIconNode,
  "sql-formatter": DatabaseIconNode,
  "diff-checker": Columns3IconNode,
  "markdown-previewer": FileTextIconNode,
  "html-to-markdown": FileCodeIconNode,
  "color-converter": PaletteIconNode,
  "base64-encoder": BarcodeIconNode,
  "url-encoder": Link2IconNode,
  "cookie-compare": CookieIconNode,
  "params-compare": SearchCodeIconNode,
  "html-encoder": GitBranchIconNode,
  "bcrypt-generator": VaultIconNode,
  "password-generator": KeyIconNode,
  "sha256-generator": ShieldIconNode,
  "jwt-decoder": FingerprintIconNode,
  "jwt-generator": IdCardIconNode,
  "uuid-generator": HashIconNode,
  "random-data": ShuffleIconNode,
  "mock-profile-generator": UserCogIconNode,
  "multilingual-text-generator": LanguagesIconNode,
  "pdf-invoice-generator": ReceiptIconNode,
  "signature-generator": PenLineIconNode,
  "unix-timestamp": ClockIconNode,
  "cron-parser": CalendarDaysIconNode,
  "regex-tester": TerminalIconNode,
  "open-graph-viewer": EyeIconNode,
};

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function getToolIconMarkup(slug: string): string {
  const iconNode = TOOL_ICON_NODES[slug] ?? TerminalIconNode;
  const children = iconNode
    .map(([tag, attrs]) => {
      const serializedAttrs = Object.entries(
        attrs as Record<string, string>
      )
        .filter(([name]) => name !== "key")
        .map(([name, value]) => `${name}="${escapeHtml(value)}"`)
        .join(" ");
      return `<${tag} ${serializedAttrs}></${tag}>`;
    })
    .join("");

  return [
    '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">',
    children,
    "</svg>",
  ].join("");
}

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const tool = TOOLS.find((item) => item.slug === slug);

  if (!tool) {
    return new Response("Not found", { status: 404 });
  }

  const accent = CATEGORY_ACCENTS[tool.category];
  const iconNode = TOOL_ICON_NODES[tool.slug] ?? TerminalIconNode;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "128px",
          background:
            "radial-gradient(circle at top right, rgba(255,255,255,0.22), transparent 32%), radial-gradient(circle at bottom left, rgba(255,255,255,0.14), transparent 30%), linear-gradient(135deg, #0f172a 0%, #111827 45%, #1f2937 100%)",
          color: "#ffffff",
          fontFamily:
            "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "22px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: accent,
                boxShadow: "0 20px 50px rgba(0,0,0,0.28)",
                color: "#ffffff",
              }}
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                {iconNode.map(([tag, attrs]) => {
                  const { key, ...rest } = attrs as Record<string, string> & {
                    key: string;
                  };
                  const Tag = tag as keyof JSX.IntrinsicElements;
                  return <Tag key={key} {...rest} />;
                })}
              </svg>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div
                style={{
                  fontSize: "20px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  opacity: 0.82,
                }}
              >
                Online Dev Tools
              </div>
              <div style={{ fontSize: "18px", opacity: 0.7 }}>{tool.category}</div>
            </div>
          </div>
          <div
            style={{
              fontSize: "18px",
              opacity: 0.68,
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: "999px",
              padding: "12px 18px",
              background: "rgba(255,255,255,0.05)",
            }}
          >
            Free browser-based utility
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              fontSize: "74px",
              lineHeight: 1.02,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              maxWidth: "980px",
            }}
          >
            {tool.title}
          </div>
          <div
            style={{
              fontSize: "34px",
              lineHeight: 1.35,
              color: "rgba(255,255,255,0.82)",
              maxWidth: "1040px",
            }}
          >
            {truncate(tool.description, 160)}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "20px",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          <div>{SITE_DISPLAY_HOST}</div>
          <div style={{ color: accent, fontWeight: 700 }}>{tool.slug}</div>
        </div>
      </div>
    ),
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
    }
  );
}
