import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <Link
          href="/"
          className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
        >
          Online Dev Tools
        </Link>
      </div>
    </header>
  );
}
