import type { Faker } from "@faker-js/faker";
import {
  fakerCS_CZ,
  fakerDA,
  fakerDE,
  fakerDE_AT,
  fakerDE_CH,
  fakerEL,
  fakerEN_AU,
  fakerEN_CA,
  fakerEN_GB,
  fakerEN_IE,
  fakerEN_IN,
  fakerEN_NG,
  fakerEN_US,
  fakerEN_ZA,
  fakerES,
  fakerES_MX,
  fakerFI,
  fakerFR,
  fakerHU,
  fakerID_ID,
  fakerIT,
  fakerJA,
  fakerKO,
  fakerNB_NO,
  fakerNL,
  fakerPL,
  fakerPT_BR,
  fakerPT_PT,
  fakerRO,
  fakerRU,
  fakerSV,
  fakerTH,
  fakerTR,
  fakerVI,
  fakerZH_CN,
  fakerZH_TW,
} from "@faker-js/faker";
import { recordsToCsv, recordsToJson } from "@/lib/data-export";
import { generateLocaleSnippet } from "@/lib/locale-text-generator";

export type GenderOption = "any" | "female" | "male";

export type MockProfile = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  locale: string;
  avatarUrl: string;
  professionalTitle: string;
  specialty: string;
  companyName: string;
  companyWebsite: string;
  linkedInUrl: string;
  biography: string;
  addressLine1: string;
  city: string;
  region: string;
  postalCode: string;
  countryCode: string;
  countryName: string;
  address: string;
  testCardNumber: string;
  testCardBrand: string;
  testCardExpiry: string;
  testCardCvc: string;
};

export type MockProfileFieldKey = keyof MockProfile;

export type MockProfileFieldGroup =
  | "identity"
  | "contact"
  | "address"
  | "work"
  | "payment";

export type MockProfileField = {
  key: MockProfileFieldKey;
  label: string;
  group: MockProfileFieldGroup;
  defaultOn: boolean;
};

export const MOCK_PROFILE_FIELD_GROUPS: {
  id: MockProfileFieldGroup;
  label: string;
}[] = [
  { id: "identity", label: "Identity" },
  { id: "contact", label: "Contact" },
  { id: "address", label: "Address" },
  { id: "work", label: "Work" },
  { id: "payment", label: "Test payment" },
];

export const MOCK_PROFILE_FIELDS: readonly MockProfileField[] = [
  { key: "id", label: "UUID", group: "identity", defaultOn: true },
  { key: "firstName", label: "First name", group: "identity", defaultOn: true },
  { key: "lastName", label: "Last name", group: "identity", defaultOn: true },
  { key: "fullName", label: "Full name", group: "identity", defaultOn: true },
  { key: "username", label: "Username", group: "identity", defaultOn: true },
  { key: "gender", label: "Gender", group: "identity", defaultOn: true },
  { key: "dateOfBirth", label: "Date of birth", group: "identity", defaultOn: true },
  { key: "locale", label: "Locale", group: "identity", defaultOn: true },
  { key: "avatarUrl", label: "Avatar URL", group: "identity", defaultOn: true },
  { key: "email", label: "Email", group: "contact", defaultOn: true },
  { key: "phone", label: "Phone", group: "contact", defaultOn: true },
  { key: "addressLine1", label: "Street address", group: "address", defaultOn: true },
  { key: "city", label: "City", group: "address", defaultOn: true },
  { key: "region", label: "State / region", group: "address", defaultOn: true },
  { key: "postalCode", label: "Postcode", group: "address", defaultOn: true },
  { key: "countryName", label: "Country", group: "address", defaultOn: true },
  { key: "countryCode", label: "Country code", group: "address", defaultOn: true },
  { key: "address", label: "Full address", group: "address", defaultOn: true },
  { key: "companyName", label: "Company", group: "work", defaultOn: true },
  { key: "professionalTitle", label: "Job title", group: "work", defaultOn: true },
  { key: "specialty", label: "Specialty", group: "work", defaultOn: false },
  { key: "companyWebsite", label: "Company website", group: "work", defaultOn: false },
  { key: "linkedInUrl", label: "LinkedIn URL", group: "work", defaultOn: false },
  { key: "biography", label: "Biography", group: "work", defaultOn: false },
  { key: "testCardNumber", label: "Test card number", group: "payment", defaultOn: false },
  { key: "testCardBrand", label: "Test card brand", group: "payment", defaultOn: false },
  { key: "testCardExpiry", label: "Test card expiry", group: "payment", defaultOn: false },
  { key: "testCardCvc", label: "Test card CVC", group: "payment", defaultOn: false },
];

