import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { OpenGraphViewerTool } from "@/components/tools/OpenGraphViewerTool";
import { getToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = getToolMetadata("open-graph-viewer");

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

