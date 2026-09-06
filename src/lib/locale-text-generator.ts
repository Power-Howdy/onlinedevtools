import { ZH_CN_SENTENCES, ZH_TW_SENTENCES } from "@/data/chinese-placeholder-text";
import {
  AR_SENTENCES,
  DE_SENTENCES,
  EN_SENTENCES,
  ES_SENTENCES,
  FR_SENTENCES,
  HE_SENTENCES,
  IT_SENTENCES,
  JA_SENTENCES,
  KO_SENTENCES,
  NL_SENTENCES,
  PL_SENTENCES,
  PT_BR_SENTENCES,
  RU_SENTENCES,
  TH_SENTENCES,
} from "@/data/locale-placeholder-sentences";
import {
  AR_THEMED,
  DE_THEMED,
  EN_THEMED,
  ES_THEMED,
  FR_THEMED,
  HE_THEMED,
  IT_THEMED,
  JA_THEMED,
  KO_THEMED,
  NL_THEMED,
  PL_THEMED,
  PT_BR_THEMED,
  RU_THEMED,
  TH_THEMED,
  ZH_CN_THEMED,
  ZH_TW_THEMED,
  type ThemedBank,
} from "@/data/locale-placeholder-themed";

export type TextLocaleId =
  | "en"
  | "es"
  | "it"
  | "fr"
  | "de"
  | "pt-BR"
  | "ja"
  | "ru"
  | "pl"
  | "nl"
  | "zh-CN"
  | "zh-TW"
  | "ar"
  | "he"
  | "ko"
  | "th";

export type TextDirection = "ltr" | "rtl";

export type ContentPresetId = "short-bio" | "product" | "article" | "ui-text";

export type LengthMode = "min-chars" | "exact-words";

export type TextLocaleOption = {
  id: TextLocaleId;
  label: string;
  bcp47: string;
  dir: TextDirection;
};

export const TEXT_LOCALES: readonly TextLocaleOption[] = [
  { id: "en", label: "English", bcp47: "en", dir: "ltr" },
  { id: "zh-CN", label: "Chinese (Simplified)", bcp47: "zh-CN", dir: "ltr" },
  { id: "zh-TW", label: "Chinese (Traditional)", bcp47: "zh-TW", dir: "ltr" },
  { id: "ja", label: "Japanese", bcp47: "ja", dir: "ltr" },
  { id: "ko", label: "Korean", bcp47: "ko", dir: "ltr" },
  { id: "th", label: "Thai", bcp47: "th", dir: "ltr" },
  { id: "fr", label: "French", bcp47: "fr", dir: "ltr" },
  { id: "de", label: "German", bcp47: "de", dir: "ltr" },
  { id: "es", label: "Spanish", bcp47: "es", dir: "ltr" },
  { id: "it", label: "Italian", bcp47: "it", dir: "ltr" },
  { id: "pt-BR", label: "Portuguese (Brazil)", bcp47: "pt-BR", dir: "ltr" },
  { id: "nl", label: "Dutch", bcp47: "nl", dir: "ltr" },
  { id: "pl", label: "Polish", bcp47: "pl", dir: "ltr" },
  { id: "ru", label: "Russian", bcp47: "ru", dir: "ltr" },
  { id: "ar", label: "Arabic", bcp47: "ar", dir: "rtl" },
  { id: "he", label: "Hebrew", bcp47: "he", dir: "rtl" },
] as const;

export const CONTENT_PRESETS: Record<
  ContentPresetId,
  {
    label: string;
    description: string;
    paragraphCount: number;
    charTarget: number;
    wordTarget: number;
  }
> = {
  "short-bio": {
    label: "Short bio",
    description: "Profile-style placeholder paragraph",
    paragraphCount: 1,
    charTarget: 220,
    wordTarget: 40,
  },
  product: {
    label: "Product description",
    description: "Storefront-style product copy",
    paragraphCount: 2,
    charTarget: 480,
    wordTarget: 85,
  },
  article: {
    label: "Article",
    description: "Longer editorial paragraphs",
    paragraphCount: 5,
    charTarget: 1600,
    wordTarget: 280,
  },
  "ui-text": {
    label: "UI text",
    description: "Buttons, hints, and empty states",
    paragraphCount: 8,
    charTarget: 280,
    wordTarget: 48,
  },
};

