/** Canonical production URL (no trailing slash). */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://free-dev-tools.com";

export const SITE_HOST = new URL(SITE_URL).host;

/** Shown in OG images and other UI where the domain label is visible. */
export const SITE_DISPLAY_HOST = "free-dev-tools.com";

/** Public product name used in UI, titles, and structured data. */
export const SITE_NAME = "Online Dev Tools";

/** Short phrase for headers and footers. */
export const SITE_TAGLINE = "Free developer utilities — no sign-up";

/**
 * Homepage / default document title (~60 chars).
 * Lead with the search intent; brand at the end.
 */
export const SITE_TITLE =
  "Free Developer Utilities – No Sign Up | Online Dev Tools";

/**
 * Meta description for the homepage and site-wide default.
 * Include privacy / local processing differentiators.
 */
export const SITE_DESCRIPTION =
  "Free developer utilities with no sign-up and no install. Format JSON, decode JWTs, test regex, convert timestamps, create PDF invoices, generate signatures, and more — privacy-first tools that run in your browser.";

export const SITE_OG_DESCRIPTION =
  "Free developer utilities online. No sign-up, no tracking on your data. JSON, JWT, regex, timestamps, PDF invoice maker, signature generator, and 30+ browser-based tools.";

/** Homepage-focused keywords (also merged into tool pages lightly). */
export const SITE_KEYWORDS = [
  "free developer utilities",
  "free developer tools",
  "developer utilities no sign up",
  "online developer tools",
  "online dev tools",
  "browser based developer tools",
  "privacy first developer tools",
  "no signup developer tools",
  "free online tools for developers",
  "client side developer tools",
  "json formatter",
  "jwt decoder",
  "regex tester",
  "unix timestamp converter",
  "base64 encoder",
  "uuid generator",
  "sql formatter",
  "free pdf invoice generator",
  "online invoice maker",
  "free signature generator",
  "online signature maker",
  "free-dev-tools.com",
];

/** Previous hosts that should permanently redirect to the canonical domain. */
export const LEGACY_HOSTS = new Set([
  "onlinedevtools-three.vercel.app",
  "www.onlinedevtools-three.vercel.app",
  "onlinedevtools.com",
  "www.onlinedevtools.com",
]);
