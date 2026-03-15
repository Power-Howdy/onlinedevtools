import type { Metadata } from "next";
import { notFound } from "next/navigation";
import cronstrue from "cronstrue";
import { ToolLayout } from "@/components/ToolLayout";
import { CronParserTool } from "@/components/tools/CronParserTool";
import { CRON_PATTERNS } from "@/data/cron-patterns";
import { toolMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return CRON_PATTERNS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = CRON_PATTERNS.find((p) => p.slug === slug);
  if (!entry) return {};
  let description = "";
  try {
    description = cronstrue.toString(entry.expr);
  } catch {
    description = "Cron schedule explanation";
  }
  const title = `Cron ${entry.expr} - ${description}`;
  const keywords = [
    "cron explainer",
    "cron expression",
    "cron schedule",
    entry.expr,
    "cron parser",
  ];
  return toolMetadata(
    title,
    `Understand cron expression "${entry.expr}". ${description}. Free cron explainer.`,
    `cron-explainer/${slug}`,
    keywords
  );
}

export default async function CronExplainerPage({ params }: Props) {
  const { slug } = await params;
  const entry = CRON_PATTERNS.find((p) => p.slug === slug);
  if (!entry) notFound();

  let humanReadable = "Invalid expression";
  try {
    humanReadable = cronstrue.toString(entry.expr);
  } catch {
    // fallback
  }

  return (
    <ToolLayout
      slug={`cron-explainer/${slug}`}
      title={`Cron: ${entry.expr}`}
      description={`This cron expression means: ${humanReadable}`}
    >
      <div className="space-y-4">
        <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
          <p className="font-mono text-sm">{entry.expr}</p>
          <p className="mt-2 text-sm">{humanReadable}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Try another expression</h2>
          <CronParserTool />
        </div>
      </div>
    </ToolLayout>
  );
}
