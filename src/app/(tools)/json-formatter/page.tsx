import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { JsonFormatterTool } from "@/components/tools/JsonFormatterTool";
import { getToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = getToolMetadata("json-formatter");

export default function JsonFormatterPage() {
  return (
    <ToolLayout
      slug="json-formatter"
      title="JSON Formatter & TypeScript Interface Generator"
      description="Format and validate JSON, or generate TypeScript interfaces from your JSON. Paste your JSON below."
    >
      <JsonFormatterTool />
    </ToolLayout>
  );
}
