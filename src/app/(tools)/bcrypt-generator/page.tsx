import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { BcryptGeneratorTool } from "@/components/tools/BcryptGeneratorTool";
import { getToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = getToolMetadata("bcrypt-generator");

export default function BcryptGeneratorPage() {
  return (
    <ToolLayout
      slug="bcrypt-generator"
      title="Bcrypt Generator"
      description="Hash passwords with bcrypt or compare a plain text against a hash. All processing runs in your browser."
    >
      <BcryptGeneratorTool />
    </ToolLayout>
  );
}
