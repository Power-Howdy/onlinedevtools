import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { JsonToCsvTool } from "@/components/tools/JsonToCsvTool";
import { toolMetadata } from "@/lib/metadata";

export const metadata: Metadata = toolMetadata(
  "Free JSON to CSV Converter Online",
  "Convert JSON array to CSV online. Flatten objects, download or copy CSV. Free JSON to CSV converter.",
  "json-to-csv"
);

export default function JsonToCsvPage() {
  return (
    <ToolLayout
      slug="json-to-csv"
      title="JSON to CSV Converter"
      description="Convert JSON array to CSV. Paste JSON and get CSV output. Copy or download."
    >
      <JsonToCsvTool />
    </ToolLayout>
  );
}
