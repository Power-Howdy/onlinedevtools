export const REGEX_PATTERNS = [
  {
    slug: "email",
    name: "Email",
    pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
    explanation: "Matches standard email addresses.",
    example: "user@example.com",
    keywords: ["email regex", "validate email", "email pattern", "regex email", "email validation"],
  },
  {
    slug: "url",
    name: "URL",
    pattern: "https?://[^\\s]+",
    explanation: "Matches HTTP and HTTPS URLs.",
    example: "https://example.com",
    keywords: ["url regex", "url pattern", "validate url", "http regex", "regex url"],
  },
  {
    slug: "ipv4",
    name: "IPv4 Address",
    pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b",
    explanation: "Matches IPv4 addresses.",
    example: "192.168.1.1",
    keywords: ["ipv4 regex", "ip address regex", "validate ip", "ip regex", "ipv4 pattern"],
  },
  {
    slug: "password",
    name: "Password (strong)",
    pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
    explanation: "At least 8 chars, 1 upper, 1 lower, 1 digit, 1 special.",
    example: "MyP@ssw0rd",
    keywords: ["password regex", "strong password regex", "validate password", "password pattern"],
  },
  {
    slug: "phone",
    name: "Phone Number",
    pattern: "\\+?[\\d\\s-()]{10,}",
    explanation: "Matches common phone number formats.",
    example: "+1 (555) 123-4567",
    keywords: ["phone regex", "phone number regex", "validate phone", "phone pattern", "regex phone"],
  },
  {
    slug: "hex-color",
    name: "Hex Color",
    pattern: "#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3}",
    explanation: "Matches hex color codes (#rgb or #rrggbb).",
    example: "#ff6600",
    keywords: ["hex color regex", "color code regex", "validate hex color", "hex regex", "rgb regex"],
  },
] as const;

export type RegexPatternSlug = (typeof REGEX_PATTERNS)[number]["slug"];
