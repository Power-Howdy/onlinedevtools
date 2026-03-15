import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { Sha256GeneratorTool } from "@/components/tools/Sha256GeneratorTool";
import { getToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = getToolMetadata("sha256-generator");

export default function Sha256GeneratorPage() {
  return (
    <ToolLayout
      slug="sha256-generator"
      title="SHA256 Generator"
      description="Generate SHA256 hashes from any text. Uses Web Crypto API for fast, secure hashing in your browser."
    >
      <Sha256GeneratorTool />
    </ToolLayout>
  );
}
