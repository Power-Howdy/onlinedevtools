import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { ToolLayout } from "@/components/ToolLayout";

const SqlFormatterTool = dynamic(
  () => import("@/components/tools/SqlFormatterTool").then((m) => ({ default: m.SqlFormatterTool })),
  { ssr: false, loading: () => <div className="animate-pulse text-neutral-500">Loading...</div> }
);

export const metadata: Metadata = {
  title: "Free SQL Formatter Online",
  description:
    "Format and beautify SQL queries online. Indent and uppercase keywords. Free SQL formatter.",
};

export default function SqlFormatterPage() {
  return (
    <ToolLayout
      title="SQL Formatter"
      description="Paste SQL to format. Indents and uppercases keywords for readability."
    >
      <SqlFormatterTool />
    </ToolLayout>
  );
}
