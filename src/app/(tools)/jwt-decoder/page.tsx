import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { JwtDecoderTool } from "@/components/tools/JwtDecoderTool";
import { getToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = getToolMetadata("jwt-decoder");

export default function JwtDecoderPage() {
  return (
    <ToolLayout
      slug="jwt-decoder"
      title="JWT Decoder"
      description="Paste a JWT token to decode the header and payload. View claims and expiration."
    >
      <JwtDecoderTool />
    </ToolLayout>
  );
}
