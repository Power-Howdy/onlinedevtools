import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { OpenGraphViewerTool } from "@/components/tools/OpenGraphViewerTool";
import { getToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = getToolMetadata("open-graph-viewer");

export default function OpenGraphViewerPage() {
  return (
    <ToolLayout
      slug="open-graph-viewer"
      title="Social Preview / SEO Debugger"
      description="Preview how a URL looks on Facebook, LinkedIn, X, Discord, and Slack. Inspect Open Graph, Twitter Cards, canonical URL, favicon, image size, redirects, and missing tags."
      wide
    >
      <OpenGraphViewerTool />
    </ToolLayout>
  );
}

