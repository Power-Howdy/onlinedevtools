import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { Base64Tool } from "@/components/tools/Base64Tool";
import { getToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = getToolMetadata("base64-encoder");

export default function Base64EncoderPage() {
  return (
    <ToolLayout
      slug="base64-encoder"
      title="Base64 Encoder / Decoder"
      description="Encode text to Base64 or decode Base64 to text. Paste your input below."
    >
      <Base64Tool />
    </ToolLayout>
  );
}
