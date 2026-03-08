import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { UnixTimestampTool } from "@/components/tools/UnixTimestampTool";
import { toolMetadata } from "@/lib/metadata";

export const metadata: Metadata = toolMetadata(
  "Free Unix Timestamp Converter Online",
  "Convert Unix timestamp to date and date to Unix timestamp. Epoch time converter with timezone support.",
  "unix-timestamp"
);

export default function UnixTimestampPage() {
  return (
    <ToolLayout
      slug="unix-timestamp"
      title="Unix Timestamp Converter"
      description="Convert between Unix timestamps (seconds since epoch) and human-readable dates."
    >
      <UnixTimestampTool />
    </ToolLayout>
  );
}
