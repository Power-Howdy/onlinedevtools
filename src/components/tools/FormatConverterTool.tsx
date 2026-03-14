"use client";

import { useCallback, useState } from "react";
import { InputOutput } from "@/components/InputOutput";
import {
  convertFormat,
  type SourceFormat,
  type TargetFormat,
} from "@/lib/format-converter";

const FORMATS: { value: SourceFormat; label: string }[] = [
  { value: "csv", label: "CSV" },
  { value: "json", label: "JSON" },
  { value: "xml", label: "XML" },
  { value: "yaml", label: "YAML" },
];

export function FormatConverterTool() {
  const [sourceFormat, setSourceFormat] = useState<SourceFormat>("json");
  const [targetFormat, setTargetFormat] = useState<TargetFormat>("yaml");

  const handleTransform = useCallback(
    (input: string) => {
      return convertFormat(input, sourceFormat, targetFormat);
    },
    [sourceFormat, targetFormat]
  );

  const inputPlaceholder =
    sourceFormat === "json"
      ? '{"name": "Alice", "age": 30}'
      : sourceFormat === "csv"
        ? "name,age\nAlice,30\nBob,25"
        : sourceFormat === "xml"
          ? '<?xml version="1.0"?>\n<root><name>Alice</name><age>30</age></root>'
          : "name: Alice\nage: 30";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label
            htmlFor="source-format"
            className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Source
          </label>
          <select
            id="source-format"
            value={sourceFormat}
            onChange={(e) => setSourceFormat(e.target.value as SourceFormat)}
            className="px-3 py-1.5 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 text-sm font-medium focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 focus:border-transparent outline-none"
          >
            {FORMATS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
        <span className="text-neutral-400 dark:text-neutral-500 text-sm">→</span>
        <div className="flex items-center gap-2">
          <label
            htmlFor="target-format"
            className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Target
          </label>
          <select
            id="target-format"
            value={targetFormat}
            onChange={(e) => setTargetFormat(e.target.value as TargetFormat)}
            className="px-3 py-1.5 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 text-sm font-medium focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 focus:border-transparent outline-none"
          >
            {FORMATS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <InputOutput
        inputLabel={`${sourceFormat.toUpperCase()} Input`}
        outputLabel={`${targetFormat.toUpperCase()} Output`}
        inputPlaceholder={inputPlaceholder}
        outputPlaceholder={`${targetFormat.toUpperCase()} output will appear here...`}
        onTransform={handleTransform}
      />
    </div>
  );
}
