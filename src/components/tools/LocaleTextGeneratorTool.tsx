"use client";

import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { copyToClipboard } from "@/lib/clipboard";
import { useToolSettings } from "@/hooks/useToolSettings";
import {
  DEFAULT_CHAR_TARGET,
  DEFAULT_PARAGRAPH_COUNT,
  generateLocaleText,
  RANDOM_CHAR_MAX,
  RANDOM_CHAR_MIN,
  RANDOM_PARAGRAPH_MAX,
  RANDOM_PARAGRAPH_MIN,
  TEXT_LOCALES,
  type TextLocaleId,
} from "@/lib/locale-text-generator";

const LOCALE_TEXT_DEFAULTS = {
  localeId: "en" as TextLocaleId,
  paragraphCount: DEFAULT_PARAGRAPH_COUNT,
  charTarget: DEFAULT_CHAR_TARGET,
  randomParagraphs: false,
  randomChars: false,
};

export function LocaleTextGeneratorTool() {
  const [s, setS] = useToolSettings("main", LOCALE_TEXT_DEFAULTS);
  const { localeId, paragraphCount, charTarget, randomParagraphs, randomChars } = s;
  const [output, setOutput] = useState("");
  const [meta, setMeta] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(() => {
    const result = generateLocaleText({
      localeId,
      paragraphCount,
      charTarget,
      randomParagraphs,
      randomChars,
    });
    setOutput(result.text);
    const lang = TEXT_LOCALES.find((l) => l.id === result.localeId)?.label ?? result.localeId;
    setMeta(
      `${lang} · ${result.outputParagraphCount} paragraph(s) · min ~${result.usedCharTarget} characters · ${result.text.length} characters generated`
    );
  }, [localeId, paragraphCount, charTarget, randomParagraphs, randomChars]);

  const handleCopy = useCallback(async () => {
    if (!output) {
      toast.error("Generate text first");
      return;
    }
    const ok = await copyToClipboard(output);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Copy failed. Try selecting and copying manually.");
    }
  }, [output]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        Placeholder paragraphs for mock bios, summaries, and UI copy. English, French, German,
        Spanish, Italian, Portuguese, Polish, and Dutch use sample prose in that language; Chinese
        (Simplified and Traditional) uses similar sentence banks; Japanese and Russian use
        Faker’s localized word lists. The total character value is a minimum: the generator picks a
        random split across paragraphs (e.g. 30 / 30 / 40 for three blocks) so the full text usually
        meets or slightly exceeds that total. Not real people or real products—testing only.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
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
            className="w-full max-w-md px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-sm"
          >
            {TEXT_LOCALES.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <label
              htmlFor="locale-text-paras"
              className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Paragraphs
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
            max={40}
            disabled={randomParagraphs}
            value={paragraphCount}
            onChange={(e) =>
              setS((p) => ({
                ...p,
                paragraphCount: Math.max(
                  1,
                  Math.min(40, parseInt(e.target.value, 10) || 1)
                ),
              }))
            }
            className="w-full max-w-xs px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 disabled:opacity-50"
          />
        </div>

        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <label
              htmlFor="locale-text-chars"
              className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Minimum characters (total, incl. line breaks)
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
            max={20000}
            disabled={randomChars}
            value={charTarget}
            onChange={(e) =>
              setS((p) => ({
                ...p,
                charTarget: Math.max(
                  20,
                  Math.min(
                    20000,
                    parseInt(e.target.value, 10) || DEFAULT_CHAR_TARGET
                  )
                ),
              }))
            }
            className="w-full max-w-xs px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 disabled:opacity-50"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleGenerate}
          className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium rounded-lg hover:bg-neutral-700 dark:hover:bg-neutral-200"
        >
          Generate
        </button>
        {output && (
          <button
            type="button"
            onClick={handleCopy}
            className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>

      {meta && (
        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">{meta}</p>
      )}

      {output && (
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Output
          </label>
          <textarea
            readOnly
            value={output}
            rows={14}
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-900/50 text-sm leading-relaxed resize-y"
          />
        </div>
      )}
    </div>
  );
}
