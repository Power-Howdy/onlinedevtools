import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { UrlEncoderTool } from "@/components/tools/UrlEncoderTool";

export const metadata: Metadata = {
  title: "Free URL Encoder Decoder Online",
  description:
    "Encode and decode URL parameters online. Percent encoding. Free URL encoder and decoder.",
};

export default function UrlEncoderPage() {
  return (
    <ToolLayout
      title="URL Encoder / Decoder"
      description="Encode text for use in URLs or decode percent-encoded strings."
    >
      <UrlEncoderTool />
    </ToolLayout>
  );
}
