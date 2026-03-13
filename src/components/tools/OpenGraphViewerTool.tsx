"use client";

import { FormEvent, useState } from "react";

type OgMeta = {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  siteName?: string;
  [key: string]: string | undefined;
};

type OgResponse =
  | {
      ok: true;
      meta: OgMeta;
      warnings?: string[];
    }
  | {
      ok: false;
      error: string;
    };

export function OpenGraphViewerTool() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<OgMeta | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setWarnings([]);
    setData(null);
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Please enter a URL.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/og-scrape?url=${encodeURIComponent(trimmed)}`);
      const json = (await res.json()) as OgResponse;
      if (!res.ok || !("ok" in json) || !json.ok) {
        const msg =
          !res.ok && "error" in (json as any)
            ? (json as any).error
            : "error" in json
            ? json.error
            : "Failed to fetch Open Graph data.";
        setError(msg);
        return;
      }
      setData(json.meta);
      setWarnings(json.warnings ?? []);
    } catch {
      setError("Something went wrong while fetching Open Graph data.");
    } finally {
      setLoading(false);
    }
  }

  const imageUrl = data?.image;
  const title = data?.title ?? "No title found";
  const description =
    data?.description ?? "We couldn't find an Open Graph description for this URL.";
  const siteName = data?.siteName ?? new URL(url || "https://example.com").hostname;
  const displayUrl = data?.url ?? url;

  const entries =
    data &&
    Object.entries(data).filter(
      ([key, value]) => typeof value === "string" && value.trim().length > 0
    );

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          URL
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="mt-1 w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-200"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60 disabled:cursor-not-allowed dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            {loading ? "Fetching…" : "Fetch Open Graph data"}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() =>
              setUrl("https://vercel.com/docs/workflow-collaboration/vercel-toolbar")
            }
            className="inline-flex items-center justify-center rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Try example URL
          </button>
        </div>
      </form>

      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-700 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </div>
      )}

      {warnings.length > 0 && (
        <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200 space-y-1">
          <p className="font-medium">Warnings</p>
          <ul className="list-disc pl-4 space-y-0.5">
            {warnings.map((w, idx) => (
              <li key={idx}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {loading && (
        <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 p-4 animate-pulse space-y-3">
            <div className="h-40 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-4 w-2/3 rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-3 w-full rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-3 w-1/2 rounded bg-neutral-200 dark:bg-neutral-800" />
          </div>
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 p-4 space-y-2">
            <div className="h-4 w-32 rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-3 w-full rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-3 w-5/6 rounded bg-neutral-200 dark:bg-neutral-800" />
          </div>
        </div>
      )}

      {data && !loading && (
        <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden shadow-sm">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt={title}
                className="h-48 w-full object-cover bg-neutral-200 dark:bg-neutral-900"
              />
            ) : (
              <div className="h-48 w-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-xs text-neutral-400">
                No og:image found
              </div>
            )}
            <div className="p-4 space-y-2">
              <div className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400 line-clamp-1">
                {siteName}
              </div>
              <div className="text-base font-semibold text-neutral-900 dark:text-neutral-50 line-clamp-2">
                {title}
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3">
                {description}
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-500 truncate">
                {displayUrl}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4 space-y-2">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
              Raw Open Graph tags
            </h2>
            {entries && entries.length > 0 ? (
              <dl className="mt-2 max-h-72 overflow-y-auto text-xs divide-y divide-neutral-100 dark:divide-neutral-800">
                {entries.map(([key, value]) => (
                  <div key={key} className="py-1.5 flex gap-3">
                    <dt className="w-32 shrink-0 font-mono text-neutral-500 dark:text-neutral-400 truncate">
                      {key}
                    </dt>
                    <dd className="flex-1 text-neutral-800 dark:text-neutral-200 break-words">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                No Open Graph tags were detected for this URL.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

