import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { RelatedTools } from "@/components/RelatedTools";
import { SignatureGeneratorTool } from "@/components/tools/SignatureGeneratorTool";
import { getToolMetadata } from "@/lib/metadata";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = getToolMetadata("signature-generator");

const faqs = [
  {
    question: "Is this signature generator free?",
    answer:
      "Yes. You can draw or type a signature and download a PNG at no cost. No sign-up, no watermark, and no paid plan is required.",
  },
  {
    question: "Can I download a transparent signature PNG?",
    answer:
      "Yes. Choose a transparent background so you can place the signature on contracts, invoices, or documents without a white box.",
  },
  {
    question: "Do I draw or type my signature?",
    answer:
      "Both. Draw with a mouse, trackpad, or touch screen, or type your name and pick a script font. Then download the result as a PNG.",
  },
  {
    question: "Is a generated image a legally binding electronic signature?",
    answer:
      "This tool creates a signature image for personal or informal use. It does not by itself create a legally certified electronic signature under eIDAS, ESIGN, or similar frameworks. Use a qualified e-sign provider when you need legally binding signatures.",
  },
  {
    question: "Is my signature uploaded to a server?",
    answer:
      "No. Drawing, typing, and PNG export all run in your browser. Your signature strokes and name stay on your device.",
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
  name: "Free Online Signature Generator",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  url: `${SITE_URL}/signature-generator`,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  isAccessibleForFree: true,
  description:
    "Create a free digital signature online. Draw or type your name, then download a PNG with optional transparent background. No signup, runs in your browser.",
};

export default function SignatureGeneratorPage() {
  return (
    <ToolLayout
      slug="signature-generator"
      title="Free Online Signature Generator"
      description="Draw or type a signature and download a PNG—transparent background supported. Free, no sign-up, everything runs in your browser."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
      />
      <SignatureGeneratorTool />

      <RelatedTools
        tools={[
          {
            href: "/pdf-invoice-generator",
            title: "PDF Invoice Generator",
            description:
              "Create a free professional invoice PDF online—no signup, download instantly.",
          },
        ]}
      />

      <section className="mt-10 space-y-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Free digital signature maker (PNG download)
          </h2>
          <p className="mt-2">
            Use this free online signature generator to create a handwritten-style signature for
            documents, invoices, proposals, or email footers. Draw freely or type your name in a
            script font, then download a PNG you can paste into Word, Google Docs, PDFs, or design
            tools.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Transparent PNG and privacy
          </h2>
          <p className="mt-2">
            Export with a transparent background so the signature sits cleanly on any page. The
            tool runs client-side: no account is required and your signature is not uploaded to
            generate the file.
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
