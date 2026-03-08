export const JSON_TO_LANG_LANGUAGES = [
  "typescript",
  "python",
  "java",
  "go",
  "rust",
  "csharp",
] as const;

export type JsonToLangSlug = (typeof JSON_TO_LANG_LANGUAGES)[number];

export const JSON_TO_LANG_DATA: Record<
  JsonToLangSlug,
  { title: string; description: string; label: string }
> = {
  typescript: {
    title: "JSON to TypeScript Interface Generator",
    description:
      "Convert JSON to TypeScript interface online. Generate TypeScript types from JSON.",
    label: "TypeScript",
  },
  python: {
    title: "JSON to Python Class Generator",
    description:
      "Convert JSON to Python dataclass or class online. Generate Python models from JSON.",
    label: "Python",
  },
  java: {
    title: "JSON to Java Class Generator",
    description:
      "Convert JSON to Java POJO or record. Generate Java model classes from JSON.",
    label: "Java",
  },
  go: {
    title: "JSON to Go Struct Generator",
    description:
      "Convert JSON to Go struct. Generate Go struct definitions from JSON.",
    label: "Go",
  },
  rust: {
    title: "JSON to Rust Struct Generator",
    description:
      "Convert JSON to Rust struct. Generate Rust struct and serde derives from JSON.",
    label: "Rust",
  },
  csharp: {
    title: "JSON to C# Class Generator",
    description:
      "Convert JSON to C# class. Generate C# model classes with JsonProperty from JSON.",
    label: "C#",
  },
};
