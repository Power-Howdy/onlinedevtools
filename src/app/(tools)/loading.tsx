export default function ToolsLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3" />
        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3" />
        <div className="h-32 bg-neutral-200 dark:bg-neutral-700 rounded" />
      </div>
    </div>
  );
}
