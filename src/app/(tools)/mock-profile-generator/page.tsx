import type { Metadata } from "next";
import { Suspense } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { RelatedTools } from "@/components/RelatedTools";
import { MockProfileGeneratorTool } from "@/components/tools/MockProfileGeneratorTool";
import { getToolMetadata } from "@/lib/metadata";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = getToolMetadata("mock-profile-generator");

const faqs = [
  {
    question: "Can I generate 100 test users as JSON?",
    answer:
      "Yes. Choose 100 (or 10, 1,000, or 10,000), click Generate, then Copy JSON or download a JSON file. The same set can be exported as CSV, SQL INSERT statements, or YAML.",
  },
  {
    question: "Can I generate products and orders too?",
    answer:
      "Yes. Switch the dataset tabs to Products or Orders. Products include SKU, price, category, and localized descriptions. Orders include customer fields, totals, and nested line items (flattened to JSON text in CSV/SQL).",
  },
  {
    question: "Does SQL export work for seed scripts?",
    answer:
      "Yes. Copy or download SQL to get batched INSERT statements. Set the table name and optionally use snake_case column names (for example first_name) to match common schemas.",
  },
  {
    question: "Does this generate real identities?",
    answer:
      "No. This is a synthetic test data generator for development and QA. Records are invented by locale-aware test-data libraries. They are not real people and must not be used as real identities or on production systems.",
  },
  {
    question: "What fields can I generate?",
    answer:
      "Users: name, username, email, phone, address, date of birth, company, job title, avatar URL, UUID, locale, gender, and optional sandbox credit-card-shaped numbers. Products and orders expose their own field pickers.",
  },
  {
    question: "Are the credit card numbers real?",
    answer:
      "No. Optional payment fields use well-known sandbox BINs (such as Stripe test Visa 4242). They are shaped like card numbers so payment forms can be tested, and they are not real payment instruments.",
  },
  {
    question: "Will generating 10,000 records freeze my browser?",
    answer:
      "Generation runs in chunks in your browser so the UI stays responsive. The preview shows the first 15 rows; copy or download for the full set.",
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
  name: "Test User & Test Data Generator",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  url: `${SITE_URL}/mock-profile-generator`,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Generate bulk synthetic users, products, and orders for development and QA. Export JSON, CSV, SQL, and YAML. Locale-aware test names, emails, addresses, and commerce fixtures.",
};

export default function MockProfileGeneratorPage() {
  return (
    <ToolLayout
      slug="mock-profile-generator"
      title="Test User & Test Data Generator"
      description="Generate 1 to 10,000 synthetic users, products, or orders for development and QA. Export JSON, CSV, SQL, or YAML. Pick fields and localize names, emails, phones, and addresses."
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
      <Suspense
        fallback={
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading generator…</p>
        }
      >
        <MockProfileGeneratorTool />
      </Suspense>

      <RelatedTools
        tools={[
          {
            href: "/random-data",
            title: "Random Data Generator",
            description:
              "Bulk random strings, numbers, UUIDs, hex, and unstructured JSON primitives.",
          },
          {
            href: "/multilingual-text-generator",
            title: "Multilingual Placeholder Text",
            description:
              "Localized bios, product copy, UI labels, and RTL placeholder text for i18n testing.",
          },
        ]}
      />

      <section className="mt-10 space-y-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Bulk test data for development
          </h2>
          <p className="mt-2">
            Use this as a test user generator, fake product generator, or JSON
            test data generator when you need dummy customer records, catalog
            fixtures, or order seeds for signup forms, seed scripts, demos, and
            QA. Generate a single mock profile or ten thousand records, then
            copy JSON for APIs, download CSV for spreadsheets, or export SQL
            INSERT statements for local databases.
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
