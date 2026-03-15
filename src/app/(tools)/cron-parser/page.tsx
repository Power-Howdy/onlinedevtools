import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { CronParserTool } from "@/components/tools/CronParserTool";
import { getToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = getToolMetadata("cron-parser");

export default function CronParserPage() {
  return (
    <ToolLayout
      slug="cron-parser"
      title="Cron Expression Parser"
      description="Enter a cron expression to see what schedule it represents (e.g. every 5 minutes, daily at midnight)."
    >
      <CronParserTool />
    </ToolLayout>
  );
}
