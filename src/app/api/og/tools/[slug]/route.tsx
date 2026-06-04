import { ImageResponse } from "next/og";
import { TOOLS, type ToolCategory } from "@/lib/tools";
import { getToolNavIcon } from "@/data/tool-nav-icons";

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

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
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

  const Icon = getToolNavIcon(tool.slug);
  const accent = CATEGORY_ACCENTS[tool.category];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
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
              <Icon size={36} strokeWidth={2.25} />
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
          <div>onlinedevtools-three.vercel.app</div>
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
