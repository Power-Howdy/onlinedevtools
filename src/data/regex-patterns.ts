export const REGEX_PATTERNS = [
  { slug: "email", name: "Email", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}", explanation: "Matches standard email addresses.", example: "user@example.com" },
  { slug: "url", name: "URL", pattern: "https?://[^\\s]+", explanation: "Matches HTTP and HTTPS URLs.", example: "https://example.com" },
  { slug: "ipv4", name: "IPv4 Address", pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b", explanation: "Matches IPv4 addresses.", example: "192.168.1.1" },
  { slug: "password", name: "Password (strong)", pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$", explanation: "At least 8 chars, 1 upper, 1 lower, 1 digit, 1 special.", example: "MyP@ssw0rd" },
  { slug: "phone", name: "Phone Number", pattern: "\\+?[\\d\\s-()]{10,}", explanation: "Matches common phone number formats.", example: "+1 (555) 123-4567" },
  { slug: "hex-color", name: "Hex Color", pattern: "#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3}", explanation: "Matches hex color codes (#rgb or #rrggbb).", example: "#ff6600" },
] as const;

export type RegexPatternSlug = (typeof REGEX_PATTERNS)[number]["slug"];
