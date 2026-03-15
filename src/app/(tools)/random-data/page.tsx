import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { RandomDataTool } from "@/components/tools/RandomDataTool";
import { getToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = getToolMetadata("random-data");

export default function RandomDataPage() {
  return (
    <ToolLayout
      slug="random-data"
      title="Random Data Generator"
      description="Generate random strings, numbers, UUIDs, hex, or JSON. Uses crypto API for secure randomness."
    >
      <RandomDataTool />
    </ToolLayout>
  );
}