export const DEFAULT_MOCK_PROFILE_FIELDS: MockProfileFieldKey[] =
  MOCK_PROFILE_FIELDS.filter((field) => field.defaultOn).map((field) => field.key);

export const MAX_MOCK_PROFILES = 10000;
export const PREVIEW_ROW_LIMIT = 15;
export const COUNT_PRESETS = [10, 100, 1000, 10000] as const;
export const GENERATE_CHUNK_SIZE = 250;

export type MockProfileCountry = {
  code: string;
  label: string;
  locale: string;
  faker: Faker;
};

export type GenerateMockProfileOptions = {
  countryCode?: string;
  gender?: GenderOption;
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

/** Lowercase slug from name: NFD strip accents, non-alphanumeric → `-`. */
function linkedInSlug(firstName: string, lastName: string): string {
  const combined = `${firstName} ${lastName}`.trim();
  return combined
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function randomDigits(length: number): string {
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  let s = "";
  for (let i = 0; i < length; i++) s += String(arr[i]! % 10);
  return s;
}

function randomAlphanumeric(length: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  let s = "";
  for (let i = 0; i < length; i++) s += chars[arr[i]! % chars.length]!;
  return s;
}

function buildLinkedInUrl(firstName: string, lastName: string): string {
  const slug = linkedInSlug(firstName, lastName);
  if (slug) {
    return `https://www.linkedin.com/in/${slug}-${randomDigits(8)}`;
  }
  return `https://www.linkedin.com/in/${randomAlphanumeric(12)}`;
}

function buildAvatarUrl(seed: string): string {
  return `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}`;
}

function asciiHandle(firstName: string, lastName: string): string {
  const slug = linkedInSlug(firstName, lastName).replace(/-/g, ".");
  return slug;
}

function buildUsername(firstName: string, lastName: string, faker: Faker): string {
  const handle = asciiHandle(firstName, lastName);
  if (handle) {
    return `${handle}${randomDigits(2)}`;
  }
  return faker.internet.username().replace(/[^a-z0-9._-]/gi, "").toLowerCase() || `user${randomAlphanumeric(8)}`;
}

function buildEmail(firstName: string, lastName: string, faker: Faker): string {
  const handle = asciiHandle(firstName, lastName);
  const local = handle || `user${randomAlphanumeric(8)}`;
  const domain = faker.internet.domainName();
  return `${local}${randomDigits(2)}@${domain}`.toLowerCase();
}

function formatAddress(parts: {
  addressLine1: string;
  city: string;
  region: string;
  postalCode: string;
  countryName: string;
}): string {
  const line2 = [parts.city, parts.region, parts.postalCode].filter(Boolean).join(", ");
  return [parts.addressLine1, line2, parts.countryName].join("\n");
}

function resolveSex(gender: GenderOption | undefined): "female" | "male" | undefined {
  if (gender === "female" || gender === "male") return gender;
  return undefined;
}

function pickSex(gender: GenderOption | undefined): "female" | "male" {
  return resolveSex(gender) ?? (randomIndex(2) === 0 ? "female" : "male");
}

/** Published sandbox BINs (Stripe-style). Not assigned to real cardholders. */
const TEST_CARD_BINS = [
  { brand: "Visa", prefix: "424242", length: 16, cvcLength: 3 },
  { brand: "Mastercard", prefix: "555555", length: 16, cvcLength: 3 },
  { brand: "American Express", prefix: "378282", length: 15, cvcLength: 4 },
] as const;

function luhnCheckDigit(payload: string): string {
  let sum = 0;
  let shouldDouble = true;
  for (let i = payload.length - 1; i >= 0; i--) {
    let n = Number(payload[i]);
    if (shouldDouble) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    shouldDouble = !shouldDouble;
  }
  return String((10 - (sum % 10)) % 10);
}

function generateTestCard(): Pick<
  MockProfile,
  "testCardNumber" | "testCardBrand" | "testCardExpiry" | "testCardCvc"
> {
  const spec = TEST_CARD_BINS[randomIndex(TEST_CARD_BINS.length)]!;
  const remaining = spec.length - spec.prefix.length - 1;
  const payload = spec.prefix + randomDigits(remaining);
  const number = payload + luhnCheckDigit(payload);
  const month = String(randomInt(1, 12)).padStart(2, "0");
  const year = String((new Date().getFullYear() % 100) + randomInt(2, 5)).padStart(2, "0");
  return {
    testCardNumber: number,
    testCardBrand: spec.brand,
    testCardExpiry: `${month}/${year}`,
    testCardCvc: randomDigits(spec.cvcLength),
  };
}

/** Curated ISO 3166-1 alpha-2 → Faker locale (English labels for forms). */
export const MOCK_PROFILE_COUNTRIES: readonly MockProfileCountry[] = [
  { code: "US", label: "United States", locale: "en-US", faker: fakerEN_US },
  { code: "GB", label: "United Kingdom", locale: "en-GB", faker: fakerEN_GB },
  { code: "CA", label: "Canada", locale: "en-CA", faker: fakerEN_CA },
  { code: "AU", label: "Australia", locale: "en-AU", faker: fakerEN_AU },
  { code: "DE", label: "Germany", locale: "de-DE", faker: fakerDE },
  { code: "FR", label: "France", locale: "fr-FR", faker: fakerFR },
  { code: "ES", label: "Spain", locale: "es-ES", faker: fakerES },
  { code: "IT", label: "Italy", locale: "it-IT", faker: fakerIT },
  { code: "NL", label: "Netherlands", locale: "nl-NL", faker: fakerNL },
  { code: "PL", label: "Poland", locale: "pl-PL", faker: fakerPL },
  { code: "BR", label: "Brazil", locale: "pt-BR", faker: fakerPT_BR },
  { code: "PT", label: "Portugal", locale: "pt-PT", faker: fakerPT_PT },
  { code: "JP", label: "Japan", locale: "ja-JP", faker: fakerJA },
  { code: "CN", label: "China", locale: "zh-CN", faker: fakerZH_CN },
  { code: "TW", label: "Taiwan", locale: "zh-TW", faker: fakerZH_TW },
  { code: "KR", label: "South Korea", locale: "ko-KR", faker: fakerKO },
  { code: "IN", label: "India", locale: "en-IN", faker: fakerEN_IN },
  { code: "MX", label: "Mexico", locale: "es-MX", faker: fakerES_MX },
  { code: "SE", label: "Sweden", locale: "sv-SE", faker: fakerSV },
  { code: "NO", label: "Norway", locale: "nb-NO", faker: fakerNB_NO },
  { code: "DK", label: "Denmark", locale: "da-DK", faker: fakerDA },
  { code: "FI", label: "Finland", locale: "fi-FI", faker: fakerFI },
  { code: "RU", label: "Russia", locale: "ru-RU", faker: fakerRU },
  { code: "TR", label: "Turkey", locale: "tr-TR", faker: fakerTR },
  { code: "HU", label: "Hungary", locale: "hu-HU", faker: fakerHU },
  { code: "CZ", label: "Czech Republic", locale: "cs-CZ", faker: fakerCS_CZ },
  { code: "RO", label: "Romania", locale: "ro-RO", faker: fakerRO },
  { code: "GR", label: "Greece", locale: "el-GR", faker: fakerEL },
  { code: "ID", label: "Indonesia", locale: "id-ID", faker: fakerID_ID },
  { code: "TH", label: "Thailand", locale: "th-TH", faker: fakerTH },
  { code: "VN", label: "Vietnam", locale: "vi-VN", faker: fakerVI },
  { code: "IE", label: "Ireland", locale: "en-IE", faker: fakerEN_IE },
  { code: "ZA", label: "South Africa", locale: "en-ZA", faker: fakerEN_ZA },
  { code: "NG", label: "Nigeria", locale: "en-NG", faker: fakerEN_NG },
  { code: "AT", label: "Austria", locale: "de-AT", faker: fakerDE_AT },
  { code: "CH", label: "Switzerland", locale: "de-CH", faker: fakerDE_CH },
] as const;

const byCode = new Map(MOCK_PROFILE_COUNTRIES.map((c) => [c.code, c]));
const FIELD_KEY_SET = new Set(MOCK_PROFILE_FIELDS.map((field) => field.key));

export function pickRandomCountryEntry(): MockProfileCountry {
  return MOCK_PROFILE_COUNTRIES[randomIndex(MOCK_PROFILE_COUNTRIES.length)]!;
}

export function getCountryEntry(code: string): MockProfileCountry | undefined {
  return byCode.get(code.trim().toUpperCase());
}

function resolveCountry(countryCode?: string): MockProfileCountry {
  const explicit = countryCode?.trim();
  const resolved = explicit ? getCountryEntry(explicit) : undefined;
  return resolved ?? pickRandomCountryEntry();
}

function clampCount(count: number): number {
  return Math.min(MAX_MOCK_PROFILES, Math.max(1, Math.floor(count) || 1));
}

export function sanitizeFieldSelection(fields: readonly string[]): MockProfileFieldKey[] {
  const unique: MockProfileFieldKey[] = [];
  const seen = new Set<string>();
  for (const key of fields) {
    if (!FIELD_KEY_SET.has(key as MockProfileFieldKey) || seen.has(key)) continue;
    seen.add(key);
    unique.push(key as MockProfileFieldKey);
  }
  return unique.length > 0 ? unique : [...DEFAULT_MOCK_PROFILE_FIELDS];
}

export function pickProfileFields(
  profile: MockProfile,
  fields: readonly MockProfileFieldKey[]
): Partial<MockProfile> {
  const keys = sanitizeFieldSelection(fields);
  const picked: Partial<MockProfile> = {};
  for (const key of keys) {
    picked[key] = profile[key];
  }
  return picked;
}

export function profilesToJson(
  profiles: readonly MockProfile[],
  fields: readonly MockProfileFieldKey[]
): string {
  const keys = sanitizeFieldSelection(fields);
  return recordsToJson(
    profiles.map((profile) => pickProfileFields(profile, keys) as Record<string, unknown>)
  );
}

export function profilesToCsv(
  profiles: readonly MockProfile[],
  fields: readonly MockProfileFieldKey[]
): string {
  const keys = sanitizeFieldSelection(fields);
  return recordsToCsv(
    profiles.map((profile) => pickProfileFields(profile, keys) as Record<string, unknown>),
    keys
  );
}

export function profilesToValueList(
  profiles: readonly MockProfile[],
  field: MockProfileFieldKey
): string {
  return profiles.map((profile) => String(profile[field] ?? "")).join("\n");
}

function generateFromEntry(
  entry: MockProfileCountry,
  options?: GenerateMockProfileOptions
): MockProfile {
  const f = entry.faker;
  const sex = pickSex(options?.gender);
  const firstName = f.person.firstName(sex);
  const lastName = f.person.lastName(sex);
  const fullName = `${firstName} ${lastName}`;
  const id = crypto.randomUUID();
  const username = buildUsername(firstName, lastName, f);
  const email = buildEmail(firstName, lastName, f);
  const phone = f.phone.number();
  const addressLine1 = f.location.streetAddress();
  const city = f.location.city();
  const region = f.location.state();
  const postalCode = f.location.zipCode();
  const dateOfBirth = f.date
    .birthdate({ min: 18, max: 75, mode: "age" })
    .toISOString()
    .slice(0, 10);

  return {
    id,
    firstName,
    lastName,
    fullName,
    username,
    email,
    phone,
    dateOfBirth,
    gender: sex,
    locale: entry.locale,
    avatarUrl: buildAvatarUrl(id),
    professionalTitle: f.person.jobTitle(),
    specialty: f.person.jobArea(),
    companyName: f.company.name(),
    companyWebsite: `https://www.${f.internet.domainName()}`,
    linkedInUrl: buildLinkedInUrl(firstName, lastName),
    biography:
      generateLocaleSnippet(entry.locale, "short-bio") ??
      f.lorem.sentences(f.number.int({ min: 2, max: 4 })),
    addressLine1,
    city,
    region,
    postalCode,
    countryCode: entry.code,
    countryName: entry.label,
    address: formatAddress({
      addressLine1,
      city,
      region,
      postalCode,
      countryName: entry.label,
    }),
    ...generateTestCard(),
  };
}

export function generateMockProfile(options?: GenerateMockProfileOptions): MockProfile {
  return generateFromEntry(resolveCountry(options?.countryCode), options);
}

export function generateMockProfiles(
  count: number,
  options?: GenerateMockProfileOptions
): MockProfile[] {
  const n = clampCount(count);
  return Array.from({ length: n }, () => generateMockProfile(options));
}

export async function generateMockProfilesChunked(
  count: number,
  options: GenerateMockProfileOptions | undefined,
  onProgress?: (done: number, total: number) => void
): Promise<MockProfile[]> {
  const total = clampCount(count);
  const out: MockProfile[] = [];
  for (let i = 0; i < total; i += GENERATE_CHUNK_SIZE) {
    const chunkSize = Math.min(GENERATE_CHUNK_SIZE, total - i);
    for (let j = 0; j < chunkSize; j++) {
      out.push(generateMockProfile(options));
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

const COUNTRY_FIELDS = new Set<MockProfileFieldKey>([
  "countryCode",
  "countryName",
  "locale",
]);

const ADDRESS_PART_FIELDS = new Set<MockProfileFieldKey>([
  "addressLine1",
  "city",
  "region",
  "postalCode",
]);

const NAME_FIELDS = new Set<MockProfileFieldKey>(["firstName", "lastName"]);

function refreshDerivedName(profile: MockProfile): MockProfile {
  return { ...profile, fullName: `${profile.firstName} ${profile.lastName}` };
}

function refreshDerivedAddress(profile: MockProfile): MockProfile {
  return {
    ...profile,
    address: formatAddress(profile),
  };
}

export function regenerateProfileField(
  profile: MockProfile,
  field: MockProfileFieldKey,
  options?: GenerateMockProfileOptions
): MockProfile {
  if (COUNTRY_FIELDS.has(field)) {
    const locked = options?.countryCode?.trim();
    const entry = locked ? resolveCountry(locked) : pickRandomCountryEntry();
    const next = generateFromEntry(entry, options);
    return {
      ...profile,
      locale: next.locale,
      countryCode: next.countryCode,
      countryName: next.countryName,
      addressLine1: next.addressLine1,
      city: next.city,
      region: next.region,
      postalCode: next.postalCode,
      address: next.address,
      phone: next.phone,
    };
  }

  const entry = resolveCountry(options?.countryCode || profile.countryCode);
  const fresh = generateFromEntry(entry, {
    ...options,
    countryCode: entry.code,
    gender:
      options?.gender && options.gender !== "any"
        ? options.gender
        : (profile.gender as GenderOption),
  });

  if (field === "fullName") {
    return {
      ...profile,
      firstName: fresh.firstName,
      lastName: fresh.lastName,
      fullName: fresh.fullName,
    };
  }

  if (NAME_FIELDS.has(field)) {
    return refreshDerivedName({ ...profile, [field]: fresh[field] });
  }

  if (ADDRESS_PART_FIELDS.has(field)) {
    return refreshDerivedAddress({ ...profile, [field]: fresh[field] });
  }

  if (field === "address") {
    return refreshDerivedAddress({
      ...profile,
      addressLine1: fresh.addressLine1,
      city: fresh.city,
      region: fresh.region,
      postalCode: fresh.postalCode,
    });
  }

  if (field === "id") {
    return { ...profile, id: fresh.id, avatarUrl: buildAvatarUrl(fresh.id) };
  }

  if (field.startsWith("testCard")) {
    const card = generateTestCard();
    return { ...profile, ...card };
  }

  return { ...profile, [field]: fresh[field] };
}
