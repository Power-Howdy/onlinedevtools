"use client";

type AdSlotProps = {
  format?: "rectangle" | "horizontal" | "vertical";
  className?: string;
};

export function AdSlot({ format = "rectangle", className = "" }: AdSlotProps) {
  const style =
    format === "rectangle"
      ? "min-h-[250px] min-w-[300px]"
      : format === "horizontal"
        ? "min-h-[90px] w-full max-w-[728px]"
        : "min-h-[600px] min-w-[160px]";

  return (
    <div
      className={`flex items-center justify-center rounded-lg border border-dashed border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-900/50 ${style} ${className}`}
      data-ad-slot
      role="complementary"
      aria-label="Advertisement"
    >
      <span className="text-xs text-neutral-400 dark:text-neutral-500">
        Ad placeholder
      </span>
    </div>
  );
}
