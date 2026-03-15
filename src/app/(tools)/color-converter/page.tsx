import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { ColorConverterTool } from "@/components/tools/ColorConverterTool";
import { getToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = getToolMetadata("color-converter");

export default function ColorConverterPage() {
  return (
    <ToolLayout
      slug="color-converter"
      title="Color Converter"
      description="Convert colors between HEX, RGB, and HSL formats. Enter a color in any format."
    >
      <ColorConverterTool />
    </ToolLayout>
  );
}
