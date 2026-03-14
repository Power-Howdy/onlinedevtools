import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { JsonToLangTool } from "@/components/tools/JsonToLangTool";
import { toolMetadata } from "@/lib/metadata";

export const metadata: Metadata = toolMetadata(
  "Free JSON to Code Generator Online - TypeScript, Python, Java, Go, Rust, C#",
  "Convert JSON to TypeScript, Python, Java, Go, Rust, or C# code online. Generate types, classes, structs from JSON. Free JSON to code converter.",
  "json-to-code"
);

export default function JsonToCodePage() {
  return (
    <ToolLayout
      slug="json-to-code"
      title="JSON to Code Generator"
      description="Convert JSON to TypeScript, Python, Java, Go, Rust, or C#. Select output language and paste your JSON."
    >
      <JsonToLangTool />
    </ToolLayout>
  );
}
