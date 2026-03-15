import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { RegexTesterTool } from "@/components/tools/RegexTesterTool";
import { getToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = getToolMetadata("regex-tester");

export default function RegexTesterPage() {
  return (
    <ToolLayout
      slug="regex-tester"
      title="Regex Tester"
      description="Test your regular expression against sample text. See matches highlighted."
    >
      <RegexTesterTool />
    </ToolLayout>
  );
}
