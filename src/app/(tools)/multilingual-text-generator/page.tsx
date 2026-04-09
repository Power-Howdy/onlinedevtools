import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { LocaleTextGeneratorTool } from "@/components/tools/LocaleTextGeneratorTool";
import { getToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = getToolMetadata("multilingual-text-generator");

export default function MultilingualTextGeneratorPage() {
  return (
    <ToolLayout
      slug="multilingual-text-generator"
      title="Multilingual Text Generator"
      description="Generate placeholder paragraphs for bios and summaries in English, Chinese, Japanese, Spanish, Italian, and more. Control paragraph count and length, or randomize."
    >
      <LocaleTextGeneratorTool />
    </ToolLayout>
  );
}
