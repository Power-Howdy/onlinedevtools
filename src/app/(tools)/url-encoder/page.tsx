import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { UrlEncoderTool } from "@/components/tools/UrlEncoderTool";
import { toolMetadata } from "@/lib/metadata";

export const metadata: Metadata = toolMetadata(
  "Free URL Encoder Decoder Online",
  "Encode and decode URL parameters online. Percent encoding. Free URL encoder and decoder.",
  "url-encoder"
);

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
