"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center">
      <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        Something went wrong
      </h2>
      <p className="mt-2 text-neutral-600 dark:text-neutral-400 text-sm">
        {error.message}
      </p>
      <div className="mt-6 flex gap-3 justify-center">
        <button
          onClick={reset}
          className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium rounded-lg hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
