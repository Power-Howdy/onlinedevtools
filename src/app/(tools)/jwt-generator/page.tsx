import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { JwtGeneratorTool } from "@/components/tools/JwtGeneratorTool";
import { toolMetadata } from "@/lib/metadata";

export const metadata: Metadata = toolMetadata(
  "Free JWT Generator Online – Create JWT Token",
  "Generate JWT tokens online with custom header and payload. Sign with HMAC-SHA256. Free JWT generator. Pair with JWT Decoder.",
  "jwt-generator"
);

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
