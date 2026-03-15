import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { JsonToCsvTool } from "@/components/tools/JsonToCsvTool";
import { getToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = getToolMetadata("json-to-csv");

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
