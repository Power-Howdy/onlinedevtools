import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { RelatedTools } from "@/components/RelatedTools";
import { RandomDataTool } from "@/components/tools/RandomDataTool";
import { getToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = getToolMetadata("random-data");

export default function RandomDataPage() {
  return (
    <ToolLayout
      slug="random-data"
      title="Random Data Generator"
      description="Generate bulk random strings, numbers, UUIDs, hex, or unstructured JSON. Uses the Web Crypto API. For structured users, products, and orders, use the Test Data Generator."
    >
      <RandomDataTool />
      <RelatedTools
        tools={[
          {
            href: "/mock-profile-generator",
            title: "Test User & Test Data Generator",
            description:
              "Generate up to 10,000 synthetic users, products, or orders. Export JSON, CSV, SQL, and YAML.",
          },
        ]}
      />
    </ToolLayout>
  );
}
