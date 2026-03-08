"use client";

import { useCallback } from "react";
import { InputOutput } from "@/components/InputOutput";

function base64Encode(input: string): string {
  try {
    return btoa(unescape(encodeURIComponent(input)));
  } catch {
    throw new Error("Failed to encode: contains invalid characters");
  }
}

function base64Decode(input: string): string {
  try {
    return decodeURIComponent(escape(atob(input.replace(/\s/g, ""))));
  } catch {
    throw new Error("Invalid Base64 string");
  }
}

export function Base64Tool() {
  const handleEncode = useCallback((input: string) => base64Encode(input), []);
  const handleDecode = useCallback((input: string) => base64Decode(input), []);

  return (
    <InputOutput
      inputLabel="Input"
      outputLabel="Output"
      inputPlaceholder="Paste text to encode or Base64 to decode..."
      outputPlaceholder="Output will appear here..."
      inputMode="both"
      onEncode={handleEncode}
      onDecode={handleDecode}
    />
  );
}
