import Link from "next/link";

export type RelatedToolLink = {
  href: string;
  title: string;
  description: string;
};

export function RelatedTools({
  tools,
  heading = "Related tools",
}: {
  tools: readonly RelatedToolLink[];
  heading?: string;
}) {
  if (tools.length === 0) return null;

  return (
    <section className="mt-10 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/40 p-4 sm:p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        {heading}
      </h2>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {tools.map((tool) => (
          <li key={tool.href}>
            <Link
              href={tool.href}
              className="block rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3 py-3 hover:border-primary/40 hover:bg-primary/5 transition-colors"
            >
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {tool.title}
              </span>
              <span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">
                {tool.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
