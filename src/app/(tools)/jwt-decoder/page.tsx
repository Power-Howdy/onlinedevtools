import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { JwtDecoderTool } from "@/components/tools/JwtDecoderTool";

export const metadata: Metadata = {
  title: "Free JWT Decoder Online – Decode JWT Token",
  description:
    "Decode and inspect JWT tokens online. View header, payload, and expiration. Free JWT decoder and debugger.",
};

export default function JwtDecoderPage() {
  return (
    <ToolLayout
      title="JWT Decoder"
      description="Paste a JWT token to decode the header and payload. View claims and expiration."
    >
      <JwtDecoderTool />
    </ToolLayout>
  );
}
