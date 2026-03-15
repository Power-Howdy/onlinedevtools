import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { HtmlEncoderTool } from "@/components/tools/HtmlEncoderTool";
import { getToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = getToolMetadata("html-encoder");

export default function HtmlEncoderPage() {
  return (
    <ToolLayout
      slug="html-encoder"
      title="HTML Entity Encoder"
      description="Encode text to HTML entities or decode HTML entities back to text. Paste your input below."
    >
      <HtmlEncoderTool />
    </ToolLayout>
  );
}
