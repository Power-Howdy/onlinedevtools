import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolLayout } from "@/components/ToolLayout";
import { RegexPatternTool } from "@/components/tools/RegexPatternTool";
import { REGEX_PATTERNS } from "@/data/regex-patterns";
import { toolMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return REGEX_PATTERNS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = REGEX_PATTERNS.find((p) => p.slug === slug);
  if (!entry) return {};
  const title = `Regex for ${entry.name} - ${entry.pattern}`;
  const description = `${entry.explanation} Use this pattern: ${entry.pattern}`;
  return toolMetadata(title, description, `regex/${slug}`);
}

export default async function RegexPatternPage({ params }: Props) {
  const { slug } = await params;
  const entry = REGEX_PATTERNS.find((p) => p.slug === slug);
  if (!entry) notFound();

  return (
    <ToolLayout
      slug={`regex/${slug}`}
      title={`Regex: ${entry.name}`}
      description={entry.explanation}
    >
      <RegexPatternTool
        pattern={entry.pattern}
        name={entry.name}
        explanation={entry.explanation}
        example={entry.example}
      />
    </ToolLayout>
  );
}
