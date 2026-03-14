export const TOOL_CATEGORIES = [
  "JSON",
  "Data & Format",
  "Encoding",
  "Security & Auth",
  "Generators",
  "Time",
  "Utilities",
] as const;

export type ToolCategory = (typeof TOOL_CATEGORIES)[number];

export type Tool = {
  slug: string;
  title: string;
  description: string;
  category: ToolCategory;
};

export const TOOLS: Tool[] = [
  {
    slug: "json-formatter",
    title: "JSON Formatter & TypeScript Generator",
    description:
      "Format and validate JSON. Generate TypeScript interfaces from JSON. Copy or download output.",
    category: "JSON",
  },
  {
    slug: "json-to-csv",
    title: "JSON to CSV Converter",
    description: "Convert JSON array to CSV. Flatten objects and download or copy CSV.",
    category: "JSON",
  },
  {
    slug: "json-to-typescript",
    title: "JSON to TypeScript Interface Generator",
    description: "Convert JSON to TypeScript interface online. Generate TypeScript types from JSON.",
    category: "JSON",
  },
  {
    slug: "json-to-python",
    title: "JSON to Python Class Generator",
    description:
      "Convert JSON to Python dataclass or class online. Generate Python models from JSON.",
    category: "JSON",
  },
  {
    slug: "json-to-java",
    title: "JSON to Java Class Generator",
    description: "Convert JSON to Java POJO or record. Generate Java model classes from JSON.",
    category: "JSON",
  },
  {
    slug: "json-to-go",
    title: "JSON to Go Struct Generator",
    description: "Convert JSON to Go struct. Generate Go struct definitions from JSON.",
    category: "JSON",
  },
  {
    slug: "json-to-rust",
    title: "JSON to Rust Struct Generator",
    description:
      "Convert JSON to Rust struct. Generate Rust struct and serde derives from JSON.",
    category: "JSON",
  },
  {
    slug: "json-to-csharp",
    title: "JSON to C# Class Generator",
    description:
      "Convert JSON to C# class. Generate C# model classes with JsonProperty from JSON.",
    category: "JSON",
  },
  {
    slug: "format-converter",
    title: "Format Converter",
    description: "Convert between CSV, JSON, XML, and YAML. Select source and target formats.",
    category: "Data & Format",
  },
  {
    slug: "sql-formatter",
    title: "SQL Formatter",
    description: "Format and beautify SQL queries. Indent and uppercase keywords.",
    category: "Data & Format",
  },
  {
    slug: "diff-checker",
    title: "Diff Checker",
    description: "Compare two texts or code blocks. Side-by-side and unified views.",
    category: "Data & Format",
  },
  {
    slug: "markdown-previewer",
    title: "Markdown Previewer",
    description: "Preview Markdown as HTML. Export rendered output.",
    category: "Data & Format",
  },
  {
    slug: "html-to-markdown",
    title: "HTML to Markdown Converter",
    description: "Convert HTML to Markdown. Paste HTML and get clean Markdown output.",
    category: "Data & Format",
  },
  {
    slug: "color-converter",
    title: "Color Converter",
    description: "Convert between HEX, RGB, and HSL color formats.",
    category: "Data & Format",
  },
  {
    slug: "base64-encoder",
    title: "Base64 Encoder / Decoder",
    description: "Encode and decode Base64 strings. Works with text and binary data.",
    category: "Encoding",
  },
  {
    slug: "url-encoder",
    title: "URL Encoder / Decoder",
    description: "Encode and decode URL parameters. Percent encoding support.",
    category: "Encoding",
  },
  {
    slug: "html-encoder",
    title: "HTML Entity Encoder",
    description: 'Encode and decode HTML entities (&, <, >, ", \').',
    category: "Encoding",
  },
  {
    slug: "bcrypt-generator",
    title: "Bcrypt Generator",
    description: "Hash passwords with bcrypt. Compare hashes to verify.",
    category: "Security & Auth",
  },
  {
    slug: "password-generator",
    title: "Password Generator",
    description: "Generate secure random passwords. Customize length and character types.",
    category: "Security & Auth",
  },
  {
    slug: "sha256-generator",
    title: "SHA256 Generator",
    description: "Generate SHA256 hashes from text. Fast, client-side hashing.",
    category: "Security & Auth",
  },
  {
    slug: "jwt-decoder",
    title: "JWT Decoder",
    description: "Decode and inspect JWT tokens. View header, payload, and expiration.",
    category: "Security & Auth",
  },
  {
    slug: "jwt-generator",
    title: "JWT Generator",
    description:
      "Generate JWT tokens with custom header and payload. Sign with HMAC-SHA256. Pair with JWT Decoder.",
    category: "Security & Auth",
  },
  {
    slug: "uuid-generator",
    title: "UUID Generator",
    description: "Generate UUID v4. Bulk generation and copy to clipboard.",
    category: "Generators",
  },
  {
    slug: "random-data",
    title: "Random Data Generator",
    description: "Generate random strings, numbers, UUIDs, JSON, and hex.",
    category: "Generators",
  },
  {
    slug: "unix-timestamp",
    title: "Unix Timestamp Converter",
    description: "Convert Unix timestamp to human date and vice versa. Timezone support.",
    category: "Time",
  },
  {
    slug: "cron-parser",
    title: "Cron Expression Parser",
    description:
      "Parse cron expressions. Convert to human-readable schedule (e.g. every 5 minutes).",
    category: "Time",
  },
  {
    slug: "regex-tester",
    title: "Regex Tester",
    description: "Test regular expressions with match highlighting and explanation.",
    category: "Utilities",
  },
  {
    slug: "open-graph-viewer",
    title: "Open Graph Viewer",
    description: "Fetch and inspect Open Graph metadata for any URL.",
    category: "Utilities",
  },
];

export type ToolSlug = (typeof TOOLS)[number]["slug"];
