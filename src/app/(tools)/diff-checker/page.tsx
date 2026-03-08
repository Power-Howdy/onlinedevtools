import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { DiffCheckerTool } from "@/components/tools/DiffCheckerTool";

export const metadata: Metadata = {
  title: "Free Diff Checker Online",
  description:
    "Compare two texts or code blocks online. Highlight differences. Side-by-side and unified diff.",
};

export default function DiffCheckerPage() {
  return (
    <ToolLayout
      title="Diff Checker"
      description="Paste two texts to compare. Differences will be highlighted."
    >
      <DiffCheckerTool />
    </ToolLayout>
  );
}
