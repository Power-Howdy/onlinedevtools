import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolLayout } from "@/components/ToolLayout";
import { JsonToLangTool } from "@/components/tools/JsonToLangTool";
import {
  JSON_TO_LANG_LANGUAGES,
  JSON_TO_LANG_DATA,
  type JsonToLangSlug,
} from "@/data/json-to-lang";
import { toolMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ lang: string }> };

export async function generateStaticParams() {
  return JSON_TO_LANG_LANGUAGES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const slug = lang as JsonToLangSlug;
  const data = JSON_TO_LANG_DATA[slug];
  if (!data) return {};
  return toolMetadata(`Free ${data.title} Online`, data.description, `json-to-${lang}`);
}

export default async function JsonToLangPage({ params }: Props) {
  const { lang } = await params;
  const slug = lang as JsonToLangSlug;
  if (!JSON_TO_LANG_LANGUAGES.includes(slug)) notFound();
  const data = JSON_TO_LANG_DATA[slug];

  return (
    <ToolLayout
      slug={`json-to-${slug}`}
      title={`JSON to ${data.label} Converter`}
      description={`Convert JSON to ${data.label} online. Paste your JSON below to generate ${data.label} code.`}
    >
      <JsonToLangTool lang={slug} />
    </ToolLayout>
  );
}
