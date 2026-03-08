import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { JsonFormatterTool } from "@/components/tools/JsonFormatterTool";

export const metadata: Metadata = {
  title: "Free JSON Formatter Online – Format & Validate JSON",
  description:
    "Format, validate, and beautify JSON online. Syntax highlighting, collapse/expand tree. Free JSON formatter and validator.",
};

export default function JsonFormatterPage() {
  return (
    <ToolLayout
      title="JSON Formatter"
      description="Format and validate JSON. Paste your JSON below to format, validate, and copy the output."
    >
      <JsonFormatterTool />
    </ToolLayout>
  );
}
