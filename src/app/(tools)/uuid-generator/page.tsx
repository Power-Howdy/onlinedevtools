import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { UuidGeneratorTool } from "@/components/tools/UuidGeneratorTool";
import { toolMetadata } from "@/lib/metadata";

export const metadata: Metadata = toolMetadata(
  "Free UUID Generator Online",
  "Generate UUID v4 online. Bulk UUID generation. Copy to clipboard. Free UUID and GUID generator.",
  "uuid-generator"
);

export default function UuidGeneratorPage() {
  return (
    <ToolLayout
      slug="uuid-generator"
      title="UUID Generator"
      description="Generate UUIDs (v4 random). Supports single and bulk generation."
    >
      <UuidGeneratorTool />
    </ToolLayout>
  );
}
