import { stringify as yamlStringify } from "yaml";

export type ExportRecord = Record<string, unknown>;

export type SqlExportOptions = {
  tableName: string;
  columns?: readonly string[];
  batchSize?: number;
  snakeCase?: boolean;
};

const DEFAULT_SQL_BATCH = 100;

/** camelCase / PascalCase → snake_case */
export function toSnakeCase(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1_$2")
    .replace(/-/g, "_")
    .toLowerCase();
}

export function recordsToJson(rows: readonly ExportRecord[]): string {
  return JSON.stringify(rows, null, 2);
}

function escapeCsvCell(value: string): string {
  if (
    value.includes(",") ||
    value.includes('"') ||
    value.includes("\n") ||
    value.includes("\r")
  ) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function cellToString(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "boolean" || typeof value === "number") return String(value);
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export function recordsToCsv(
  rows: readonly ExportRecord[],
  columns?: readonly string[]
): string {
  if (rows.length === 0) {
    return columns?.length ? columns.join(",") : "";
  }
  const keys =
    columns && columns.length > 0
      ? [...columns]
      : Object.keys(rows[0] as ExportRecord);
  const header = keys.join(",");
  const body = rows.map((row) =>
    keys.map((key) => escapeCsvCell(cellToString(row[key]))).join(",")
  );
  return [header, ...body].join("\n");
}

export function recordsToYaml(rows: readonly ExportRecord[]): string {
  return yamlStringify(rows, { lineWidth: 0 });
}

function quoteIdent(name: string): string {
  return `"${name.replace(/"/g, '""')}"`;
}

function sqlLiteral(value: unknown): string {
  if (value == null) return "NULL";
  if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return "NULL";
    return String(value);
  }
  const text =
    typeof value === "object" ? JSON.stringify(value) : String(value);
  return `'${text.replace(/'/g, "''")}'`;
}

export function recordsToSql(
  rows: readonly ExportRecord[],
  options: SqlExportOptions
): string {
  if (rows.length === 0) return "";

  const table = options.tableName.trim() || "records";
  const batchSize = Math.max(1, options.batchSize ?? DEFAULT_SQL_BATCH);
  const rawColumns =
    options.columns && options.columns.length > 0
      ? [...options.columns]
      : Object.keys(rows[0] as ExportRecord);
  const columnNames = options.snakeCase
    ? rawColumns.map(toSnakeCase)
    : rawColumns;
  const colsSql = columnNames.map(quoteIdent).join(", ");
  const tableSql = quoteIdent(table);

  const statements: string[] = [];
  for (let i = 0; i < rows.length; i += batchSize) {
    const chunk = rows.slice(i, i + batchSize);
    const values = chunk
      .map((row) => {
        const literals = rawColumns.map((key) => sqlLiteral(row[key]));
        return `(${literals.join(", ")})`;
      })
      .join(",\n  ");
    statements.push(
      `INSERT INTO ${tableSql} (${colsSql}) VALUES\n  ${values};`
    );
  }
  return statements.join("\n\n");
}

export function downloadTextFile(
  filename: string,
  contents: string,
  mime: string
): void {
  const blob = new Blob([contents], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export const EXPORT_MIME = {
  json: "application/json;charset=utf-8",
  csv: "text/csv;charset=utf-8",
  yaml: "text/yaml;charset=utf-8",
  sql: "application/sql;charset=utf-8",
  txt: "text/plain;charset=utf-8",
} as const;
