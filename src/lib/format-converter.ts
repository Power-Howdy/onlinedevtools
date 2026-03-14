import { XMLParser, XMLBuilder } from "fast-xml-parser";
import YAML from "yaml";

export type SourceFormat = "csv" | "json" | "xml" | "yaml";
export type TargetFormat = "csv" | "json" | "xml" | "yaml";

function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if ((c === "," && !inQuotes) || c === "\n") {
      result.push(current);
      current = "";
      if (c === "\n") break;
    } else {
      current += c;
    }
  }
  result.push(current);
  return result;
}

export function parseCsv(input: string): unknown {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("Input is empty");
  const lines = trimmed.split(/\r?\n/).filter((l) => l.length > 0);
  if (lines.length === 0) throw new Error("CSV has no rows");
  const headers = parseCsvLine(lines[0]!);
  const rows = lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = values[i] ?? "";
    });
    return obj;
  });
  return rows;
}

export function parseJson(input: string): unknown {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("Input is empty");
  return JSON.parse(trimmed);
}

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  parseTagValue: true,
  parseAttributeValue: true,
});

const xmlBuilder = new XMLBuilder({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  format: true,
});

export function parseXml(input: string): unknown {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("Input is empty");
  const parsed = xmlParser.parse(trimmed);
  if (!parsed) throw new Error("Invalid XML");
  return parsed;
}

export function parseYaml(input: string): unknown {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("Input is empty");
  return YAML.parse(trimmed);
}

export function toCsv(data: unknown): string {
  if (!Array.isArray(data)) {
    throw new Error("CSV output requires an array of objects");
  }
  if (data.length === 0) return "";
  const first = data[0];
  if (!first || typeof first !== "object" || Array.isArray(first)) {
    throw new Error("CSV output requires an array of objects");
  }
  const headers = Object.keys(first as Record<string, unknown>);
  const rows = data.map((obj) =>
    headers.map((h) => escapeCsvCell((obj as Record<string, unknown>)[h])).join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}

export function toJson(data: unknown): string {
  return JSON.stringify(data, null, 2);
}

export function toXml(data: unknown): string {
  const wrapped = typeof data === "object" && data !== null ? { root: data } : { root: data };
  return xmlBuilder.build(wrapped);
}

export function toYaml(data: unknown): string {
  return YAML.stringify(data, { lineWidth: 0 });
}

const parsers: Record<SourceFormat, (input: string) => unknown> = {
  csv: parseCsv,
  json: parseJson,
  xml: parseXml,
  yaml: parseYaml,
};

const serializers: Record<TargetFormat, (data: unknown) => string> = {
  csv: toCsv,
  json: toJson,
  xml: toXml,
  yaml: toYaml,
};

export function convertFormat(
  input: string,
  source: SourceFormat,
  target: TargetFormat
): string {
  const parse = parsers[source];
  const serialize = serializers[target];
  const data = parse(input);
  return serialize(data);
}
