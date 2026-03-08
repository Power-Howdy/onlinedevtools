import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { JsonFormatterTool } from "@/components/tools/JsonFormatterTool";
import { toolMetadata } from "@/lib/metadata";

export const metadata: Metadata = toolMetadata(
  "Free JSON Formatter & TypeScript Interface Generator Online",
  "Format and validate JSON online. Generate TypeScript interfaces from JSON. Free JSON formatter, validator, and JSON-to-TypeScript converter.",
  "json-formatter"
);

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
