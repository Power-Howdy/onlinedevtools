import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { SignatureGeneratorTool } from "@/components/tools/SignatureGeneratorTool";
import { getToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = getToolMetadata("signature-generator");

export default function SignatureGeneratorPage() {
  return (
    <ToolLayout
      slug="signature-generator"
      title="Signature Generator"
      description="Draw or type a signature and download a PNG. Transparent background support—everything runs in your browser."
    >
      <SignatureGeneratorTool />
    </ToolLayout>
  );
}
