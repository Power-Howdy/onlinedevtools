import { Footer } from "@/components/Footer";
import { RecentToolsPanel } from "@/components/RecentToolsPanel";
import { RecentToolsTracker } from "@/components/RecentToolsTracker";
import { ToolNav } from "@/components/ToolNav";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col min-h-0 w-full">
      <RecentToolsTracker />
      <RecentToolsPanel />
      <div className="flex flex-1 flex-col md:flex-row min-h-0 w-full">
        <ToolNav />
        <div className="flex flex-1 flex-col min-w-0 min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto bg-pattern p-4 md:p-8">
            {children}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
