"use client";

import { FormEvent, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  Download,
  Info,
  XCircle,
} from "lucide-react";
import { copyToClipboard } from "@/lib/clipboard";
import { useToolSettings } from "@/hooks/useToolSettings";
import {
  buildRecommendedMetaHtml,
  buildReportMarkdown,
  formatBytes,
  scoreChecks,
  suggestedFilename,
  type OgDebugResponse,
  type OgDebugSuccess,
  type SeoCheck,
  type SeoSeverity,
} from "@/lib/og-debug";
import {
  DiscordPreview,
  FacebookPreview,
  LinkedInPreview,
  SlackPreview,
  TwitterPreview,
} from "@/components/tools/og/SocialPreviewCards";

type Platform = "facebook" | "linkedin" | "twitter" | "discord" | "slack";
type Viewport = "desktop" | "mobile";
type MetaSource = "recommended" | "found";

const OG_DEFAULTS = { url: "" };

const PLATFORMS: Array<{ id: Platform; label: string }> = [
  { id: "facebook", label: "Facebook" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "twitter", label: "X / Twitter" },
  { id: "discord", label: "Discord" },
  { id: "slack", label: "Slack" },
];

const OG_KEYS = [
  "og:title",
  "og:description",
  "og:image",
  "og:url",
  "og:type",
  "og:site_name",
  "og:locale",
  "og:image:width",
  "og:image:height",
  "og:image:alt",
  "og:image:secure_url",
];

const TWITTER_KEYS = [
  "twitter:card",
  "twitter:title",
  "twitter:description",
  "twitter:image",
  "twitter:image:alt",
  "twitter:site",
  "twitter:creator",
];

function severityIcon(severity: SeoSeverity) {
  if (severity === "pass") return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
  if (severity === "error") return <XCircle className="h-4 w-4 text-red-600" />;
  if (severity === "warning") return <AlertTriangle className="h-4 w-4 text-amber-600" />;
  return <Info className="h-4 w-4 text-sky-600" />;
}

function statusBadgeClass(status: number): string {
  if (status >= 200 && status < 300) {
    return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200";
  }
  if (status >= 300 && status < 400) {
    return "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200";
  }
  return "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-200";
}

function downloadText(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(href);
}

function TagRow({
  label,
  value,
  recommended,
}: {
  label: string;
  value?: string;
  recommended?: boolean;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,11rem)_minmax(0,1fr)] gap-3 py-1.5 text-xs">
      <dt className="font-mono text-neutral-500 dark:text-neutral-400 truncate">{label}</dt>
      <dd className="break-words text-neutral-800 dark:text-neutral-200">
        {value ? (
          value
        ) : (
          <span className="text-neutral-400">
            {recommended ? "Missing (recommended)" : "—"}
          </span>
        )}
      </dd>
    </div>
  );
}

