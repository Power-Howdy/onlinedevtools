import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { PdfInvoiceGeneratorTool } from "@/components/tools/PdfInvoiceGeneratorTool";
import { getToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = getToolMetadata("pdf-invoice-generator");

export default function PdfInvoiceGeneratorPage() {
  return (
    <ToolLayout
      slug="pdf-invoice-generator"
      title="PDF Invoice Generator"
      description="Create professional invoices in your browser. Add seller and buyer details, line items, tax, and notes—preview live and download a PDF instantly."
    >
      <PdfInvoiceGeneratorTool />
    </ToolLayout>
  );
}
