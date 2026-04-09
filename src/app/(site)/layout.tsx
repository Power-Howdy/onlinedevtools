import { Footer } from "@/components/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col min-h-0">
      <div className="flex-1 min-h-0 bg-pattern">{children}</div>
      <Footer />
    </div>
  );
}
