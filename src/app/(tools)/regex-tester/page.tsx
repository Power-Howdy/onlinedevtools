import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { RegexTesterTool } from "@/components/tools/RegexTesterTool";

export const metadata: Metadata = {
  title: "Free Regex Tester Online",
  description:
    "Test regular expressions online. Match highlighting and validation. Free regex tester and validator.",
};

export default function RegexTesterPage() {
  return (
    <ToolLayout
      title="Regex Tester"
      description="Test your regular expression against sample text. See matches highlighted."
    >
      <RegexTesterTool />
    </ToolLayout>
  );
}
