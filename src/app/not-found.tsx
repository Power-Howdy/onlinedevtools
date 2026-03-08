import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100">
        404
      </h1>
      <p className="mt-2 text-neutral-600 dark:text-neutral-400">
        This page could not be found.
      </p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/"
          className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium rounded-lg hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors"
        >
          All Tools
        </Link>
        <Link
          href="/json-formatter"
          className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
        >
          JSON Formatter
        </Link>
      </div>
    </div>
  );
}
