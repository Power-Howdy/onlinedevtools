import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { OpenGraphViewerTool } from "@/components/tools/OpenGraphViewerTool";
import { toolMetadata } from "@/lib/metadata";

export const metadata: Metadata = toolMetadata(
  "Open Graph Viewer – Preview OG tags for any URL",
  "Fetch and inspect Open Graph metadata for any URL. Preview og:image, og:title, og:description, and more, similar to the Vercel Toolbar OG viewer.",
  "open-graph-viewer"
);

export default function OpenGraphViewerPage() {
  return (
    <ToolLayout
      slug="open-graph-viewer"
      title="Open Graph Viewer"
      description="Paste a URL to preview its Open Graph metadata, including image, title, and description."
    >
      <OpenGraphViewerTool />
    </ToolLayout>
  );
}

