import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { UrlEncoderTool } from "@/components/tools/UrlEncoderTool";
import { getToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = getToolMetadata("url-encoder");

export default function UrlEncoderPage() {
  return (
    <ToolLayout
      slug="url-encoder"
      title="URL Encoder / Decoder"
      description="Encode text for use in URLs or decode percent-encoded strings."
    >
      <UrlEncoderTool />
    </ToolLayout>
  );
}
