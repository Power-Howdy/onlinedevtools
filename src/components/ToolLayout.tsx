import { ToolAnalyticsProvider } from "@/contexts/ToolAnalyticsContext";
import { getToolNavIcon } from "@/data/tool-nav-icons";

type ToolLayoutProps = {
  title: string;
  description: string;
  slug?: string;
  children: React.ReactNode;
};

function iconSlugForNav(slug?: string): string | undefined {
  if (!slug) return undefined;
  if (slug.startsWith("regex/")) return "regex-tester";
  if (slug.startsWith("cron-explainer/")) return "cron-parser";
  const base = slug.split("/")[0];
  return base || undefined;
}

export function ToolLayout({ title, description, slug, children }: ToolLayoutProps) {
  const key = iconSlugForNav(slug);
  const Icon = key ? getToolNavIcon(key) : null;

  const content = (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          {Icon && (
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-6 w-6" aria-hidden />
            </span>
          )}
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{title}</h1>
        </div>
        <p className="mt-2 text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      <div className="tool-view">{children}</div>
    </section>
  );
  return slug ? (
    <ToolAnalyticsProvider slug={slug}>{content}</ToolAnalyticsProvider>
  ) : (
    content
  );
}
