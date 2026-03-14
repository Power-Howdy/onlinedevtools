import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { PasswordGeneratorTool } from "@/components/tools/PasswordGeneratorTool";
import { toolMetadata } from "@/lib/metadata";

export const metadata: Metadata = toolMetadata(
  "Free Password Generator Online – Secure Random Password",
  "Generate secure random passwords online. Customize length and character types. Free password generator.",
  "password-generator"
);

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
