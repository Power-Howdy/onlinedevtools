import {
  GENERATE_CHUNK_SIZE,
  getCountryEntry,
  pickRandomCountryEntry,
  type MockProfileCountry,
} from "@/lib/mock-profile";
import { generateLocaleSnippet } from "@/lib/locale-text-generator";
import { recordsToCsv, recordsToJson } from "@/lib/data-export";

export type MockProduct = {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  price: string;
  currency: string;
  inStock: string;
  imageUrl: string;
  locale: string;
};

export type MockProductFieldKey = keyof MockProduct;

export type MockProductField = {
  key: MockProductFieldKey;
  label: string;
  defaultOn: boolean;
};

export const MAX_MOCK_PRODUCTS = 10000;
export const PRODUCT_COUNT_PRESETS = [10, 100, 1000, 10000] as const;

export const MOCK_PRODUCT_FIELDS: readonly MockProductField[] = [
  { key: "id", label: "UUID", defaultOn: true },
  { key: "sku", label: "SKU", defaultOn: true },
  { key: "name", label: "Name", defaultOn: true },
  { key: "description", label: "Description", defaultOn: true },
  { key: "category", label: "Category", defaultOn: true },
  { key: "price", label: "Price", defaultOn: true },
  { key: "currency", label: "Currency", defaultOn: true },
  { key: "inStock", label: "In stock", defaultOn: true },
  { key: "imageUrl", label: "Image URL", defaultOn: false },
  { key: "locale", label: "Locale", defaultOn: false },
];

export const DEFAULT_MOCK_PRODUCT_FIELDS: MockProductFieldKey[] =
  MOCK_PRODUCT_FIELDS.filter((field) => field.defaultOn).map((field) => field.key);

const FIELD_KEY_SET = new Set(MOCK_PRODUCT_FIELDS.map((field) => field.key));

const CURRENCY_BY_COUNTRY: Record<string, string> = {
  US: "USD",
  GB: "GBP",
  CA: "CAD",
  AU: "AUD",
  DE: "EUR",
  FR: "EUR",
  ES: "EUR",
  IT: "EUR",
  NL: "EUR",
  PL: "PLN",
  BR: "BRL",
  PT: "EUR",
  JP: "JPY",
  CN: "CNY",
  TW: "TWD",
  KR: "KRW",
  IN: "INR",
  MX: "MXN",
  SE: "SEK",
  NO: "NOK",
  DK: "DKK",
  FI: "EUR",
  RU: "RUB",
  TR: "TRY",
  HU: "HUF",
  CZ: "CZK",
  RO: "RON",
  GR: "EUR",
  ID: "IDR",
  TH: "THB",
  VN: "VND",
  IE: "EUR",
  ZA: "ZAR",
  NG: "NGN",
  AT: "EUR",
  CH: "CHF",
};

function randomIndex(max: number): number {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return max <= 0 ? 0 : arr[0]! % max;
}

function randomInt(min: number, max: number): number {
  if (max <= min) return min;
  return min + randomIndex(max - min + 1);
}

function clampCount(count: number): number {
  return Math.min(MAX_MOCK_PRODUCTS, Math.max(1, Math.floor(count) || 1));
}

function resolveCountry(countryCode?: string): MockProfileCountry {
  const explicit = countryCode?.trim();
  const resolved = explicit ? getCountryEntry(explicit) : undefined;
  return resolved ?? pickRandomCountryEntry();
}

function buildSku(faker: MockProfileCountry["faker"]): string {
  const part = faker.string.alphanumeric({ length: 6, casing: "upper" });
  return `${faker.commerce.department().slice(0, 3).toUpperCase()}-${part}`;
}

function buildProductImage(seed: string): string {
  return `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(seed)}`;
}

function formatPrice(amount: number, currency: string): string {
  if (currency === "JPY" || currency === "KRW" || currency === "VND" || currency === "IDR") {
    return String(Math.round(amount));
  }
  return amount.toFixed(2);
}

