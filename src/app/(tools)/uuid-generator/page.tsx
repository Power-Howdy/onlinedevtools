import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { UuidGeneratorTool } from "@/components/tools/UuidGeneratorTool";
import { getToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = getToolMetadata("uuid-generator");

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
