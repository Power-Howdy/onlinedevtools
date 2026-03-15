import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { MarkdownPreviewerTool } from "@/components/tools/MarkdownPreviewerTool";
import { getToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = getToolMetadata("markdown-previewer");

export default function MarkdownPreviewerPage() {
  return (
    <ToolLayout
      slug="markdown-previewer"
      title="Markdown Previewer"
      description="Type or paste Markdown below to see a live preview. Export as HTML."
    >
      <MarkdownPreviewerTool />
    </ToolLayout>
  );
}
