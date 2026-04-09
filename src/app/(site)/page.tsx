import { ToolCard } from "@/components/ToolCard";
import { TOOLS, TOOL_CATEGORIES } from "@/lib/tools";

const toolsByCategory = TOOL_CATEGORIES.map((category) => ({
  category,
  tools: TOOLS.filter((t) => t.category === category),
}));

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          Free Developer Tools
        </h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Format JSON, decode JWTs, convert timestamps, test regex, and more.
          No installation required — all tools run in your browser.
        </p>
      </div>
      <div className="space-y-10">
        {toolsByCategory.map(
          ({ category, tools }) =>
            tools.length > 0 && (
              <section key={category}>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
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
