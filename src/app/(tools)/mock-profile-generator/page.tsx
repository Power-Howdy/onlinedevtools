import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { MockProfileGeneratorTool } from "@/components/tools/MockProfileGeneratorTool";
import { getToolMetadata } from "@/lib/metadata";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = getToolMetadata("mock-profile-generator");

const faqs = [
  {
    question: "Can I generate 100 test users as JSON?",
    answer:
      "Yes. Choose 100 (or 1, 10, or 1,000), click Generate, then Copy as JSON or download a JSON file. The same set can be copied or downloaded as CSV for spreadsheets and fixtures.",
  },
  {
    question: "Does this generate real identities?",
    answer:
      "No. This is a synthetic test data generator for development and QA. Records are invented by locale-aware test-data libraries. They are not real people and must not be used as real identities or on production systems.",
  },
  {
    question: "What fields can I generate?",
    answer:
      "First and last name, username, email, phone, street address, city, state, postcode, date of birth, company, job title, avatar URL, UUID, locale, gender, and optional sandbox credit-card-shaped numbers from published test BINs.",
  },
  {
    question: "Are the credit card numbers real?",
    answer:
      "No. Optional payment fields use well-known sandbox BINs (such as Stripe test Visa 4242). They are shaped like card numbers so payment forms can be tested, and they are not real payment instruments.",
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
    "Generate bulk synthetic users for development and QA. Copy or download JSON and CSV. Locale-aware test names, emails, addresses, and test card numbers.",
};

export default function MockProfileGeneratorPage() {
  return (
    <ToolLayout
      slug="mock-profile-generator"
      title="Test User & Test Data Generator"
      description="Generate 1 to 1,000 synthetic users for development and QA. Copy JSON or CSV, download fixtures, pick fields, and localize names, emails, phones, and addresses."
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
      <MockProfileGeneratorTool />

      <section className="mt-10 space-y-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Bulk test user data for development
          </h2>
          <p className="mt-2">
            Use this as a test user generator, random user generator, or JSON
            test data generator when you need dummy customer records for signup
            forms, seed scripts, demos, and QA. Generate a single mock profile
            or a thousand test users, then copy JSON for APIs or download CSV
            for spreadsheets.
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
