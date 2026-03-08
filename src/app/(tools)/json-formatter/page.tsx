import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { JsonFormatterTool } from "@/components/tools/JsonFormatterTool";

export const metadata: Metadata = {
  title: "Free JSON Formatter & TypeScript Interface Generator Online",
  description:
    "Format and validate JSON online. Generate TypeScript interfaces from JSON. Free JSON formatter, validator, and JSON-to-TypeScript converter.",
};

export default function JsonFormatterPage() {
  return (
    <ToolLayout
      title="JSON Formatter & TypeScript Interface Generator"
      description="Format and validate JSON, or generate TypeScript interfaces from your JSON. Paste your JSON below."
    >
      <JsonFormatterTool />
    </ToolLayout>
  );
}
