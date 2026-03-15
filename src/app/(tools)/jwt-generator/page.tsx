import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { JwtGeneratorTool } from "@/components/tools/JwtGeneratorTool";
import { getToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = getToolMetadata("jwt-generator");

export default function JwtGeneratorPage() {
  return (
    <ToolLayout
      slug="jwt-generator"
      title="JWT Generator"
      description="Generate JWT tokens with custom header and payload. Sign with HMAC-SHA256. Pair with JWT Decoder."
    >
      <JwtGeneratorTool />
    </ToolLayout>
  );
}
