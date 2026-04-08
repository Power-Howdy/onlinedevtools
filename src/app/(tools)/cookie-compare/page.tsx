import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { CookieCompareTool } from "@/components/tools/CookieCompareTool";
import { getToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = getToolMetadata("cookie-compare");

export default function CookieComparePage() {
  return (
    <ToolLayout
      slug="cookie-compare"
      title="Cookie Header Viewer & Compare"
      description="Paste Cookie header values (with or without the Cookie: prefix). Duplicate names use the last occurrence per side."
    >
      <CookieCompareTool />
    </ToolLayout>
  );
}
