import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { DiffCheckerTool } from "@/components/tools/DiffCheckerTool";
import { toolMetadata } from "@/lib/metadata";

export const metadata: Metadata = toolMetadata(
  "Free Diff Checker Online",
  "Compare two texts or code blocks online. Highlight differences. Side-by-side and unified diff.",
  "diff-checker"
);

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