export const DEFAULT_PRESET: ContentPresetId = "short-bio";
export const DEFAULT_PARAGRAPH_COUNT = 3;
export const DEFAULT_CHAR_TARGET = 800;
export const DEFAULT_WORD_TARGET = 120;
export const DEFAULT_LENGTH_MODE: LengthMode = "min-chars";
export const RANDOM_PARAGRAPH_MIN = 1;
export const RANDOM_PARAGRAPH_MAX = 8;
export const RANDOM_CHAR_MIN = 200;
export const RANDOM_CHAR_MAX = 2500;
export const RANDOM_WORD_MIN = 30;
export const RANDOM_WORD_MAX = 400;
export const MAX_PARAGRAPH_COUNT = 40;
export const MAX_CHAR_TARGET = 20000;
export const MAX_WORD_TARGET = 3000;

const BIO_BANKS: Record<TextLocaleId, readonly string[]> = {
  en: EN_SENTENCES,
  es: ES_SENTENCES,
  it: IT_SENTENCES,
  fr: FR_SENTENCES,
  de: DE_SENTENCES,
  "pt-BR": PT_BR_SENTENCES,
  pl: PL_SENTENCES,
  nl: NL_SENTENCES,
  "zh-CN": ZH_CN_SENTENCES,
  "zh-TW": ZH_TW_SENTENCES,
  ja: JA_SENTENCES,
  ru: RU_SENTENCES,
  ar: AR_SENTENCES,
  he: HE_SENTENCES,
  ko: KO_SENTENCES,
  th: TH_SENTENCES,
};

const THEMED_BANKS: Record<TextLocaleId, ThemedBank> = {
  en: EN_THEMED,
  es: ES_THEMED,
  it: IT_THEMED,
  fr: FR_THEMED,
  de: DE_THEMED,
  "pt-BR": PT_BR_THEMED,
  pl: PL_THEMED,
  nl: NL_THEMED,
  "zh-CN": ZH_CN_THEMED,
  "zh-TW": ZH_TW_THEMED,
  ja: JA_THEMED,
  ru: RU_THEMED,
  ar: AR_THEMED,
  he: HE_THEMED,
  ko: KO_THEMED,
  th: TH_THEMED,
};

const SCRIPT_JOIN_NONE = new Set<TextLocaleId>(["zh-CN", "zh-TW", "ja", "th"]);

export function getLocaleOption(id: TextLocaleId): TextLocaleOption {
  return TEXT_LOCALES.find((locale) => locale.id === id) ?? TEXT_LOCALES[0]!;
}

export function isRtlLocale(id: TextLocaleId): boolean {
  return getLocaleOption(id).dir === "rtl";
}

const TEXT_LOCALE_IDS = new Set<string>(TEXT_LOCALES.map((locale) => locale.id));

/** Map a BCP47 / country locale tag (e.g. en-US, de-DE) onto a TextLocaleId bank when available. */
export function bcp47ToTextLocaleId(bcp47: string): TextLocaleId | undefined {
  const raw = bcp47.trim();
  if (!raw) return undefined;
  if (TEXT_LOCALE_IDS.has(raw)) return raw as TextLocaleId;
  const lower = raw.toLowerCase();
  if (lower === "pt-br" || lower.startsWith("pt-br")) return "pt-BR";
  if (lower === "zh-cn" || lower.startsWith("zh-hans") || lower === "zh-sg") return "zh-CN";
  if (lower === "zh-tw" || lower.startsWith("zh-hant") || lower === "zh-hk") return "zh-TW";
  const primary = raw.split(/[-_]/)[0]?.toLowerCase();
  if (!primary) return undefined;
  const byPrimary: Record<string, TextLocaleId> = {
    en: "en",
    es: "es",
    it: "it",
    fr: "fr",
    de: "de",
    pt: "pt-BR",
    ja: "ja",
    ru: "ru",
    pl: "pl",
    nl: "nl",
    zh: "zh-CN",
    ar: "ar",
    he: "he",
    ko: "ko",
    th: "th",
  };
  return byPrimary[primary];
}

