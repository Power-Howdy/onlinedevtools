import type { Tool } from "@/lib/tools";

export function toolMatches(tool: Tool, query: string): boolean {
  const n = query.trim().toLowerCase();
  if (!n) return true;
  return (
    tool.title.toLowerCase().includes(n) ||
    tool.description.toLowerCase().includes(n) ||
    tool.slug.toLowerCase().includes(n) ||
    tool.keywords.some((k) => k.toLowerCase().includes(n))
  );
}
