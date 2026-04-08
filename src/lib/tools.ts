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
  /** SEO title (defaults to title if omitted). */
  seoTitle?: string;
  /** SEO description (defaults to description if omitted). */
  seoDescription?: string;
  keywords: string[];
};

export const TOOLS: Tool[] = [
  {
    slug: "json-formatter",
    title: "JSON Formatter & TypeScript Generator",
    description:
      "Format and validate JSON. Generate TypeScript interfaces from JSON. Copy or download output.",
    category: "JSON",
    seoTitle: "Free JSON Formatter & TypeScript Interface Generator Online",
    seoDescription:
      "Format and validate JSON online. Generate TypeScript interfaces from JSON. Free JSON formatter, validator, and JSON-to-TypeScript converter.",
    keywords: [
      "json formatter",
      "format json",
      "validate json",
      "json validator",
      "json to typescript",
      "typescript from json",
      "json formatter online",
      "developer tools",
    ],
  },
  {
    slug: "json-to-csv",
    title: "JSON to CSV Converter",
    description: "Convert JSON array to CSV. Flatten objects and download or copy CSV.",
    category: "JSON",
    seoTitle: "Free JSON to CSV Converter Online",
    seoDescription:
      "Convert JSON array to CSV online. Flatten objects, download or copy CSV. Free JSON to CSV converter.",
    keywords: [
      "json to csv",
      "json csv converter",
      "convert json to csv",
      "export json to csv",
      "json array to csv",
      "developer tools",
    ],
  },
  {
    slug: "json-to-code",
    title: "JSON to Code Generator",
    description:
      "Convert JSON to TypeScript, Python, Java, Go, Rust, or C#. Select output language and generate types or classes.",
    category: "JSON",
    seoTitle: "Free JSON to Code Generator Online - TypeScript, Python, Java, Go, Rust, C#",
    seoDescription:
      "Convert JSON to TypeScript, Python, Java, Go, Rust, or C# code online. Generate types, classes, structs from JSON. Free JSON to code converter.",
    keywords: [
      "json to code",
      "json to typescript",
      "json to python",
      "json to java",
      "generate types from json",
      "json code generator",
      "developer tools",
    ],
  },
  {
    slug: "json-compare",
    title: "JSON Compare",
    description:
      "Compare two JSON documents structurally. Object key order is ignored; see aligned paths, added, removed, and changed values.",
    category: "JSON",
    seoTitle: "Free JSON Compare Online – Structural Diff",
    seoDescription:
      "Compare JSON online with structural diff. Ignores object key order. Side-by-side paths and values. Free JSON diff tool.",
    keywords: [
      "json compare",
      "json diff",
      "structural json diff",
      "compare json",
      "json difference",
      "jsondiff",
      "developer tools",
    ],
  },
  {
    slug: "format-converter",
    title: "Format Converter",
    description: "Convert between CSV, JSON, XML, and YAML. Select source and target formats.",
    category: "Data & Format",
    seoTitle: "Free CSV JSON XML YAML Converter Online",
    seoDescription:
      "Convert between CSV, JSON, XML, and YAML online. Paste your data and convert between formats instantly. Free format converter.",
    keywords: [
      "format converter",
      "csv to json",
      "json to xml",
      "yaml to json",
      "data format converter",
      "csv json xml yaml",
      "developer tools",
    ],
  },
  {
    slug: "sql-formatter",
    title: "SQL Formatter",
    description: "Format and beautify SQL queries. Indent and uppercase keywords.",
    category: "Data & Format",
    seoTitle: "Free SQL Formatter Online",
    seoDescription:
      "Format and beautify SQL queries online. Indent and uppercase keywords. Free SQL formatter.",
    keywords: [
      "sql formatter",
      "format sql",
      "beautify sql",
      "sql pretty print",
      "sql formatter online",
      "sql beautifier",
      "developer tools",
    ],
  },
  {
    slug: "diff-checker",
    title: "Diff Checker",
    description: "Compare two texts or code blocks. Side-by-side and unified views.",
    category: "Data & Format",
    seoTitle: "Free Diff Checker Online",
    seoDescription:
      "Compare two texts or code blocks online. Highlight differences. Side-by-side and unified diff.",
    keywords: [
      "diff checker",
      "text diff",
      "compare text",
      "code diff",
      "side by side diff",
      "unified diff",
      "developer tools",
    ],
  },
  {
    slug: "markdown-previewer",
    title: "Markdown Previewer",
    description: "Preview Markdown as HTML. Export rendered output.",
    category: "Data & Format",
    seoTitle: "Free Markdown Previewer Online",
    seoDescription:
      "Preview Markdown as HTML online. Live Markdown editor and viewer. Export to HTML.",
    keywords: [
      "markdown preview",
      "markdown previewer",
      "markdown to html",
      "preview markdown online",
      "markdown editor",
      "developer tools",
    ],
  },
  {
    slug: "html-to-markdown",
    title: "HTML to Markdown Converter",
    description: "Convert HTML to Markdown. Paste HTML and get clean Markdown output.",
    category: "Data & Format",
    seoTitle: "Free HTML to Markdown Converter Online",
    seoDescription:
      "Convert HTML to Markdown online. Paste HTML and get clean Markdown output. Free HTML to Markdown converter.",
    keywords: [
      "html to markdown",
      "convert html to markdown",
      "html markdown converter",
      "strip html to markdown",
      "developer tools",
    ],
  },
  {
    slug: "color-converter",
    title: "Color Converter",
    description: "Convert between HEX, RGB, and HSL color formats.",
    category: "Data & Format",
    seoTitle: "Free Color Converter - HEX to RGB to HSL",
    seoDescription:
      "Convert between HEX, RGB, and HSL color formats. Free online color converter for developers and designers.",
    keywords: [
      "color converter",
      "hex to rgb",
      "rgb to hex",
      "hex to hsl",
      "color picker",
      "hex rgb hsl",
      "developer tools",
    ],
  },
  {
    slug: "base64-encoder",
    title: "Base64 Encoder / Decoder",
    description: "Encode and decode Base64 strings. Works with text and binary data.",
    category: "Encoding",
    seoTitle: "Free Base64 Encoder Decoder Online",
    seoDescription:
      "Encode and decode Base64 strings online. Works with text and binary data. Free Base64 encoder and decoder.",
    keywords: [
      "base64 encode",
      "base64 decode",
      "base64 encoder",
      "base64 decoder",
      "base64 online",
      "encode decode base64",
      "developer tools",
    ],
  },
  {
    slug: "url-encoder",
    title: "URL Encoder / Decoder",
    description: "Encode and decode URL parameters. Percent encoding support.",
    category: "Encoding",
    seoTitle: "Free URL Encoder Decoder Online",
    seoDescription:
      "Encode and decode URL parameters online. Percent encoding. Free URL encoder and decoder.",
    keywords: [
      "url encode",
      "url decode",
      "percent encoding",
      "url encoder",
      "url decoder",
      "encode url parameters",
      "developer tools",
    ],
  },
  {
    slug: "cookie-compare",
    title: "Cookie Header Viewer & Compare",
    description:
      "Parse Cookie header strings into name/value pairs. Compare two cookie headers side by side with added, removed, and changed values.",
    category: "Encoding",
    seoTitle: "Free Cookie Header Viewer & Compare Online",
    seoDescription:
      "View and compare HTTP Cookie headers online. Parse name=value pairs, highlight differences. Free cookie compare tool.",
    keywords: [
      "cookie header",
      "cookie viewer",
      "compare cookies",
      "set-cookie",
      "http cookie",
      "cookie parser",
      "developer tools",
    ],
  },
  {
    slug: "params-compare",
    title: "Query Params Compare",
    description:
      "Compare query strings or full URLs. See which parameters differ, including repeated keys.",
    category: "Encoding",
    seoTitle: "Free Query String & URL Params Compare Online",
    seoDescription:
      "Compare URL query parameters online. Paste two URLs or query strings; see added, removed, and changed params.",
    keywords: [
      "query params compare",
      "url params",
      "compare query string",
      "url comparison",
      "search params",
      "developer tools",
    ],
  },
  {
    slug: "html-encoder",
    title: "HTML Entity Encoder",
    description: 'Encode and decode HTML entities (&, <, >, ", \').',
    category: "Encoding",
    seoTitle: "Free HTML Entity Encoder Decoder Online",
    seoDescription:
      'Encode and decode HTML entities (&, <, >, ", \'). Protect against XSS and format HTML strings.',
    keywords: [
      "html encode",
      "html decode",
      "html entities",
      "html entity encoder",
      "escape html",
      "developer tools",
    ],
  },
  {
    slug: "bcrypt-generator",
    title: "Bcrypt Generator",
    description: "Hash passwords with bcrypt. Compare hashes to verify.",
    category: "Security & Auth",
    seoTitle: "Free Bcrypt Password Hasher Online",
    seoDescription:
      "Hash passwords with bcrypt online. Compare hashes to verify passwords. Free bcrypt generator and verifier.",
    keywords: [
      "bcrypt",
      "bcrypt hash",
      "bcrypt generator",
      "password hash",
      "bcrypt online",
      "hash password",
      "developer tools",
    ],
  },
  {
    slug: "password-generator",
    title: "Password Generator",
    description: "Generate secure random passwords. Customize length and character types.",
    category: "Security & Auth",
    seoTitle: "Free Password Generator Online – Secure Random Password",
    seoDescription:
      "Generate secure random passwords online. Customize length and character types. Free password generator.",
    keywords: [
      "password generator",
      "random password",
      "secure password",
      "generate password",
      "strong password",
      "developer tools",
    ],
  },
  {
    slug: "sha256-generator",
    title: "SHA256 Generator",
    description: "Generate SHA256 hashes from text. Fast, client-side hashing.",
    category: "Security & Auth",
    seoTitle: "Free SHA256 Hash Generator Online",
    seoDescription:
      "Generate SHA256 hashes from text online. Fast, client-side hashing. No data sent to server.",
    keywords: [
      "sha256",
      "sha256 hash",
      "sha256 generator",
      "hash generator",
      "sha256 online",
      "developer tools",
    ],
  },
  {
    slug: "jwt-decoder",
    title: "JWT Decoder",
    description: "Decode and inspect JWT tokens. View header, payload, and expiration.",
    category: "Security & Auth",
    seoTitle: "Free JWT Decoder Online – Decode JWT Token",
    seoDescription:
      "Decode and inspect JWT tokens online. View header, payload, and expiration. Free JWT decoder and debugger.",
    keywords: [
      "jwt decoder",
      "decode jwt",
      "jwt decode",
      "jwt parser",
      "inspect jwt",
      "jwt online",
      "developer tools",
    ],
  },
  {
    slug: "jwt-generator",
    title: "JWT Generator",
    description:
      "Generate JWT tokens with custom header and payload. Sign with HMAC-SHA256. Pair with JWT Decoder.",
    category: "Security & Auth",
    seoTitle: "Free JWT Generator Online – Create JWT Token",
    seoDescription:
      "Generate JWT tokens online with custom header and payload. Sign with HMAC-SHA256. Free JWT generator. Pair with JWT Decoder.",
    keywords: [
      "jwt generator",
      "generate jwt",
      "create jwt",
      "jwt sign",
      "hmac sha256 jwt",
      "jwt token generator",
      "developer tools",
    ],
  },
  {
    slug: "uuid-generator",
    title: "UUID Generator",
    description: "Generate UUID v4. Bulk generation and copy to clipboard.",
    category: "Generators",
    seoTitle: "Free UUID Generator Online",
    seoDescription:
      "Generate UUID v4 online. Bulk UUID generation. Copy to clipboard. Free UUID and GUID generator.",
    keywords: [
      "uuid generator",
      "generate uuid",
      "uuid v4",
      "guid generator",
      "random uuid",
      "developer tools",
    ],
  },
  {
    slug: "random-data",
    title: "Random Data Generator",
    description: "Generate random strings, numbers, UUIDs, JSON, and hex.",
    category: "Generators",
    seoTitle: "Free Random Data Generator Online",
    seoDescription:
      "Generate random strings, numbers, UUIDs, hex values, and JSON. Secure client-side random generation.",
    keywords: [
      "random data",
      "random string",
      "random number",
      "random json",
      "fake data generator",
      "developer tools",
    ],
  },
  {
    slug: "unix-timestamp",
    title: "Unix Timestamp Converter",
    description: "Convert Unix timestamp to human date and vice versa. Timezone support.",
    category: "Time",
    seoTitle: "Free Unix Timestamp Converter Online",
    seoDescription:
      "Convert Unix timestamp to date and date to Unix timestamp. Epoch time converter with timezone support.",
    keywords: [
      "unix timestamp",
      "timestamp converter",
      "unix time",
      "epoch converter",
      "timestamp to date",
      "developer tools",
    ],
  },
  {
    slug: "cron-parser",
    title: "Cron Expression Parser",
    description:
      "Parse cron expressions. Convert to human-readable schedule (e.g. every 5 minutes).",
    category: "Time",
    seoTitle: "Free Cron Expression Parser Online",
    seoDescription:
      "Parse and explain cron expressions. Convert cron syntax to human-readable schedule. Free cron expression parser.",
    keywords: [
      "cron parser",
      "cron expression",
      "cron schedule",
      "parse cron",
      "cron to human readable",
      "developer tools",
    ],
  },
  {
    slug: "regex-tester",
    title: "Regex Tester",
    description: "Test regular expressions with match highlighting and explanation.",
    category: "Utilities",
    seoTitle: "Free Regex Tester Online",
    seoDescription:
      "Test regular expressions online. Match highlighting and validation. Free regex tester and validator.",
    keywords: [
      "regex tester",
      "regex test",
      "regular expression",
      "regex online",
      "regex debug",
      "pattern match",
      "developer tools",
    ],
  },
  {
    slug: "open-graph-viewer",
    title: "Open Graph Viewer",
    description: "Fetch and inspect Open Graph metadata for any URL.",
    category: "Utilities",
    seoTitle: "Open Graph Viewer – Preview OG tags for any URL",
    seoDescription:
      "Fetch and inspect Open Graph metadata for any URL. Preview og:image, og:title, og:description, and more, similar to the Vercel Toolbar OG viewer.",
    keywords: [
      "open graph",
      "og tags",
      "og:image",
      "og:title",
      "preview link",
      "social meta tags",
      "developer tools",
    ],
  },
];

export type ToolSlug = (typeof TOOLS)[number]["slug"];
