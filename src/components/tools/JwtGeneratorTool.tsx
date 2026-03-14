"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { copyToClipboard } from "@/lib/clipboard";

function base64UrlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function signHmacSha256(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  const sigBytes = new Uint8Array(sig);
  let binary = "";
  for (let i = 0; i < sigBytes.length; i++) {
    binary += String.fromCharCode(sigBytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function generateJwt(
  headerJson: string,
  payloadJson: string,
  secret: string
): Promise<string> {
  const header = JSON.parse(headerJson.trim() || "{}");
  const payload = JSON.parse(payloadJson.trim() || "{}");
  if (typeof header !== "object" || header === null) {
    throw new Error("Header must be a valid JSON object");
  }
  if (typeof payload !== "object" || payload === null) {
    throw new Error("Payload must be a valid JSON object");
  }
  if (!secret.trim()) {
    throw new Error("Secret is required");
  }

  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const message = `${headerB64}.${payloadB64}`;
  const signature = await signHmacSha256(message, secret);
  return `${message}.${signature}`;
}

const DEFAULT_HEADER = '{"alg":"HS256","typ":"JWT"}';
const DEFAULT_PAYLOAD = '{"sub":"user123","name":"John Doe","iat":1731456000}';

export function JwtGeneratorTool() {
  const [header, setHeader] = useState(DEFAULT_HEADER);
  const [payload, setPayload] = useState(DEFAULT_PAYLOAD);
  const [secret, setSecret] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    setError(null);
    try {
      const token = await generateJwt(header, payload, secret);
      setOutput(token);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Generate failed";
      setError(msg);
      setOutput("");
      toast.error(msg);
    }
  }, [header, payload, secret]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          Header (JSON)
        </label>
        <textarea
          value={header}
          onChange={(e) => setHeader(e.target.value)}
          placeholder={DEFAULT_HEADER}
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 font-mono text-sm focus:ring-2 focus:ring-neutral-400 outline-none resize-y"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          Payload (JSON)
        </label>
        <textarea
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
          placeholder={DEFAULT_PAYLOAD}
          rows={4}
          className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 font-mono text-sm focus:ring-2 focus:ring-neutral-400 outline-none resize-y"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          Secret
        </label>
        <input
          type="text"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          placeholder="your-secret-key"
          className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 font-mono text-sm focus:ring-2 focus:ring-neutral-400 outline-none"
        />
      </div>
      <button
        onClick={handleGenerate}
        className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium rounded-lg hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors"
      >
        Generate JWT
      </button>
      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}
      {output && (
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            JWT Token
          </label>
          <pre className="p-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-900/50 font-mono text-sm overflow-x-auto whitespace-pre-wrap break-all">
            {output}
          </pre>
          <div className="mt-2 flex gap-2">
            <button
              onClick={async () => {
                const ok = await copyToClipboard(output);
                if (!ok) {
                  toast.error("Copy failed. Try selecting and copying manually.");
                }
              }}
              className="px-3 py-1.5 text-sm bg-neutral-100 dark:bg-neutral-800 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700"
            >
              Copy
            </button>
            <Link
              href="/jwt-decoder"
              className="px-3 py-1.5 text-sm bg-neutral-100 dark:bg-neutral-800 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700"
            >
              Decode token
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
