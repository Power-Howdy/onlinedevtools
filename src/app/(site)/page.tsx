import { Lock, Sparkles, Terminal } from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import { TOOLS, TOOL_CATEGORIES } from "@/lib/tools";

const toolsByCategory = TOOL_CATEGORIES.map((category) => ({
  category,
  tools: TOOLS.filter((t) => t.category === category),
}));

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
      <section className="mb-14 md:mb-16">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary md:h-24 md:w-24">
            <Terminal className="h-10 w-10 md:h-12 md:w-12" strokeWidth={1.75} aria-hidden />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-4xl">
            Free Developer Tools
          </h1>
          <p className="mt-3 max-w-2xl text-base text-slate-600 dark:text-slate-400 md:text-lg">
            Format JSON, decode JWTs, convert timestamps, test regex, and more. No installation required — everything
            runs in your browser.
          </p>
          <div className="mt-10 grid w-full max-w-2xl gap-4 sm:grid-cols-2 text-left">
            <div className="rounded-2xl border border-light-border bg-light-card p-5 shadow-sm dark:border-dark-border dark:bg-dark-card">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Lock className="h-5 w-5" aria-hidden />
              </div>
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">Privacy-first</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Your data stays on your device. No accounts, no tracking on the tools you use.
              </p>
            </div>
            <div className="rounded-2xl border border-light-border bg-light-card p-5 shadow-sm dark:border-dark-border dark:bg-dark-card">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" aria-hidden />
              </div>
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">Smart utilities</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {TOOLS.length}+ focused tools for everyday dev work — fast, keyboard-friendly, and free.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-10">
        {toolsByCategory.map(
          ({ category, tools }) =>
            tools.length > 0 && (
              <section key={category}>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {category}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {tools.map((tool) => (
                    <ToolCard
                      key={tool.slug}
                      slug={tool.slug}
                      title={tool.title}
                      description={tool.description}
                    />
                  ))}
                </div>
              </section>
            )
        )}
      </div>
    </div>
  );
}
