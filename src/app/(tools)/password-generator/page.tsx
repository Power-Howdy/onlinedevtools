import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { PasswordGeneratorTool } from "@/components/tools/PasswordGeneratorTool";
import { getToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = getToolMetadata("password-generator");

export default function PasswordGeneratorPage() {
  return (
    <ToolLayout
      slug="password-generator"
      title="Password Generator"
      description="Generate secure random passwords. Customize length and character types (uppercase, lowercase, numbers, symbols)."
    >
      <PasswordGeneratorTool />
    </ToolLayout>
  );
}
