/** Canonical production URL (no trailing slash). */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://free-dev-tools.com";

export const SITE_HOST = new URL(SITE_URL).host;

/** Shown in OG images and other UI where the domain label is visible. */
export const SITE_DISPLAY_HOST = "free-dev-tools.com";

/** Previous hosts that should permanently redirect to the canonical domain. */
export const LEGACY_HOSTS = new Set([
  "onlinedevtools-three.vercel.app",
  "www.onlinedevtools-three.vercel.app",
  "onlinedevtools.com",
  "www.onlinedevtools.com",
]);
