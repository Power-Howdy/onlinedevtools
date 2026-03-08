"use client";

import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import { marked } from "marked";

export function MarkdownPreviewerTool() {
  const [input, setInput] = useState("# Hello\n\nType **Markdown** here.");

  const handleDownload = useCallback(() => {
    if (!input.trim()) {
      toast.error("Please enter markdown to export");
      return;
    }
    const content = marked.parse(input, { async: false }) as string;
    const styles = `body{font-family:system-ui,sans-serif;max-width:65ch;margin:0 auto;padding:1.5rem;line-height:1.6}h1{font-size:1.875rem;margin-top:0;margin-bottom:0.5em}h2{font-size:1.5rem;margin-top:1.5em}h3{font-size:1.25rem}pre,code{background:#f1f5f9;padding:0.25em 0.5em;border-radius:0.25rem;font-size:0.875em}pre{overflow-x:auto;padding:1rem}pre code{padding:0}ul,ol{padding-left:1.5em}p{margin:0.5em 0}`;
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Exported</title><style>${styles}</style></head><body>${content}</body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "export.html";
    a.click();
    URL.revokeObjectURL(url);
  }, [input]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Markdown
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="# Your Markdown..."
            rows={12}
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 font-mono text-sm focus:ring-2 focus:ring-neutral-400 outline-none resize-y"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Preview
          </label>
          <div
            id="markdown-output"
            className="w-full min-h-[200px] px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-50 dark:bg-neutral-900/50 prose dark:prose-invert prose-sm max-w-none"
          >
            <ReactMarkdown>{input}</ReactMarkdown>
          </div>
        </div>
      </div>
      <button
        onClick={handleDownload}
        className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
      >
        Export HTML
      </button>
    </div>
  );
}