function CheckList({ checks }: { checks: SeoCheck[] }) {
  const order: SeoSeverity[] = ["error", "warning", "info", "pass"];
  const grouped = order
    .map((severity) => ({
      severity,
      items: checks.filter((check) => check.severity === severity),
    }))
    .filter((group) => group.items.length);

  return (
    <div className="space-y-3">
      {grouped.map((group) => (
        <div key={group.severity} className="space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
            {group.severity === "pass" ? "Passed" : `${group.severity}s`} · {group.items.length}
          </p>
          <ul className="space-y-1.5">
            {group.items.map((check) => (
              <li
                key={check.id}
                className="flex gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 dark:border-neutral-800 dark:bg-neutral-950"
              >
                <span className="mt-0.5 shrink-0">{severityIcon(check.severity)}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
                    {check.title}
                  </p>
                  {check.detail ? (
                    <p className="mt-0.5 break-words text-xs text-neutral-600 dark:text-neutral-400">
                      {check.detail}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function foundTagsHtml(result: OgDebugSuccess): string {
  const lines = Object.entries(result.tags).map(([key, value]) => {
    const attr = key.startsWith("twitter:") ? "name" : "property";
    return `<meta ${attr}="${key}" content="${value.replace(/"/g, "&quot;")}" />`;
  });
  if (result.htmlTitle) lines.unshift(`<title>${result.htmlTitle}</title>`);
  if (result.htmlDescription) {
    lines.splice(
      1,
      0,
      `<meta name="description" content="${result.htmlDescription.replace(/"/g, "&quot;")}" />`
    );
  }
  if (result.canonical) {
    lines.push(`<link rel="canonical" href="${result.canonical}" />`);
  }
  return lines.join("\n") || "<!-- No social meta tags were found -->";
}

export function OpenGraphViewerTool() {
  const [s, setS] = useToolSettings("main", OG_DEFAULTS);
  const { url } = s;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OgDebugSuccess | null>(null);
  const [platform, setPlatform] = useState<Platform>("facebook");
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [metaSource, setMetaSource] = useState<MetaSource>("recommended");

  const score = useMemo(
    () => (result ? scoreChecks(result.checks) : null),
    [result]
  );

  const metaHtml = useMemo(() => {
    if (!result) return "";
    return metaSource === "recommended"
      ? buildRecommendedMetaHtml(result)
      : foundTagsHtml(result);
  }, [result, metaSource]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Please enter a URL.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/og-scrape?url=${encodeURIComponent(trimmed)}`);
      const json = (await res.json()) as OgDebugResponse;
      if (!res.ok || !json.ok) {
        setError("error" in json ? json.error : "Failed to fetch social preview data.");
        return;
      }
      setResult(json);
    } catch {
      setError("Something went wrong while fetching the URL.");
    } finally {
      setLoading(false);
    }
  }

  async function copyMeta() {
    const ok = await copyToClipboard(metaHtml);
    if (ok) toast.success("Meta tags copied");
    else toast.error("Could not copy");
  }

  function downloadJson() {
    if (!result) return;
    downloadText(
      suggestedFilename(result.finalUrl, "json"),
      JSON.stringify(result, null, 2),
      "application/json"
    );
    toast.success("JSON report downloaded");
  }

  function downloadMarkdown() {
    if (!result) return;
    downloadText(
      suggestedFilename(result.finalUrl, "md"),
      buildReportMarkdown(result),
      "text/markdown"
    );
    toast.success("Report downloaded");
  }

  const redirectHops =
    result?.redirectChain.filter((hop) => hop.status >= 300 && hop.status < 400) ?? [];

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          URL
          <input
            type="url"
            value={url}
            onChange={(e) => setS((p) => ({ ...p, url: e.target.value }))}
            placeholder="https://example.com"
            className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:ring-neutral-200"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            {loading ? "Analyzing…" : "Analyze social preview"}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => setS((p) => ({ ...p, url: "https://github.com" }))}
            className="inline-flex items-center justify-center rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            Try example URL
          </button>
        </div>
      </form>

      {error ? (
        <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-700 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="animate-pulse space-y-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900/40">
            <div className="h-44 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-4 w-2/3 rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-3 w-full rounded bg-neutral-200 dark:bg-neutral-800" />
          </div>
          <div className="space-y-2 rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900/40">
            <div className="h-4 w-32 rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-3 w-full rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-3 w-5/6 rounded bg-neutral-200 dark:bg-neutral-800" />
          </div>
        </div>
      ) : null}

      {result && !loading && score ? (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
            <div
              className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-full text-sm font-bold ${
                score.score >= 80
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200"
                  : score.score >= 50
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200"
                    : "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-200"
              }`}
            >
              {score.score}
              <span className="text-[9px] font-medium uppercase tracking-wide">score</span>
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className={`rounded-full px-2 py-0.5 font-semibold ${statusBadgeClass(result.status)}`}>
                  HTTP {result.status} {result.statusText}
                </span>
                <span className="text-neutral-500">{result.timingMs} ms</span>
                <span className="text-neutral-500">
                  {redirectHops.length
                    ? `${redirectHops.length} redirect${redirectHops.length === 1 ? "" : "s"}`
                    : "No redirects"}
                </span>
                <span className="text-neutral-500">
                  {score.errors} errors · {score.warnings} warnings
                </span>
              </div>
              <p className="truncate text-sm text-neutral-700 dark:text-neutral-300">
                {result.finalUrl}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={downloadMarkdown}
                className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                <Download className="h-3.5 w-3.5" />
                Report
              </button>
              <button
                type="button"
                onClick={downloadJson}
                className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                <Download className="h-3.5 w-3.5" />
                JSON
              </button>
            </div>
          </div>

          <section className="space-y-3">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                  Social previews
                </h2>
                <p className="text-xs text-neutral-500">
                  Approximate Facebook, LinkedIn, X, Discord, and Slack cards
                </p>
              </div>
              <div className="inline-flex rounded-md border border-neutral-300 p-0.5 text-xs dark:border-neutral-700">
                {(["desktop", "mobile"] as Viewport[]).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setViewport(value)}
                    className={`rounded px-2.5 py-1 capitalize ${
                      viewport === value
                        ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                        : "text-neutral-600 dark:text-neutral-300"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PLATFORMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPlatform(item.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    platform === item.id
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                      : "border border-neutral-300 text-neutral-700 dark:border-neutral-700 dark:text-neutral-200"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="rounded-xl border border-neutral-200 bg-[#f0f2f5] p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
              {platform === "facebook" ? (
                <FacebookPreview preview={result.preview} viewport={viewport} />
              ) : null}
              {platform === "linkedin" ? (
                <LinkedInPreview preview={result.preview} viewport={viewport} />
              ) : null}
              {platform === "twitter" ? (
                <TwitterPreview preview={result.preview} viewport={viewport} />
              ) : null}
              {platform === "discord" ? (
                <DiscordPreview preview={result.preview} viewport={viewport} />
              ) : null}
              {platform === "slack" ? (
                <SlackPreview preview={result.preview} viewport={viewport} />
              ) : null}
            </div>
          </section>

          <div className="grid gap-4 lg:grid-cols-2">
            <section className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                Missing & recommended tags
              </h2>
              <p className="mb-3 mt-1 text-xs text-neutral-500">
                Includes image size, accessibility, and crawler checks
              </p>
              <div className="max-h-[28rem] overflow-y-auto pr-1">
                <CheckList checks={result.checks} />
              </div>
            </section>

            <div className="space-y-4">
              <section className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                  Open Graph
                </h2>
                <dl className="mt-2 divide-y divide-neutral-100 dark:divide-neutral-800">
                  {OG_KEYS.map((key) => (
                    <TagRow
                      key={key}
                      label={key}
                      value={result.tags[key]}
                      recommended={
                        key === "og:title" ||
                        key === "og:description" ||
                        key === "og:image" ||
                        key === "og:url"
                      }
                    />
                  ))}
                </dl>
              </section>

              <section className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                  Twitter Card
                </h2>
                <dl className="mt-2 divide-y divide-neutral-100 dark:divide-neutral-800">
                  {TWITTER_KEYS.map((key) => (
                    <TagRow
                      key={key}
                      label={key}
                      value={result.tags[key]}
                      recommended={key === "twitter:card"}
                    />
                  ))}
                </dl>
              </section>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <section className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                Page, canonical & favicon
              </h2>
              <dl className="mt-2 divide-y divide-neutral-100 dark:divide-neutral-800">
                <TagRow label="HTML title" value={result.htmlTitle} recommended />
                <TagRow label="meta description" value={result.htmlDescription} />
                <TagRow label="canonical" value={result.canonical} recommended />
                <TagRow label="favicon" value={result.favicon} />
                <TagRow label="robots" value={result.robots} />
                <TagRow label="og:url" value={result.tags["og:url"]} recommended />
              </dl>
              {result.favicon ? (
                <div className="mt-3 flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={result.favicon} alt="" className="h-5 w-5 rounded-sm object-contain" />
                  Favicon preview
                </div>
              ) : null}
            </section>

            <section className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                Image checks
              </h2>
              {result.image || result.preview.image ? (
                <div className="mt-3 space-y-3">
                  {result.preview.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={result.preview.image}
                      alt={result.preview.title}
                      className="h-36 w-full rounded-lg bg-neutral-100 object-cover dark:bg-neutral-900"
                    />
                  ) : null}
                  <dl className="divide-y divide-neutral-100 text-xs dark:divide-neutral-800">
                    <TagRow label="URL" value={result.image?.url || result.preview.image} />
                    <TagRow
                      label="Dimensions"
                      value={
                        result.image?.width && result.image?.height
                          ? `${result.image.width} × ${result.image.height}`
                          : undefined
                      }
                    />
                    <TagRow label="Aspect ratio" value={result.image?.aspectRatio} />
                    <TagRow
                      label="File size"
                      value={
                        result.image?.byteSize
                          ? formatBytes(result.image.byteSize)
                          : undefined
                      }
                    />
                    <TagRow label="Type" value={result.image?.contentType || result.image?.format} />
                    <TagRow
                      label="Alt text"
                      value={result.image?.alt || result.tags["og:image:alt"]}
                      recommended
                    />
                    <TagRow
                      label="Fetch status"
                      value={
                        result.image?.status
                          ? String(result.image.status)
                          : result.image?.error
                      }
                    />
                  </dl>
                </div>
              ) : (
                <p className="mt-2 text-xs text-neutral-500">No share image was found.</p>
              )}
            </section>
          </div>

          <section className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
              Redirect chain
            </h2>
            <ol className="mt-3 space-y-2">
              {result.redirectChain.map((hop, index) => (
                <li key={`${hop.url}-${index}`} className="flex gap-3 text-xs">
                  <span
                    className={`mt-0.5 h-6 min-w-10 rounded-full px-2 text-center text-[11px] font-semibold leading-6 ${statusBadgeClass(hop.status)}`}
                  >
                    {hop.status}
                  </span>
                  <div className="min-w-0">
                    <p className="break-all text-neutral-800 dark:text-neutral-200">{hop.url}</p>
                    {hop.location ? (
                      <p className="break-all text-neutral-500">→ {hop.location}</p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                Copyable HTML meta tags
              </h2>
              <div className="flex flex-wrap gap-2">
                <div className="inline-flex rounded-md border border-neutral-300 p-0.5 text-xs dark:border-neutral-700">
                  {(["recommended", "found"] as MetaSource[]).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setMetaSource(value)}
                      className={`rounded px-2.5 py-1 capitalize ${
                        metaSource === value
                          ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                          : "text-neutral-600 dark:text-neutral-300"
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={copyMeta}
                  className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </button>
              </div>
            </div>
            <pre className="mt-3 max-h-80 overflow-auto rounded-lg bg-neutral-950 p-3 text-[11px] leading-relaxed text-neutral-100">
              {metaHtml}
            </pre>
          </section>
        </div>
      ) : null}
    </div>
  );
}
