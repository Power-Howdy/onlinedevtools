import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { UnixTimestampTool } from "@/components/tools/UnixTimestampTool";

export const metadata: Metadata = {
  title: "Free Unix Timestamp Converter Online",
  description:
    "Convert Unix timestamp to date and date to Unix timestamp. Epoch time converter with timezone support.",
};

export default function UnixTimestampPage() {
  return (
    <ToolLayout
      title="Unix Timestamp Converter"
      description="Convert between Unix timestamps (seconds since epoch) and human-readable dates."
    >
      <UnixTimestampTool />
    </ToolLayout>
  );
}
