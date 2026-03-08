export const CRON_PATTERNS: { slug: string; expr: string }[] = [
  { slug: "every-hour", expr: "0 * * * *" },
  { slug: "every-5-minutes", expr: "*/5 * * * *" },
  { slug: "daily-midnight", expr: "0 0 * * *" },
  { slug: "daily-noon", expr: "0 12 * * *" },
  { slug: "weekly-sunday", expr: "0 0 * * 0" },
  { slug: "monthly", expr: "0 0 1 * *" },
  { slug: "weekdays-9am", expr: "0 9 * * 1-5" },
  { slug: "every-15-minutes", expr: "*/15 * * * *" },
  { slug: "every-2-hours", expr: "0 */2 * * *" },
  { slug: "daily-3-30am", expr: "30 3 * * *" },
];
