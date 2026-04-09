import Link from "next/link";

type ToolCardProps = {
  slug: string;
  title: string;
  description: string;
};

export function ToolCard({ slug, title, description }: ToolCardProps) {
  return (
    <Link
      href={`/${slug}`}
      className="block p-4 rounded-xl border border-light-border bg-light-card hover:border-primary/40 dark:border-dark-border dark:bg-dark-card hover:shadow-sm transition-all group"
    >
      <h2 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">
        {title}
      </h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        {description}
      </p>
    </Link>
  );
}
