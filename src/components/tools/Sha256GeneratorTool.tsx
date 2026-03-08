"use client";

import { useCallback } from "react";
import { InputOutput } from "@/components/InputOutput";

async function sha256(input: string): Promise<string> {
  if (!input.trim()) throw new Error("Please enter text to hash");
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function Sha256GeneratorTool() {
  const handleTransform = useCallback(async (input: string) => {
    return sha256(input);
  }, []);

  return (
    <InputOutput
      inputLabel="Text to hash"
      outputLabel="SHA256 hash"
      inputPlaceholder="Enter text..."
      outputPlaceholder="SHA256 hash will appear here..."
      onTransform={handleTransform}
    />
  );
}
