"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { InputOutput } from "@/components/InputOutput";
import {
  jsonToTypeScript,
  jsonToPython,
  jsonToJava,
  jsonToGo,
  jsonToRust,
  jsonToCSharp,
} from "@/lib/json-to-code";
import {
  JSON_TO_LANG_LANGUAGES,
  JSON_TO_LANG_DATA,
  type JsonToLangSlug,
} from "@/data/json-to-lang";

function parseJson(input: string): unknown {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("Input is empty");
  return JSON.parse(trimmed);
}

const converters: Record<JsonToLangSlug, (obj: unknown) => string> = {
  typescript: (obj) => `interface Root ${jsonToTypeScript(obj)}`,
  python: (obj) => jsonToPython(obj),
  java: (obj) => jsonToJava(obj),
  go: (obj) => jsonToGo(obj),
  rust: (obj) => jsonToRust(obj),
  csharp: (obj) => jsonToCSharp(obj),
};

export function JsonToLangTool() {
  const searchParams = useSearchParams();
  const langParam = searchParams.get("lang") as JsonToLangSlug | null;
  const [lang, setLang] = useState<JsonToLangSlug>(
    langParam && JSON_TO_LANG_LANGUAGES.includes(langParam) ? langParam : "typescript"
  );

  useEffect(() => {
    if (langParam && JSON_TO_LANG_LANGUAGES.includes(langParam)) {
      setLang(langParam);
    }
  }, [langParam]);

  const convert = converters[lang];
  const handleTransform = useCallback(
    (input: string) => {
      const parsed = parseJson(input);
      return convert(parsed);
    },
    [convert]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <label
          htmlFor="output-lang"
          className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          Output language
        </label>
        <select
          id="output-lang"
          value={lang}
          onChange={(e) => setLang(e.target.value as JsonToLangSlug)}
          className="px-3 py-1.5 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 text-sm font-medium focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 focus:border-transparent outline-none"
        >
          {JSON_TO_LANG_LANGUAGES.map((l) => (
            <option key={l} value={l}>
              {JSON_TO_LANG_DATA[l].label}
            </option>
          ))}
        </select>
      </div>
      <InputOutput
        inputLabel="JSON Input"
        outputLabel={`${JSON_TO_LANG_DATA[lang].label} Output`}
        inputPlaceholder='{"key": "value", "count": 42}'
        outputPlaceholder="Generated code will appear here..."
        onTransform={handleTransform}
      />
    </div>
  );
}
