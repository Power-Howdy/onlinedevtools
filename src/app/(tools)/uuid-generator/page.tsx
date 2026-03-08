import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { UuidGeneratorTool } from "@/components/tools/UuidGeneratorTool";

export const metadata: Metadata = {
  title: "Free UUID Generator Online",
  description:
    "Generate UUID v4 and v1 online. Bulk UUID generation. Copy to clipboard. Free UUID and GUID generator.",
};

export default function UuidGeneratorPage() {
  return (
    <ToolLayout
      title="UUID Generator"
      description="Generate UUIDs (v4 random). Supports single and bulk generation."
    >
      <UuidGeneratorTool />
    </ToolLayout>
  );
}
