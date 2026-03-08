import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { toolMetadata } from "@/lib/metadata";
import { ToolLayout } from "@/components/ToolLayout";

const SqlFormatterTool = dynamic(
  () => import("@/components/tools/SqlFormatterTool").then((m) => ({ default: m.SqlFormatterTool })),
  { ssr: false, loading: () => <div className="animate-pulse text-neutral-500">Loading...</div> }
);

export const metadata: Metadata = toolMetadata(
  "Free SQL Formatter Online",
  "Format and beautify SQL queries online. Indent and uppercase keywords. Free SQL formatter.",
  "sql-formatter"
);

export default function SqlFormatterPage() {
  return (
    <ToolLayout
      slug="sql-formatter"
      title="SQL Formatter"
      description="Paste SQL to format. Indents and uppercases keywords for readability."
    >
      <SqlFormatterTool />
    </ToolLayout>
  );
}
