import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { RelatedTools } from "@/components/RelatedTools";
import { LocaleTextGeneratorTool } from "@/components/tools/LocaleTextGeneratorTool";
import { getToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = getToolMetadata("multilingual-text-generator");

export default function MultilingualTextGeneratorPage() {
  return (
    <ToolLayout
      slug="multilingual-text-generator"
      title="Multilingual Placeholder Text Generator"
      description="Generate realistic placeholder content in 16 languages for UI, website, localization, and app testing — including Arabic and Hebrew RTL."
    >
      <LocaleTextGeneratorTool />
      <RelatedTools
        tools={[
          {
            href: "/mock-profile-generator",
            title: "Test User & Test Data Generator",
            description:
              "Need full records? Generate synthetic users, products, and orders with JSON, CSV, SQL, and YAML export.",
          },
        ]}
      />
    </ToolLayout>
  );
}
