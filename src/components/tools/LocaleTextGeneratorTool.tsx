"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { copyToClipboard } from "@/lib/clipboard";
import { useToolSettings } from "@/hooks/useToolSettings";
import { downloadTextFile, EXPORT_MIME } from "@/lib/data-export";
import {
  CONTENT_PRESETS,
  DEFAULT_CHAR_TARGET,
  DEFAULT_LENGTH_MODE,
  DEFAULT_PARAGRAPH_COUNT,
  DEFAULT_PRESET,
  DEFAULT_WORD_TARGET,
  MAX_CHAR_TARGET,
  MAX_PARAGRAPH_COUNT,
  MAX_WORD_TARGET,
  RANDOM_CHAR_MAX,
  RANDOM_CHAR_MIN,
  RANDOM_PARAGRAPH_MAX,
  RANDOM_PARAGRAPH_MIN,
  RANDOM_WORD_MAX,
  RANDOM_WORD_MIN,
  TEXT_LOCALES,
  buildLocaleTextExportCsv,
  buildLocaleTextExportJson,
  generateLocaleText,
  type ContentPresetId,
  type GenerateLocaleTextResult,
  type LengthMode,
  type TextLocaleId,
} from "@/lib/locale-text-generator";

const PRESET_IDS = Object.keys(CONTENT_PRESETS) as ContentPresetId[];

const LOCALE_TEXT_DEFAULTS = {
  localeId: "en" as TextLocaleId,
  mixedLanguages: false,
  preset: DEFAULT_PRESET as ContentPresetId,
  paragraphCount: DEFAULT_PARAGRAPH_COUNT,
  charTarget: DEFAULT_CHAR_TARGET,
  wordTarget: DEFAULT_WORD_TARGET,
  lengthMode: DEFAULT_LENGTH_MODE as LengthMode,
  randomParagraphs: false,
  randomChars: false,
  randomWords: false,
};

