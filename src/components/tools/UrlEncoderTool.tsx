"use client";

import { useCallback } from "react";
import { InputOutput } from "@/components/InputOutput";

function encodeUrl(input: string): string {
  return encodeURIComponent(input);
}

function decodeUrl(input: string): string {
  try {
    return decodeURIComponent(input.replace(/\+/g, " "));
  } catch {
    throw new Error("Invalid URL-encoded string");
  }
}

export function UrlEncoderTool() {
  const handleEncode = useCallback(encodeUrl, []);
  const handleDecode = useCallback(decodeUrl, []);

  return (
    <InputOutput
      inputLabel="Input"
      outputLabel="Output"
      inputPlaceholder="Text to encode or URL-encoded string to decode..."
      outputPlaceholder="Output will appear here..."
      inputMode="both"
      onEncode={handleEncode}
      onDecode={handleDecode}
    />
  );
}
