"use client";

import { useCallback } from "react";
import { InputOutput } from "@/components/InputOutput";

function formatJson(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  const parsed = JSON.parse(trimmed);
  return JSON.stringify(parsed, null, 2);
}

export function JsonFormatterTool() {
  const handleTransform = useCallback((input: string) => {
    try {
      return formatJson(input);
    } catch (e) {
      throw new Error(e instanceof Error ? e.message : "Invalid JSON");
    }
  }, []);

  return (
    <InputOutput
      inputLabel="JSON Input"
      outputLabel="Formatted JSON"
      inputPlaceholder='{"key": "value", "array": [1, 2, 3]}'
      outputPlaceholder="Formatted output will appear here..."
      onTransform={handleTransform}
    />
  );
}