export function LocaleTextGeneratorTool() {
  const [s, setS] = useToolSettings("main", LOCALE_TEXT_DEFAULTS);
  const {
    localeId,
    mixedLanguages,
    preset,
    paragraphCount,
    charTarget,
    wordTarget,
    lengthMode,
    randomParagraphs,
    randomChars,
    randomWords,
  } = s;
  const [result, setResult] = useState<GenerateLocaleTextResult | null>(null);
  const [copied, setCopied] = useState(false);
  const didAutoGenerate = useRef(false);

  const applyPreset = useCallback((nextPreset: ContentPresetId) => {
    const defaults = CONTENT_PRESETS[nextPreset];
    setS((prev) => ({
      ...prev,
      preset: nextPreset,
      paragraphCount: defaults.paragraphCount,
      charTarget: defaults.charTarget,
      wordTarget: defaults.wordTarget,
      randomParagraphs: false,
      randomChars: false,
      randomWords: false,
    }));
    setResult(
      generateLocaleText({
        localeId,
        mixedLanguages,
        preset: nextPreset,
        paragraphCount: defaults.paragraphCount,
        charTarget: defaults.charTarget,
        wordTarget: defaults.wordTarget,
        lengthMode,
        randomParagraphs: false,
        randomChars: false,
        randomWords: false,
      })
    );
    setCopied(false);
  }, [lengthMode, localeId, mixedLanguages, setS]);

  const runGenerate = useCallback(() => {
    const next = generateLocaleText({
      localeId,
      mixedLanguages,
      preset,
      paragraphCount,
      charTarget,
      wordTarget,
      lengthMode,
      randomParagraphs,
      randomChars,
      randomWords,
    });
    setResult(next);
    setCopied(false);
  }, [
    localeId,
    mixedLanguages,
    preset,
    paragraphCount,
    charTarget,
    wordTarget,
    lengthMode,
    randomParagraphs,
    randomChars,
    randomWords,
  ]);

  useEffect(() => {
    if (didAutoGenerate.current) return;
    didAutoGenerate.current = true;
    runGenerate();
  }, [runGenerate]);

  const handleCopy = useCallback(async () => {
    if (!result?.text) {
      toast.error("Generate text first");
      return;
    }
    const ok = await copyToClipboard(result.text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Copy failed. Try selecting and copying manually.");
    }
  }, [result]);

  const handleExport = useCallback(
    (format: "txt" | "json" | "csv") => {
      if (!result) {
        toast.error("Generate text first");
        return;
      }
      if (format === "txt") {
        downloadTextFile("placeholder-text.txt", result.text, EXPORT_MIME.txt);
        return;
      }
      if (format === "json") {
        downloadTextFile(
          "placeholder-text.json",
          buildLocaleTextExportJson(result),
          EXPORT_MIME.json
        );
        return;
      }
      downloadTextFile(
        "placeholder-text.csv",
        buildLocaleTextExportCsv(result),
        EXPORT_MIME.csv
      );
    },
    [result]
  );

  const selectedLocale = TEXT_LOCALES.find((locale) => locale.id === localeId);
  const output = result?.text ?? "";

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-sky-200/80 dark:border-sky-900/50 bg-sky-50/80 dark:bg-sky-950/30 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300">
        This is not an AI writer and not a translator. It builds <strong>sample placeholder copy</strong>{" "}
        — bios, product blurbs, article paragraphs, and UI strings — so you can test layout, fonts,
        and localization. Arabic and Hebrew render right-to-left.
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        Need full user, product, or order records?{" "}
        <Link
          href="/mock-profile-generator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Open the Test Data Generator
        </Link>
        .
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="locale-text-lang"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
          >
            Language
          </label>
          <select
            id="locale-text-lang"
            value={localeId}
            onChange={(e) =>
              setS((p) => ({ ...p, localeId: e.target.value as TextLocaleId }))
            }
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-sm"
          >
            {TEXT_LOCALES.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
                {l.dir === "rtl" ? " (RTL)" : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col justify-end">
          <label className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300 cursor-pointer">
            <input
              type="checkbox"
              checked={mixedLanguages}
              onChange={(e) =>
                setS((p) => ({ ...p, mixedLanguages: e.target.checked }))
              }
              className="mt-0.5 rounded border-neutral-300"
            />
            <span>
              Mixed-language mode
              <span className="block text-neutral-500 dark:text-neutral-400">
                Each paragraph uses a different language. The selected language comes first.
              </span>
            </span>
          </label>
        </div>

        <div className="sm:col-span-2">
          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Content type
          </p>
          <div className="flex flex-wrap gap-2">
            {PRESET_IDS.map((id) => {
              const item = CONTENT_PRESETS[id];
              const active = preset === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => applyPreset(id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    active
                      ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-900 dark:border-white"
                      : "bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
            {CONTENT_PRESETS[preset].description}. Selecting a type also applies a suggested length.
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <label
              htmlFor="locale-text-paras"
              className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              {preset === "ui-text" ? "UI strings" : "Paragraphs"}
            </label>
            <label className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 cursor-pointer">
              <input
                type="checkbox"
                checked={randomParagraphs}
                onChange={(e) =>
                  setS((p) => ({ ...p, randomParagraphs: e.target.checked }))
                }
                className="rounded border-neutral-300"
              />
              Random ({RANDOM_PARAGRAPH_MIN}–{RANDOM_PARAGRAPH_MAX})
            </label>
          </div>
          <input
            id="locale-text-paras"
            type="number"
            min={1}
            max={MAX_PARAGRAPH_COUNT}
            disabled={randomParagraphs}
            value={paragraphCount}
            onChange={(e) =>
              setS((p) => ({
                ...p,
                paragraphCount: Math.max(
                  1,
                  Math.min(MAX_PARAGRAPH_COUNT, parseInt(e.target.value, 10) || 1)
                ),
              }))
            }
            className="w-full max-w-xs px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 disabled:opacity-50"
          />
        </div>

        <div>
          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Length
          </p>
          {preset === "ui-text" ? (
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Each item is one UI string. Use the count above to generate more or fewer strings.
            </p>
          ) : (
            <>
          <div className="flex flex-wrap gap-2 mb-2">
            <button
              type="button"
              onClick={() => setS((p) => ({ ...p, lengthMode: "min-chars" }))}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
                lengthMode === "min-chars"
                  ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-900 dark:border-white"
                  : "bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-600"
              }`}
            >
              Minimum characters
            </button>
            <button
              type="button"
              onClick={() => setS((p) => ({ ...p, lengthMode: "exact-words" }))}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
                lengthMode === "exact-words"
                  ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-900 dark:border-white"
                  : "bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-600"
              }`}
            >
              Exact word count
            </button>
          </div>

          {lengthMode === "min-chars" ? (
            <>
              <div className="flex items-center justify-between gap-2 mb-1">
                <label
                  htmlFor="locale-text-chars"
                  className="text-sm text-neutral-600 dark:text-neutral-400"
                >
                  Minimum characters (total)
                </label>
                <label className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={randomChars}
                    onChange={(e) =>
                      setS((p) => ({ ...p, randomChars: e.target.checked }))
                    }
                    className="rounded border-neutral-300"
                  />
                  Random ({RANDOM_CHAR_MIN}–{RANDOM_CHAR_MAX})
                </label>
              </div>
              <input
                id="locale-text-chars"
                type="number"
                min={20}
                max={MAX_CHAR_TARGET}
                disabled={randomChars}
                value={charTarget}
                onChange={(e) =>
                  setS((p) => ({
                    ...p,
                    charTarget: Math.max(
                      20,
                      Math.min(
                        MAX_CHAR_TARGET,
                        parseInt(e.target.value, 10) || DEFAULT_CHAR_TARGET
                      )
                    ),
                  }))
                }
                className="w-full max-w-xs px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 disabled:opacity-50"
              />
            </>
          ) : (
            <>
              <div className="flex items-center justify-between gap-2 mb-1">
                <label
                  htmlFor="locale-text-words"
                  className="text-sm text-neutral-600 dark:text-neutral-400"
                >
                  Exact words (total)
                </label>
                <label className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={randomWords}
                    onChange={(e) =>
                      setS((p) => ({ ...p, randomWords: e.target.checked }))
                    }
                    className="rounded border-neutral-300"
                  />
                  Random ({RANDOM_WORD_MIN}–{RANDOM_WORD_MAX})
                </label>
              </div>
              <input
                id="locale-text-words"
                type="number"
                min={1}
                max={MAX_WORD_TARGET}
                disabled={randomWords}
                value={wordTarget}
                onChange={(e) =>
                  setS((p) => ({
                    ...p,
                    wordTarget: Math.max(
                      1,
                      Math.min(
                        MAX_WORD_TARGET,
                        parseInt(e.target.value, 10) || DEFAULT_WORD_TARGET
                      )
                    ),
                  }))
                }
                className="w-full max-w-xs px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 disabled:opacity-50"
              />
            </>
          )}
            </>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={runGenerate}
          className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium rounded-lg hover:bg-neutral-700 dark:hover:bg-neutral-200"
        >
          {result ? "Regenerate" : "Generate"}
        </button>
        <button
          type="button"
          onClick={handleCopy}
          disabled={!output}
          className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:pointer-events-none"
        >
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          type="button"
          onClick={() => handleExport("txt")}
          disabled={!output}
          className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:pointer-events-none"
        >
          Export TXT
        </button>
        <button
          type="button"
          onClick={() => handleExport("json")}
          disabled={!output}
          className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:pointer-events-none"
        >
          Export JSON
        </button>
        <button
          type="button"
          onClick={() => handleExport("csv")}
          disabled={!output}
          className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:pointer-events-none"
        >
          Export CSV
        </button>
      </div>

      {result && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono text-neutral-500 dark:text-neutral-400">
          <span>{result.stats.characters.toLocaleString()} characters</span>
          <span>{result.stats.words.toLocaleString()} words</span>
          <span>{result.stats.sentences.toLocaleString()} sentences</span>
          <span>{result.stats.paragraphs.toLocaleString()} {preset === "ui-text" ? "strings" : "paragraphs"}</span>
          {result.mixedLanguages ? (
            <span>Mixed languages</span>
          ) : (
            <span>
              {selectedLocale?.label}
              {selectedLocale?.dir === "rtl" ? " · RTL" : ""}
            </span>
          )}
        </div>
      )}

      {result && (
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Output
            </label>
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 px-3 py-1.5 text-sm font-medium rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-900/50 divide-y divide-neutral-200 dark:divide-neutral-800">
            {result.paragraphs.map((paragraph, index) => (
              <div
                key={`${paragraph.localeId}-${index}`}
                dir={paragraph.dir}
                lang={paragraph.bcp47}
                className="px-3 py-3"
              >
                {(result.mixedLanguages || paragraph.dir === "rtl") && (
                  <p
                    dir="ltr"
                    className="mb-1 text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400"
                  >
                    {paragraph.language}
                    {paragraph.dir === "rtl" ? " · RTL" : ""}
                  </p>
                )}
                <p className="text-sm leading-relaxed text-neutral-900 dark:text-neutral-100 whitespace-pre-wrap">
                  {paragraph.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