export type GenerateMockProductOptions = {
  countryCode?: string;
};

function generateFromEntry(entry: MockProfileCountry): MockProduct {
  const f = entry.faker;
  const id = crypto.randomUUID();
  const currency = CURRENCY_BY_COUNTRY[entry.code] ?? "USD";
  const rawPrice = Number(f.commerce.price({ min: 2, max: 999, dec: 2 }));
  const description =
    generateLocaleSnippet(entry.locale, "product", 220) ??
    f.commerce.productDescription();

  return {
    id,
    sku: buildSku(f),
    name: f.commerce.productName(),
    description,
    category: f.commerce.department(),
    price: formatPrice(rawPrice, currency),
    currency,
    inStock: randomInt(0, 1) === 1 ? "true" : "false",
    imageUrl: buildProductImage(id),
    locale: entry.locale,
  };
}

export function sanitizeProductFieldSelection(
  fields: readonly string[]
): MockProductFieldKey[] {
  const unique: MockProductFieldKey[] = [];
  const seen = new Set<string>();
  for (const key of fields) {
    if (!FIELD_KEY_SET.has(key as MockProductFieldKey) || seen.has(key)) continue;
    seen.add(key);
    unique.push(key as MockProductFieldKey);
  }
  return unique.length > 0 ? unique : [...DEFAULT_MOCK_PRODUCT_FIELDS];
}

export function pickProductFields(
  product: MockProduct,
  fields: readonly MockProductFieldKey[]
): Partial<MockProduct> {
  const keys = sanitizeProductFieldSelection(fields);
  const picked: Partial<MockProduct> = {};
  for (const key of keys) {
    picked[key] = product[key];
  }
  return picked;
}

export function productsToJson(
  products: readonly MockProduct[],
  fields: readonly MockProductFieldKey[]
): string {
  const keys = sanitizeProductFieldSelection(fields);
  return recordsToJson(
    products.map((product) => pickProductFields(product, keys) as Record<string, unknown>)
  );
}

export function productsToCsv(
  products: readonly MockProduct[],
  fields: readonly MockProductFieldKey[]
): string {
  const keys = sanitizeProductFieldSelection(fields);
  return recordsToCsv(
    products.map((product) => pickProductFields(product, keys) as Record<string, unknown>),
    keys
  );
}

export function productsToValueList(
  products: readonly MockProduct[],
  field: MockProductFieldKey
): string {
  return products.map((product) => String(product[field] ?? "")).join("\n");
}

export function generateMockProduct(options?: GenerateMockProductOptions): MockProduct {
  return generateFromEntry(resolveCountry(options?.countryCode));
}

export function generateMockProducts(
  count: number,
  options?: GenerateMockProductOptions
): MockProduct[] {
  const n = clampCount(count);
  return Array.from({ length: n }, () => generateMockProduct(options));
}

export async function generateMockProductsChunked(
  count: number,
  options: GenerateMockProductOptions | undefined,
  onProgress?: (done: number, total: number) => void
): Promise<MockProduct[]> {
  const total = clampCount(count);
  const out: MockProduct[] = [];
  for (let i = 0; i < total; i += GENERATE_CHUNK_SIZE) {
    const chunkSize = Math.min(GENERATE_CHUNK_SIZE, total - i);
    for (let j = 0; j < chunkSize; j++) {
      out.push(generateMockProduct(options));
    }
    onProgress?.(out.length, total);
    if (i + chunkSize < total) {
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 0);
      });
    }
  }
  return out;
}

export function regenerateProductField(
  product: MockProduct,
  field: MockProductFieldKey,
  options?: GenerateMockProductOptions
): MockProduct {
  const entry = resolveCountry(options?.countryCode);
  const fresh = generateFromEntry(entry);
  if (field === "id") {
    return { ...product, id: fresh.id, imageUrl: buildProductImage(fresh.id) };
  }
  return { ...product, [field]: fresh[field] };
}

export { CURRENCY_BY_COUNTRY };
