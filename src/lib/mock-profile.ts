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

export type MockProfile = {
  fullName: string;
  email: string;
  phone: string;
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
  /** Multiline block for quick paste into forms */
  address: string;
};

export type MockProfileCountry = {
  code: string;
  label: string;
  faker: Faker;
};

function randomIndex(max: number): number {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return max <= 0 ? 0 : arr[0]! % max;
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

/** Curated ISO 3166-1 alpha-2 → Faker locale (English labels for forms). */
export const MOCK_PROFILE_COUNTRIES: readonly MockProfileCountry[] = [
  { code: "US", label: "United States", faker: fakerEN_US },
  { code: "GB", label: "United Kingdom", faker: fakerEN_GB },
  { code: "CA", label: "Canada", faker: fakerEN_CA },
  { code: "AU", label: "Australia", faker: fakerEN_AU },
  { code: "DE", label: "Germany", faker: fakerDE },
  { code: "FR", label: "France", faker: fakerFR },
  { code: "ES", label: "Spain", faker: fakerES },
  { code: "IT", label: "Italy", faker: fakerIT },
  { code: "NL", label: "Netherlands", faker: fakerNL },
  { code: "PL", label: "Poland", faker: fakerPL },
  { code: "BR", label: "Brazil", faker: fakerPT_BR },
  { code: "PT", label: "Portugal", faker: fakerPT_PT },
  { code: "JP", label: "Japan", faker: fakerJA },
  { code: "CN", label: "China", faker: fakerZH_CN },
  { code: "TW", label: "Taiwan", faker: fakerZH_TW },
  { code: "KR", label: "South Korea", faker: fakerKO },
  { code: "IN", label: "India", faker: fakerEN_IN },
  { code: "MX", label: "Mexico", faker: fakerES_MX },
  { code: "SE", label: "Sweden", faker: fakerSV },
  { code: "NO", label: "Norway", faker: fakerNB_NO },
  { code: "DK", label: "Denmark", faker: fakerDA },
  { code: "FI", label: "Finland", faker: fakerFI },
  { code: "RU", label: "Russia", faker: fakerRU },
  { code: "TR", label: "Turkey", faker: fakerTR },
  { code: "HU", label: "Hungary", faker: fakerHU },
  { code: "CZ", label: "Czech Republic", faker: fakerCS_CZ },
  { code: "RO", label: "Romania", faker: fakerRO },
  { code: "GR", label: "Greece", faker: fakerEL },
  { code: "ID", label: "Indonesia", faker: fakerID_ID },
  { code: "TH", label: "Thailand", faker: fakerTH },
  { code: "VN", label: "Vietnam", faker: fakerVI },
  { code: "IE", label: "Ireland", faker: fakerEN_IE },
  { code: "ZA", label: "South Africa", faker: fakerEN_ZA },
  { code: "NG", label: "Nigeria", faker: fakerEN_NG },
  { code: "AT", label: "Austria", faker: fakerDE_AT },
  { code: "CH", label: "Switzerland", faker: fakerDE_CH },
] as const;

const byCode = new Map(MOCK_PROFILE_COUNTRIES.map((c) => [c.code, c]));

export function pickRandomCountryEntry(): MockProfileCountry {
  return MOCK_PROFILE_COUNTRIES[randomIndex(MOCK_PROFILE_COUNTRIES.length)]!;
}

export function getCountryEntry(code: string): MockProfileCountry | undefined {
  return byCode.get(code.trim().toUpperCase());
}

export function generateMockProfile(options?: {
  countryCode?: string;
}): MockProfile {
  const explicit = options?.countryCode?.trim();
  const resolved = explicit ? getCountryEntry(explicit) : undefined;
  const entry = resolved ?? pickRandomCountryEntry();

  const f = entry.faker;
  const firstName = f.person.firstName();
  const lastName = f.person.lastName();
  const fullName = `${firstName} ${lastName}`;
  const email = f.internet.email({ firstName, lastName });
  const phone = f.phone.number();
  const addressLine1 = f.location.streetAddress();
  const city = f.location.city();
  const region = f.location.state();
  const postalCode = f.location.zipCode();

  const line2 = [city, region, postalCode].filter(Boolean).join(", ");
  const address = [addressLine1, line2, entry.label].join("\n");

  const professionalTitle = f.person.jobTitle();
  const specialty = f.person.jobArea();
  const companyName = f.company.name();
  const companyWebsite = `https://www.${f.internet.domainName()}`;
  const linkedInUrl = buildLinkedInUrl(firstName, lastName);
  const biography = f.lorem.sentences(f.number.int({ min: 2, max: 4 }));

  return {
    fullName,
    email,
    phone,
    professionalTitle,
    specialty,
    companyName,
    companyWebsite,
    linkedInUrl,
    biography,
    addressLine1,
    city,
    region,
    postalCode,
    countryCode: entry.code,
    countryName: entry.label,
    address,
  };
}
