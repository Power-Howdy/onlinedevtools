"use client";

import { useCallback } from "react";
import { format } from "sql-formatter";
import { InputOutput } from "@/components/InputOutput";

function formatSql(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  return format(trimmed, { language: "sql", keywordCase: "upper" });
}

export function SqlFormatterTool() {
  const handleTransform = useCallback((input: string) => {
    try {
      return formatSql(input);
    } catch (e) {
      throw new Error(e instanceof Error ? e.message : "Invalid SQL");
    }
  }, []);

  return (
    <InputOutput
      inputLabel="SQL Query"
      outputLabel="Formatted SQL"
      inputPlaceholder="SELECT * FROM users WHERE id = 1"
      outputPlaceholder="Formatted output will appear here..."
      onTransform={handleTransform}
    />
  );
}
