"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { addRecentTool } from "@/lib/recent-tools";

export function RecentToolsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const segment = pathname?.replace(/^\//, "").split("/")[0];
    if (segment) {
      addRecentTool(segment);
    }
  }, [pathname]);

  return null;
}
