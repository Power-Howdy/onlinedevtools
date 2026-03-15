import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { DiffCheckerTool } from "@/components/tools/DiffCheckerTool";
import { getToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = getToolMetadata("diff-checker");

export default function DiffCheckerPage() {
  return (
    <ToolLayout
      slug="diff-checker"
      title="Diff Checker"
      description="Paste two texts to compare. Differences will be highlighted."
    >
      <DiffCheckerTool />
    </ToolLayout>
  );
}
