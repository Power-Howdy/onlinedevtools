"use client";

import { useCallback } from "react";
import { InputOutput } from "@/components/InputOutput";

const ENTITY_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;",
};

function encodeHtml(input: string): string {
  if (!input.trim()) throw new Error("Please enter text to encode");
  return input.replace(/[&<>"'/]/g, (c) => ENTITY_MAP[c] ?? c);
}

function decodeHtml(input: string): string {
  if (!input.trim()) throw new Error("Please enter HTML entities to decode");
  return input
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x2F;/g, "/")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

export function HtmlEncoderTool() {
  const handleEncode = useCallback((input: string) => encodeHtml(input), []);
  const handleDecode = useCallback((input: string) => decodeHtml(input), []);

  return (
    <InputOutput
      inputLabel="Input"
      outputLabel="Output"
      inputPlaceholder="Paste text to encode or HTML entities to decode..."
      outputPlaceholder="Output will appear here..."
      inputMode="both"
      onEncode={handleEncode}
      onDecode={handleDecode}
    />
  );
}
