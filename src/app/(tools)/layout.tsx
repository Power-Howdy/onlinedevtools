import { ToolNav } from "@/components/ToolNav";
import { RecentToolsTracker } from "@/components/RecentToolsTracker";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <RecentToolsTracker />
      <ToolNav />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
