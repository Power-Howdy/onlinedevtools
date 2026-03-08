"use client";

import { useState, useCallback } from "react";
import { copyToClipboard } from "@/lib/clipboard";

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  if (pad) base64 += "=".repeat(4 - pad);
  try {
    return decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  } catch {
    throw new Error("Invalid Base64 in token");
  }
}

function decodeJwt(token: string): string {
  const trimmed = token.trim();
  if (!trimmed) return "";
  const parts = trimmed.split(".");
  if (parts.length !== 3) throw new Error("Invalid JWT: expected 3 parts");
  const [headerB64, payloadB64] = parts;
  const header = JSON.parse(base64UrlDecode(headerB64));
  const payload = JSON.parse(base64UrlDecode(payloadB64));
  const result: Record<string, unknown> = {
    header,
    payload,
  };
  if (payload.exp) {
    result.expiration = new Date(payload.exp * 1000).toISOString();
    result.expired = payload.exp * 1000 < Date.now();
  }
  if (payload.iat) {
    result.issuedAt = new Date(payload.iat * 1000).toISOString();
  }
  return JSON.stringify(result, null, 2);
}

export function JwtDecoderTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleDecode = useCallback(() => {
    setError(null);
    try {
      setOutput(decodeJwt(input));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Decode failed");
      setOutput("");
    }
  }, [input]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          JWT Token
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          rows={4}
          className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 font-mono text-sm focus:ring-2 focus:ring-neutral-400 outline-none resize-y"
        />
      </div>
      <button
        onClick={handleDecode}
        className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium rounded-lg hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors"
      >
        Decode
      </button>
      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}
      {output && (
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Decoded
          </label>
          <pre className="p-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-900/50 font-mono text-sm overflow-x-auto whitespace-pre-wrap">
            {output}
          </pre>
          <button
            onClick={async () => {
              const ok = await copyToClipboard(output);
              if (!ok) setError("Copy failed. Try selecting and copying manually.");
            }}
            className="mt-2 px-3 py-1.5 text-sm bg-neutral-100 dark:bg-neutral-800 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700"
          >
            Copy
          </button>
        </div>
      )}
    </div>
  );
}
