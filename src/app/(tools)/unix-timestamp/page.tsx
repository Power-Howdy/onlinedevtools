import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { UnixTimestampTool } from "@/components/tools/UnixTimestampTool";
import { getToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = getToolMetadata("unix-timestamp");

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
