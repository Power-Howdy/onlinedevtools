import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { FormatConverterTool } from "@/components/tools/FormatConverterTool";
import { getToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = getToolMetadata("format-converter");

export default function FormatConverterPage() {
  return (
    <ToolLayout
      slug="format-converter"
      title="Format Converter"
      description="Convert between CSV, JSON, XML, and YAML. Select source and target formats, then paste your data."
    >
      <FormatConverterTool />
    </ToolLayout>
  );
}
