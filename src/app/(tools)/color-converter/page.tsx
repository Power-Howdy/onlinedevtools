import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { ColorConverterTool } from "@/components/tools/ColorConverterTool";
import { toolMetadata } from "@/lib/metadata";

export const metadata: Metadata = toolMetadata(
  "Free Color Converter - HEX to RGB to HSL",
  "Convert between HEX, RGB, and HSL color formats. Free online color converter for developers and designers.",
  "color-converter"
);

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
