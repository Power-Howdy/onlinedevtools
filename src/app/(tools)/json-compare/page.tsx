import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { JsonCompareTool } from "@/components/tools/JsonCompareTool";
import { getToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = getToolMetadata("json-compare");

export default function JsonComparePage() {
  return (
    <ToolLayout
      slug="json-compare"
      title="JSON Compare"
      description="Structural comparison: object property order does not matter. Arrays are compared by index."
    >
      <JsonCompareTool />
    </ToolLayout>
  );
}
