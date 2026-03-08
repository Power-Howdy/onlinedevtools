export const TOOLS = [
  {
    slug: "json-formatter",
    title: "JSON Formatter & TypeScript Generator",
    description: "Format and validate JSON. Generate TypeScript interfaces from JSON. Copy or download output.",
  },
  {
    slug: "jwt-decoder",
    title: "JWT Decoder",
    description: "Decode and inspect JWT tokens. View header, payload, and expiration.",
  },
  {
    slug: "base64-encoder",
    title: "Base64 Encoder / Decoder",
    description: "Encode and decode Base64 strings. Works with text and binary data.",
  },
  {
    slug: "unix-timestamp",
    title: "Unix Timestamp Converter",
    description: "Convert Unix timestamp to human date and vice versa. Timezone support.",
  },
  {
    slug: "cron-parser",
    title: "Cron Expression Parser",
    description: "Parse cron expressions. Convert to human-readable schedule (e.g. every 5 minutes).",
  },
  {
    slug: "regex-tester",
    title: "Regex Tester",
    description: "Test regular expressions with match highlighting and explanation.",
  },
  {
    slug: "uuid-generator",
    title: "UUID Generator",
    description: "Generate UUID v4. Bulk generation and copy to clipboard.",
  },
  {
    slug: "markdown-previewer",
    title: "Markdown Previewer",
    description: "Preview Markdown as HTML. Export rendered output.",
  },
  {
    slug: "diff-checker",
    title: "Diff Checker",
    description: "Compare two texts or code blocks. Side-by-side and unified views.",
  },
  {
    slug: "sql-formatter",
    title: "SQL Formatter",
    description: "Format and beautify SQL queries. Indent and uppercase keywords.",
  },
  {
    slug: "url-encoder",
    title: "URL Encoder / Decoder",
    description: "Encode and decode URL parameters. Percent encoding support.",
  },
  {
    slug: "bcrypt-generator",
    title: "Bcrypt Generator",
    description: "Hash passwords with bcrypt. Compare hashes to verify.",
  },
  {
    slug: "sha256-generator",
    title: "SHA256 Generator",
    description: "Generate SHA256 hashes from text. Fast, client-side hashing.",
  },
  {
    slug: "html-encoder",
    title: "HTML Entity Encoder",
    description: "Encode and decode HTML entities (&, <, >, \", ').",
  },
  {
    slug: "color-converter",
    title: "Color Converter",
    description: "Convert between HEX, RGB, and HSL color formats.",
  },
  {
    slug: "random-data",
    title: "Random Data Generator",
    description: "Generate random strings, numbers, UUIDs, JSON, and hex.",
  },
] as const;

export type ToolSlug = (typeof TOOLS)[number]["slug"];
