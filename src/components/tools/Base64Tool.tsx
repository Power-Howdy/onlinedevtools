"use client";

import { useCallback } from "react";
import { InputOutput } from "@/components/InputOutput";

function base64Encode(input: string): string {
  try {
    const bytes = new TextEncoder().encode(input);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  } catch {
    throw new Error("Failed to encode: contains invalid characters");
  }
}

function base64Decode(input: string): string {
  try {
    const binary = atob(input.replace(/\s/g, ""));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
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