/** One short paragraph from a locale text bank (bios / product copy). */
export function generateLocaleSnippet(
  bcp47: string,
  preset: "short-bio" | "product",
  charTarget = 180
): string | undefined {
  const localeId = bcp47ToTextLocaleId(bcp47);
  if (!localeId) return undefined;
  const result = generateLocaleText({
    localeId,
    mixedLanguages: false,
    preset,
    paragraphCount: 1,
    charTarget,
    wordTarget: 40,
    lengthMode: "min-chars",
    randomParagraphs: false,
    randomChars: false,
    randomWords: false,
  });
  return result.text.trim() || undefined;
}

function sentenceBank(localeId: TextLocaleId, preset: ContentPresetId): readonly string[] {
  if (preset === "short-bio") return BIO_BANKS[localeId];
  if (preset === "product") return THEMED_BANKS[localeId].product;
  if (preset === "article") return THEMED_BANKS[localeId].article;
  return THEMED_BANKS[localeId].ui;
}

function sentenceJoinFor(localeId: TextLocaleId): "" | " " {
  return SCRIPT_JOIN_NONE.has(localeId) ? "" : " ";
}

function randomIntInclusive(min: number, max: number): number {
  const lo = Math.min(min, max);
  const hi = Math.max(min, max);
  const range = hi - lo + 1;
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return lo + (arr[0]! % range);
}

function shufflePick<T>(arr: readonly T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)]!;
}

/** 0 <= x < 1 */
function unitRandom(): number {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return (arr[0]! >>> 0) / 0x1_0000_0000;
}

const PARAGRAPH_SEP = "\n\n";
const PARAGRAPH_SEP_LEN = PARAGRAPH_SEP.length;

/**
 * Random split of `total` into `n` positive integers that sum to `total`
 * (e.g. 96 → [30, 36, 30] — varied lengths per paragraph).
 */
function randomPositivePartition(total: number, n: number): number[] {
  if (n <= 0) return [];
  if (n === 1) return [Math.max(1, total)];
  const t = Math.max(n, total);
  const cuts = new Set<number>();
  while (cuts.size < n - 1) {
    cuts.add(randomIntInclusive(1, t - 1));
  }
  const pts = [0, ...Array.from(cuts).sort((a, b) => a - b), t];
  const parts: number[] = [];
  for (let i = 0; i < n; i++) {
    parts.push(pts[i + 1]! - pts[i]!);
  }
  return parts;
}

export function countCharacters(text: string): number {
  return Array.from(text).length;
}

export function countSentences(text: string): number {
  return text
    .split(/[.!?…。！？؟۔]+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0).length;
}

export function countWords(text: string, localeId?: TextLocaleId | "mixed"): number {
  const sample = text.trim();
  if (!sample) return 0;
  const locale =
    localeId && localeId !== "mixed" ? getLocaleOption(localeId).bcp47 : "en";
  try {
    const segmenter = new Intl.Segmenter(locale, { granularity: "word" });
    return Array.from(segmenter.segment(sample)).filter((segment) => segment.isWordLike).length;
  } catch {
    if (localeId && SCRIPT_JOIN_NONE.has(localeId as TextLocaleId)) {
      return Array.from(sample).filter((ch) => !/\s/.test(ch)).length;
    }
    return sample.split(/\s+/).filter(Boolean).length;
  }
}

function trimToWordCount(text: string, targetWords: number, localeId: TextLocaleId): string {
  if (targetWords < 1) return "";
  const locale = getLocaleOption(localeId).bcp47;
  try {
    const segmenter = new Intl.Segmenter(locale, { granularity: "word" });
    let words = 0;
    let end = 0;
    const segments = Array.from(segmenter.segment(text));
    for (const segment of segments) {
      if (segment.isWordLike) {
        words += 1;
        end = segment.index + segment.segment.length;
        if (words >= targetWords) break;
      }
    }
    return text.slice(0, end).trim();
  } catch {
    if (SCRIPT_JOIN_NONE.has(localeId)) {
      return Array.from(text)
        .filter((ch) => !/\s/.test(ch))
        .slice(0, targetWords)
        .join("");
    }
    return text.trim().split(/\s+/).slice(0, targetWords).join(" ");
  }
}

