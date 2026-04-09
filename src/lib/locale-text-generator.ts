import type { Faker } from "@faker-js/faker";
import { fakerJA, fakerRU } from "@faker-js/faker";
import { ZH_CN_SENTENCES, ZH_TW_SENTENCES } from "@/data/chinese-placeholder-text";
import {
  DE_SENTENCES,
  EN_SENTENCES,
  ES_SENTENCES,
  FR_SENTENCES,
  IT_SENTENCES,
  NL_SENTENCES,
  PL_SENTENCES,
  PT_BR_SENTENCES,
} from "@/data/locale-placeholder-sentences";

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
  | "zh-TW";

export type TextLocaleOption = {
  id: TextLocaleId;
  label: string;
  /** Only Japanese and Russian use Faker lorem (real script); others use sentence banks. */
  faker?: Faker;
};

export const TEXT_LOCALES: readonly TextLocaleOption[] = [
  { id: "en", label: "English" },
  { id: "zh-CN", label: "Chinese (Simplified)" },
  { id: "fr", label: "French" },
  { id: "ru", label: "Russian", faker: fakerRU },
  { id: "de", label: "German" },
  { id: "es", label: "Spanish" },
  { id: "it", label: "Italian" },
  { id: "pt-BR", label: "Portuguese (Brazil)" },
  { id: "pl", label: "Polish" },
  { id: "nl", label: "Dutch" },
  { id: "ja", label: "Japanese", faker: fakerJA },
  { id: "zh-TW", label: "Chinese (Traditional)" },
] as const;

const SENTENCE_BANKS: Record<
  Exclude<TextLocaleId, "ja" | "ru">,
  readonly string[]
> = {
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
};

export const DEFAULT_PARAGRAPH_COUNT = 3;
export const DEFAULT_CHAR_TARGET = 800;
export const RANDOM_PARAGRAPH_MIN = 1;
export const RANDOM_PARAGRAPH_MAX = 8;
export const RANDOM_CHAR_MIN = 200;
export const RANDOM_CHAR_MAX = 2500;
export const MAX_PARAGRAPH_COUNT = 40;
export const MAX_CHAR_TARGET = 20000;

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

function growBankParagraphToMinChars(
  sentences: readonly string[],
  minBodyChars: number,
  sentenceJoin: "" | " "
): string {
  const chunk: string[] = [shufflePick(sentences, unitRandom)];
  let text = chunk.join(sentenceJoin);
  let guard = 0;
  const maxGuard = 400;
  while (text.length < minBodyChars && guard < maxGuard) {
    chunk.push(shufflePick(sentences, unitRandom));
    text = chunk.join(sentenceJoin);
    guard++;
  }
  return text;
}

function growFakerParagraphToMinChars(faker: Faker, minBodyChars: number): string {
  let text = faker.lorem.sentence();
  let guard = 0;
  const maxGuard = 200;
  while (text.length < minBodyChars && guard < maxGuard) {
    text = `${text} ${faker.lorem.sentence()}`.trim();
    guard++;
  }
  return text;
}

/**
 * `charMinTotal` is a **minimum** for the whole output (including `\n\n`).
 * Budget is split randomly across paragraphs (e.g. 30+30+36 + separators ≈ 100).
 * Final length is usually a bit higher once a paragraph reaches its minimum (full sentences).
 *
 * @param sentenceJoin Use "" for Chinese; " " for Latin-script languages.
 */
function buildFromSentenceBank(
  sentences: readonly string[],
  paragraphCount: number,
  charMinTotal: number,
  sentenceJoin: "" | " "
): string {
  const n = paragraphCount;
  if (n < 1) return "";

  const overhead = (n - 1) * PARAGRAPH_SEP_LEN;
  const minPossibleTotal = overhead + n;
  const effectiveMin = Math.max(charMinTotal, minPossibleTotal);
  const bodyPool = effectiveMin - overhead;

  const budgets = randomPositivePartition(bodyPool, n);
  const paras = budgets.map((b) =>
    growBankParagraphToMinChars(sentences, b, sentenceJoin)
  );
  return paras.join(PARAGRAPH_SEP);
}

function buildFakerParagraphs(
  faker: Faker,
  paragraphCount: number,
  charMinTotal: number
): string {
  const n = paragraphCount;
  if (n < 1) return "";

  const overhead = (n - 1) * PARAGRAPH_SEP_LEN;
  const minPossibleTotal = overhead + n;
  const effectiveMin = Math.max(charMinTotal, minPossibleTotal);
  const bodyPool = effectiveMin - overhead;

  const budgets = randomPositivePartition(bodyPool, n);
  const parts = budgets.map((b) => growFakerParagraphToMinChars(faker, b));
  return parts.join(PARAGRAPH_SEP);
}

export type GenerateLocaleTextParams = {
  localeId: TextLocaleId;
  paragraphCount: number;
  charTarget: number;
  randomParagraphs: boolean;
  randomChars: boolean;
};

export type GenerateLocaleTextResult = {
  text: string;
  usedParagraphs: number;
  outputParagraphCount: number;
  /** Minimum total character target (actual length is usually higher). */
  usedCharTarget: number;
  localeId: TextLocaleId;
};

export function generateLocaleText(params: GenerateLocaleTextParams): GenerateLocaleTextResult {
  const rawP = Math.floor(Number(params.paragraphCount));
  const rawC = Math.floor(Number(params.charTarget));
  const safeP = Number.isFinite(rawP) && rawP > 0 ? rawP : DEFAULT_PARAGRAPH_COUNT;
  const safeC = Number.isFinite(rawC) && rawC > 0 ? rawC : DEFAULT_CHAR_TARGET;

  const usedParagraphs = params.randomParagraphs
    ? randomIntInclusive(RANDOM_PARAGRAPH_MIN, RANDOM_PARAGRAPH_MAX)
    : Math.min(MAX_PARAGRAPH_COUNT, Math.max(1, safeP));

  const usedCharTarget = params.randomChars
    ? randomIntInclusive(RANDOM_CHAR_MIN, RANDOM_CHAR_MAX)
    : Math.min(MAX_CHAR_TARGET, Math.max(20, safeC));

  let text: string;
  if (params.localeId === "ja" || params.localeId === "ru") {
    const faker = params.localeId === "ja" ? fakerJA : fakerRU;
    text = buildFakerParagraphs(faker, usedParagraphs, usedCharTarget);
  } else {
    const bank = SENTENCE_BANKS[params.localeId];
    const join: "" | " " =
      params.localeId === "zh-CN" || params.localeId === "zh-TW" ? "" : " ";
    text = buildFromSentenceBank(bank, usedParagraphs, usedCharTarget, join);
  }

  const outputParagraphCount = text.split(/\n\n+/).filter((p) => p.length > 0).length;

  return {
    text,
    usedParagraphs,
    outputParagraphCount,
    usedCharTarget,
    localeId: params.localeId,
  };
}
