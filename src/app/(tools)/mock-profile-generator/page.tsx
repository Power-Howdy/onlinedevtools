import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { MockProfileGeneratorTool } from "@/components/tools/MockProfileGeneratorTool";
import { getToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = getToolMetadata("mock-profile-generator");

export default function MockProfileGeneratorPage() {
  return (
    <ToolLayout
      slug="mock-profile-generator"
      title="Mock Profile Generator"
      description="Generate synthetic names, emails, phone numbers, and addresses for testing signups and forms. Country can be fixed or random."
    >
      <MockProfileGeneratorTool />
    </ToolLayout>
  );
}
