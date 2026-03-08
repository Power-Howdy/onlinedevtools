import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { BcryptGeneratorTool } from "@/components/tools/BcryptGeneratorTool";
import { toolMetadata } from "@/lib/metadata";

export const metadata: Metadata = toolMetadata(
  "Free Bcrypt Password Hasher Online",
  "Hash passwords with bcrypt online. Compare hashes to verify passwords. Free bcrypt generator and verifier.",
  "bcrypt-generator"
);

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
