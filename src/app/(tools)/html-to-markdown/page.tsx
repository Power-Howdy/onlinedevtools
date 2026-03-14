import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { HtmlToMarkdownTool } from "@/components/tools/HtmlToMarkdownTool";
import { toolMetadata } from "@/lib/metadata";

export const metadata: Metadata = toolMetadata(
  "Free HTML to Markdown Converter Online",
  "Convert HTML to Markdown online. Paste HTML and get clean Markdown output. Free HTML to Markdown converter.",
  "html-to-markdown"
);

export default function HtmlToMarkdownPage() {
  return (
    <ToolLayout
      slug="html-to-markdown"
      title="HTML to Markdown Converter"
      description="Convert HTML to Markdown. Paste your HTML and get clean Markdown output."
    >
      <HtmlToMarkdownTool />
    </ToolLayout>
  );
}
