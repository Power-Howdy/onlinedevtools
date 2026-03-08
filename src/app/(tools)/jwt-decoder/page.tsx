import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { JwtDecoderTool } from "@/components/tools/JwtDecoderTool";
import { toolMetadata } from "@/lib/metadata";

export const metadata: Metadata = toolMetadata(
  "Free JWT Decoder Online – Decode JWT Token",
  "Decode and inspect JWT tokens online. View header, payload, and expiration. Free JWT decoder and debugger.",
  "jwt-decoder"
);

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