function growBankParagraphToMinChars(
  sentences: readonly string[],
  minBodyChars: number,
  sentenceJoin: "" | " "
): string {
  const chunk: string[] = [shufflePick(sentences, unitRandom)];
  let text = chunk.join(sentenceJoin);
  let guard = 0;
  const maxGuard = 400;
  while (countCharacters(text) < minBodyChars && guard < maxGuard) {
    chunk.push(shufflePick(sentences, unitRandom));
    text = chunk.join(sentenceJoin);
    guard++;
  }
  return text;
}

function growBankParagraphToWords(
  sentences: readonly string[],
  wordTarget: number,
  sentenceJoin: "" | " ",
  localeId: TextLocaleId
): string {
  const target = Math.max(1, wordTarget);
  const chunk: string[] = [shufflePick(sentences, unitRandom)];
  let text = chunk.join(sentenceJoin);
  let guard = 0;
  const maxGuard = 400;
  while (countWords(text, localeId) < target && guard < maxGuard) {
    chunk.push(shufflePick(sentences, unitRandom));
    text = chunk.join(sentenceJoin);
    guard++;
  }
  return trimToWordCount(text, target, localeId);
}

function pickMixedLocales(count: number, preferred: TextLocaleId): TextLocaleId[] {
  const ids = TEXT_LOCALES.map((locale) => locale.id);
  const result: TextLocaleId[] = [];
  const pool = ids.filter((id) => id !== preferred);
  for (let i = 0; i < count; i++) {
    if (i === 0) {
      result.push(preferred);
      continue;
    }
    if (pool.length === 0) {
      pool.push(...ids.filter((id) => id !== result[result.length - 1]));
    }
    const idx = randomIntInclusive(0, pool.length - 1);
    result.push(pool.splice(idx, 1)[0]!);
  }
  return result;
}

function buildParagraph(
  localeId: TextLocaleId,
  preset: ContentPresetId,
  minChars: number,
  wordTarget: number,
  lengthMode: LengthMode
): string {
  const sentences = sentenceBank(localeId, preset);
  if (preset === "ui-text") {
    return shufflePick(sentences, unitRandom);
  }
  const join = sentenceJoinFor(localeId);
  if (lengthMode === "exact-words") {
    return growBankParagraphToWords(sentences, wordTarget, join, localeId);
  }
  return growBankParagraphToMinChars(sentences, minChars, join);
}

export type GeneratedParagraph = {
  text: string;
  localeId: TextLocaleId;
  language: string;
  dir: TextDirection;
  bcp47: string;
};

export type GenerateLocaleTextParams = {
  localeId: TextLocaleId;
  mixedLanguages: boolean;
  preset: ContentPresetId;
  paragraphCount: number;
  charTarget: number;
  wordTarget: number;
  lengthMode: LengthMode;
  randomParagraphs: boolean;
  randomChars: boolean;
  randomWords: boolean;
};

export type LocaleTextStats = {
  characters: number;
  words: number;
  sentences: number;
  paragraphs: number;
};

export type GenerateLocaleTextResult = {
  text: string;
  paragraphs: GeneratedParagraph[];
  usedParagraphs: number;
  outputParagraphCount: number;
  usedCharTarget: number;
  usedWordTarget: number;
  localeId: TextLocaleId | "mixed";
  mixedLanguages: boolean;
  preset: ContentPresetId;
  lengthMode: LengthMode;
  stats: LocaleTextStats;
};

