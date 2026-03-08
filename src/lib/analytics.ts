declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export function isAnalyticsEnabled(): boolean {
  return typeof GA_ID === "string" && GA_ID.length > 0;
}

export function trackEvent(
  toolSlug: string,
  action: string,
  label?: string
): void {
  if (typeof window === "undefined" || !isAnalyticsEnabled()) return;
  try {
    window.gtag?.("event", action, {
      event_category: "tool",
      event_label: label ?? toolSlug,
      tool_slug: toolSlug,
    });
  } catch {
    // ignore
  }
}
