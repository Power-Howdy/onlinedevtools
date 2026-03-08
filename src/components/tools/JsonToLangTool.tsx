"use client";

import { useCallback } from "react";
import { InputOutput } from "@/components/InputOutput";
import {
  jsonToTypeScript,
  jsonToPython,
  jsonToJava,
  jsonToGo,
  jsonToRust,
  jsonToCSharp,
} from "@/lib/json-to-code";
import type { JsonToLangSlug } from "@/data/json-to-lang";

function parseJson(input: string): unknown {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("Input is empty");
  return JSON.parse(trimmed);
}

const converters: Record<
  JsonToLangSlug,
  (obj: unknown) => string
> = {
  typescript: (obj) => `interface Root ${jsonToTypeScript(obj)}`,
  python: (obj) => jsonToPython(obj),
  java: (obj) => jsonToJava(obj),
  go: (obj) => jsonToGo(obj),
  rust: (obj) => jsonToRust(obj),
  csharp: (obj) => jsonToCSharp(obj),
};

type Props = { lang: JsonToLangSlug };

export function JsonToLangTool({ lang }: Props) {
  const convert = converters[lang];
  const handleTransform = useCallback(
    (input: string) => {
      const parsed = parseJson(input);
      return convert(parsed);
    },
    [convert]
  );

  return (
    <InputOutput
      inputLabel="JSON Input"
      outputLabel={`${lang.charAt(0).toUpperCase() + lang.slice(1)} Output`}
      inputPlaceholder='{"key": "value", "count": 42}'
      outputPlaceholder="Generated code will appear here..."
      onTransform={handleTransform}
    />
  );
}
