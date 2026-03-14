"use client";

import { useCallback } from "react";
import { InputOutput } from "@/components/InputOutput";

function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function jsonToCsv(input: string): string {
  if (!input.trim()) throw new Error("Please enter JSON to convert");
  const parsed = JSON.parse(input);
  if (!Array.isArray(parsed)) {
    throw new Error("JSON must be an array of objects");
  }
  if (parsed.length === 0) return "";

  const headers = Object.keys(parsed[0]);
  const rows = parsed.map((obj: Record<string, unknown>) =>
    headers.map((h) => escapeCsvCell(obj[h])).join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}

export function JsonToCsvTool() {
  const handleTransform = useCallback((input: string) => {
    return jsonToCsv(input);
  }, []);

  return (
    <InputOutput
      inputLabel="JSON (array of objects)"
      outputLabel="CSV"
      inputPlaceholder='[{"name":"Alice","age":30},{"name":"Bob","age":25}]'
      outputPlaceholder="CSV output will appear here..."
      onTransform={handleTransform}
    />
  );
}
