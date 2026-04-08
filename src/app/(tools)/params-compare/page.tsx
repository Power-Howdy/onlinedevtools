import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { ParamsCompareTool } from "@/components/tools/ParamsCompareTool";
import { getToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = getToolMetadata("params-compare");

export default function ParamsComparePage() {
  return (
    <ToolLayout
      slug="params-compare"
      title="Query Params Compare"
      description="Paste full URLs or raw query strings. Repeated keys are compared in order using getAll semantics."
    >
      <ParamsCompareTool />
    </ToolLayout>
  );
}
