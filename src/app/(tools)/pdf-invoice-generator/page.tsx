import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { RelatedTools } from "@/components/RelatedTools";
import { PdfInvoiceGeneratorTool } from "@/components/tools/PdfInvoiceGeneratorTool";
import { getToolMetadata } from "@/lib/metadata";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = getToolMetadata("pdf-invoice-generator");

const faqs = [
  {
    question: "Is this PDF invoice generator free?",
    answer:
      "Yes. You can create and download professional PDF invoices online at no cost. There is no sign-up, no subscription, and no watermark.",
  },
  {
    question: "Do I need an account to create an invoice?",
    answer:
      "No. The invoice maker runs entirely in your browser. Fill in seller and buyer details, line items, tax, and notes, then download the PDF—nothing is uploaded to a server.",
  },
  {
    question: "What can I include on the invoice?",
    answer:
      "Seller and buyer name, email, and address; invoice number and dates; multiple line items with quantity and rate; tax percentage; currency; payment terms; and notes. A live preview updates as you type.",
  },
  {
    question: "Is my invoice data private?",
    answer:
      "Yes. Invoice data stays on your device. We do not require an account and do not upload your invoice contents to generate the PDF.",
  },
  {
    question: "Who is this invoice maker for?",
    answer:
      "Freelancers, contractors, developers, and small businesses who need a quick free invoice PDF without creating an account or using a heavy accounting suite.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Free PDF Invoice Generator",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  url: `${SITE_URL}/pdf-invoice-generator`,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  isAccessibleForFree: true,
  description:
    "Create and download professional PDF invoices online for free. No sign-up. Add line items, tax, currency, and payment terms. Runs in your browser.",
};

export default function PdfInvoiceGeneratorPage() {
  return (
    <ToolLayout
      slug="pdf-invoice-generator"
      title="Free PDF Invoice Generator"
      description="Create a professional invoice online and download a PDF instantly. No sign-up, no upload—seller, buyer, line items, tax, and notes stay in your browser."
      wide
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
      />
      <PdfInvoiceGeneratorTool />

      <RelatedTools
        tools={[
          {
            href: "/signature-generator",
            title: "Signature Generator",
            description:
              "Draw or type a digital signature and download a transparent PNG—free, no signup.",
          },
        ]}
      />

      <section className="mt-10 space-y-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Free online invoice maker (PDF download)
          </h2>
          <p className="mt-2">
            Use this free PDF invoice generator when you need a clean client invoice without
            signing up for accounting software. Enter your business details, your client’s
            information, line items, tax rate, and currency, then download an invoice PDF ready
            to email or attach to a payment request.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Privacy-first invoice creation
          </h2>
          <p className="mt-2">
            Unlike many online invoice makers, this tool builds the PDF in your browser. That
            means no account wall and no server-side storage of customer names, amounts, or
            payment terms—useful for freelancers and developers who want a quick invoice without
            sharing billing data.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Frequently asked questions
          </h2>
          <dl className="mt-3 space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <dt className="font-medium text-slate-800 dark:text-slate-200">
                  {faq.question}
                </dt>
                <dd className="mt-1">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </ToolLayout>
  );
}
