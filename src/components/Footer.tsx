import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
          <span>Free developer utilities. No installation required.</span>
          <Link
            href="/"
            className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            All Tools
          </Link>
        </div>
      </div>
    </footer>
  );
}
