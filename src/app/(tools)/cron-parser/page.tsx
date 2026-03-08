import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { CronParserTool } from "@/components/tools/CronParserTool";

export const metadata: Metadata = {
  title: "Free Cron Expression Parser Online",
  description:
    "Parse and explain cron expressions. Convert cron syntax to human-readable schedule. Free cron expression parser.",
};

export default function CronParserPage() {
  return (
    <ToolLayout
      title="Cron Expression Parser"
      description="Enter a cron expression to see what schedule it represents (e.g. every 5 minutes, daily at midnight)."
    >
      <CronParserTool />
    </ToolLayout>
  );
}
