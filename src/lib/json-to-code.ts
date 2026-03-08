type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

function safeName(key: string, pascalCase: boolean): string {
  const cleaned = key.replace(/[^a-zA-Z0-9_]/g, "_");
  if (/^\d/.test(cleaned)) return `_${cleaned}`;
  if (pascalCase && cleaned.length > 0) {
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
  return cleaned;
}

function tsType(val: JsonValue): string {
  if (val === null) return "null";
  if (typeof val === "string") return "string";
  if (typeof val === "number") return "number";
  if (typeof val === "boolean") return "boolean";
  if (Array.isArray(val)) {
    const itemType = val.length > 0 ? tsType(val[0]!) : "unknown";
    return `${itemType}[]`;
  }
  if (typeof val === "object") {
    const entries = Object.entries(val as Record<string, JsonValue>);
    const props = entries
      .map(([k, v]) => {
        const key = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : JSON.stringify(k);
        return `  ${key}: ${tsType(v)};`;
      })
      .join("\n");
    return `{\n${props}\n}`;
  }
  return "unknown";
}

function pythonType(val: JsonValue): string {
  if (val === null) return "Any";
  if (typeof val === "string") return "str";
  if (typeof val === "number") return "float";
  if (typeof val === "boolean") return "bool";
  if (Array.isArray(val)) {
    const itemType = val.length > 0 ? pythonType(val[0]!) : "Any";
    return `list[${itemType}]`;
  }
  if (typeof val === "object") {
    const entries = Object.entries(val as Record<string, JsonValue>);
    const props = entries
      .map(([k, v]) => `    ${safeName(k, false)}: ${pythonType(v)}`)
      .join("\n");
    return `dict`; // Simplified - could emit dataclass
  }
  return "Any";
}

export function jsonToTypeScript(obj: unknown, _name = "Root"): string {
  const o = obj as JsonValue;
  if (o === null) return "null";
  if (typeof o === "string") return "string";
  if (typeof o === "number") return "number";
  if (typeof o === "boolean") return "boolean";
  if (Array.isArray(o)) {
    const itemType = o.length > 0 ? jsonToTypeScript(o[0]!, "Item") : "unknown";
    return `${itemType}[]`;
  }
  if (typeof o === "object") {
    const entries = Object.entries(o as Record<string, JsonValue>);
    const props = entries
      .map(([key, val]) => {
        const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
        return `  ${safeKey}: ${jsonToTypeScript(val, key)};`;
      })
      .join("\n");
    return `{\n${props}\n}`;
  }
  return "unknown";
}

export function jsonToPython(obj: unknown, className = "Root"): string {
  const o = obj as JsonValue;
  if (o === null || typeof o !== "object" || Array.isArray(o)) {
    return `# ${className}\nfrom typing import Any, Optional\n\nclass ${className}:\n    pass`;
  }
  const entries = Object.entries(o as Record<string, JsonValue>);
  const attrs = entries
    .map(([k, v]) => `    ${safeName(k, false)}: ${pythonType(v)}`)
    .join("\n");
  return `from typing import Any, Optional\n\nclass ${safeName(className, true)}:\n${attrs}`;
}

export function jsonToJava(obj: unknown, className = "Root"): string {
  const o = obj as JsonValue;
  if (o === null || typeof o !== "object" || Array.isArray(o)) {
    return `public class ${safeName(className, true)} {\n}`;
  }
  const entries = Object.entries(o as Record<string, JsonValue>);

  function javaType(v: JsonValue): string {
    if (v === null) return "Object";
    if (typeof v === "string") return "String";
    if (typeof v === "number") return "double";
    if (typeof v === "boolean") return "boolean";
    if (Array.isArray(v)) return "List<Object>";
    return "Object";
  }

  const fields = entries
    .map(([k, v]) => `    private ${javaType(v)} ${safeName(k, false)};`)
    .join("\n");
  return `public class ${safeName(className, true)} {\n${fields}\n}`;
}

export function jsonToGo(obj: unknown, structName = "Root"): string {
  const o = obj as JsonValue;
  if (o === null || typeof o !== "object" || Array.isArray(o)) {
    return `type ${safeName(structName, true)} struct {}`;
  }
  const entries = Object.entries(o as Record<string, JsonValue>);

  function goType(v: JsonValue): string {
    if (v === null) return "interface{}";
    if (typeof v === "string") return "string";
    if (typeof v === "number") return "float64";
    if (typeof v === "boolean") return "bool";
    if (Array.isArray(v)) return "[]interface{}";
    return "map[string]interface{}";
  }

  const fields = entries
    .map(([k, v]) => `\t${safeName(k, true)} ${goType(v)} ` + "`json:\"" + k + "\"`")
    .join("\n");
  return `type ${safeName(structName, true)} struct {\n${fields}\n}`;
}

export function jsonToRust(obj: unknown, structName = "Root"): string {
  const o = obj as JsonValue;
  if (o === null || typeof o !== "object" || Array.isArray(o)) {
    return "#[derive(Debug, Serialize, Deserialize)]\npub struct " + safeName(structName, true) + " {}";
  }
  const entries = Object.entries(o as Record<string, JsonValue>);

  function rustType(v: JsonValue): string {
    if (v === null) return "Option<serde_json::Value>";
    if (typeof v === "string") return "String";
    if (typeof v === "number") return "f64";
    if (typeof v === "boolean") return "bool";
    if (Array.isArray(v)) return "Vec<serde_json::Value>";
    return "serde_json::Value";
  }

  const fields = entries
    .map(([k, v]) => `    pub ${safeName(k, false)}: ${rustType(v)},`)
    .join("\n");
  return "#[derive(Debug, Serialize, Deserialize)]\npub struct " + safeName(structName, true) + " {\n" + fields + "\n}";
}

export function jsonToCSharp(obj: unknown, className = "Root"): string {
  const o = obj as JsonValue;
  if (o === null || typeof o !== "object" || Array.isArray(o)) {
    return "public class " + safeName(className, true) + " { }";
  }
  const entries = Object.entries(o as Record<string, JsonValue>);

  function csharpType(v: JsonValue): string {
    if (v === null) return "object?";
    if (typeof v === "string") return "string";
    if (typeof v === "number") return "double";
    if (typeof v === "boolean") return "bool";
    if (Array.isArray(v)) return "List<object>";
    return "object";
  }

  const fields = entries
    .map(([k, v]) => `    [JsonProperty(\"${k}\")]\n    public ${csharpType(v)} ${safeName(k, true)} { get; set; }`)
    .join("\n\n");
  return "using System.Text.Json.Serialization;\n\npublic class " + safeName(className, true) + "\n{\n" + fields + "\n}";
}
