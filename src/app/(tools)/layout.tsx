import { ToolNav } from "@/components/ToolNav";
import { RecentToolsTracker } from "@/components/RecentToolsTracker";
import { RecentToolsPanel } from "@/components/RecentToolsPanel";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <RecentToolsTracker />
      <RecentToolsPanel />
      <div
        className="flex flex-col md:flex-row min-h-0 overflow-hidden md:h-[calc(100vh-var(--header-height)-var(--footer-height)/2)]"
      >
        <ToolNav />
        <div className="flex-1 min-w-0 min-h-0 overflow-y-auto">{children}</div>
      </div>
    </>
  );
}
