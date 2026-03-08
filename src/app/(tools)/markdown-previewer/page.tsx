import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { MarkdownPreviewerTool } from "@/components/tools/MarkdownPreviewerTool";

export const metadata: Metadata = {
  title: "Free Markdown Previewer Online",
  description:
    "Preview Markdown as HTML online. Live Markdown editor and viewer. Export to HTML.",
};

export default function MarkdownPreviewerPage() {
  return (
    <ToolLayout
      title="Markdown Previewer"
      description="Type or paste Markdown below to see a live preview. Export as HTML."
    >
      <MarkdownPreviewerTool />
    </ToolLayout>
  );
}
