import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { Base64Tool } from "@/components/tools/Base64Tool";

export const metadata: Metadata = {
  title: "Free Base64 Encoder Decoder Online",
  description:
    "Encode and decode Base64 strings online. Works with text and binary data. Free Base64 encoder and decoder.",
};

export default function Base64EncoderPage() {
  return (
    <ToolLayout
      title="Base64 Encoder / Decoder"
      description="Encode text to Base64 or decode Base64 to text. Paste your input below."
    >
      <Base64Tool />
    </ToolLayout>
  );
}
