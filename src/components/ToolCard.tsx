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
      className="block p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-600 hover:shadow-sm transition-all group"
    >
      <h2 className="font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors">
        {title}
      </h2>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        {description}
      </p>
    </Link>
  );
}
