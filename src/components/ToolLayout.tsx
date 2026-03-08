import type { Metadata } from "next";

type ToolLayoutProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function ToolLayout({ title, description, children }: ToolLayoutProps) {
  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          {title}
        </h1>
        <p className="mt-1 text-neutral-600 dark:text-neutral-400">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}