export function generateLocaleText(params: GenerateLocaleTextParams): GenerateLocaleTextResult {
  const rawP = Math.floor(Number(params.paragraphCount));
  const rawC = Math.floor(Number(params.charTarget));
  const rawW = Math.floor(Number(params.wordTarget));
  const safeP = Number.isFinite(rawP) && rawP > 0 ? rawP : DEFAULT_PARAGRAPH_COUNT;
  const safeC = Number.isFinite(rawC) && rawC > 0 ? rawC : DEFAULT_CHAR_TARGET;
  const safeW = Number.isFinite(rawW) && rawW > 0 ? rawW : DEFAULT_WORD_TARGET;
  const preset = CONTENT_PRESETS[params.preset] ? params.preset : DEFAULT_PRESET;
  const lengthMode: LengthMode =
    params.lengthMode === "exact-words" ? "exact-words" : "min-chars";

  const usedParagraphs = params.randomParagraphs
    ? randomIntInclusive(RANDOM_PARAGRAPH_MIN, RANDOM_PARAGRAPH_MAX)
    : Math.min(MAX_PARAGRAPH_COUNT, Math.max(1, safeP));

  const usedCharTarget = params.randomChars
    ? randomIntInclusive(RANDOM_CHAR_MIN, RANDOM_CHAR_MAX)
    : Math.min(MAX_CHAR_TARGET, Math.max(20, safeC));

  const usedWordTarget = params.randomWords
    ? randomIntInclusive(RANDOM_WORD_MIN, RANDOM_WORD_MAX)
    : Math.min(MAX_WORD_TARGET, Math.max(1, safeW));

  const localeIds = params.mixedLanguages
    ? pickMixedLocales(usedParagraphs, params.localeId)
    : Array.from({ length: usedParagraphs }, () => params.localeId);

  const overhead = (usedParagraphs - 1) * PARAGRAPH_SEP_LEN;
  const minPossibleTotal = overhead + usedParagraphs;
  const effectiveMin = Math.max(usedCharTarget, minPossibleTotal);
  const bodyPool = effectiveMin - overhead;
  const charBudgets = randomPositivePartition(bodyPool, usedParagraphs);
  const wordBudgets = randomPositivePartition(Math.max(usedParagraphs, usedWordTarget), usedParagraphs);

  const paragraphs: GeneratedParagraph[] = localeIds.map((localeId, index) => {
    const option = getLocaleOption(localeId);
    const text = buildParagraph(
      localeId,
      preset,
      charBudgets[index] ?? 1,
      wordBudgets[index] ?? 1,
      lengthMode
    );
    return {
      text,
      localeId,
      language: option.label,
      dir: option.dir,
      bcp47: option.bcp47,
    };
  });

  const text = paragraphs.map((paragraph) => paragraph.text).join(PARAGRAPH_SEP);
  const statsLocale = params.mixedLanguages ? "mixed" : params.localeId;

  return {
    text,
    paragraphs,
    usedParagraphs,
    outputParagraphCount: paragraphs.length,
    usedCharTarget,
    usedWordTarget,
    localeId: params.mixedLanguages ? "mixed" : params.localeId,
    mixedLanguages: params.mixedLanguages,
    preset,
    lengthMode,
    stats: {
      characters: countCharacters(text),
      words: countWords(text, statsLocale),
      sentences: countSentences(text),
      paragraphs: paragraphs.length,
    },
  };
}

function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function buildLocaleTextExportJson(result: GenerateLocaleTextResult): string {
  return JSON.stringify(
    {
      type: "multilingual-placeholder",
      preset: result.preset,
      mode: result.mixedLanguages ? "mixed" : "single",
      locale: result.localeId,
      lengthMode: result.lengthMode,
      generatedAt: new Date().toISOString(),
      stats: result.stats,
      paragraphs: result.paragraphs.map((paragraph) => ({
        locale: paragraph.localeId,
        language: paragraph.language,
        dir: paragraph.dir,
        text: paragraph.text,
        characters: countCharacters(paragraph.text),
        words: countWords(paragraph.text, paragraph.localeId),
        sentences: countSentences(paragraph.text),
      })),
      text: result.text,
    },
    null,
    2
  );
}

export function buildLocaleTextExportCsv(result: GenerateLocaleTextResult): string {
  const header = [
    "locale",
    "language",
    "dir",
    "paragraph",
    "characters",
    "words",
    "sentences",
    "text",
  ].join(",");
  const rows = result.paragraphs.map((paragraph, index) =>
    [
      paragraph.localeId,
      paragraph.language,
      paragraph.dir,
      String(index + 1),
      String(countCharacters(paragraph.text)),
      String(countWords(paragraph.text, paragraph.localeId)),
      String(countSentences(paragraph.text)),
      csvEscape(paragraph.text),
    ].join(",")
  );
  return [header, ...rows].join("\n");
}
