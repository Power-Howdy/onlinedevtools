import {
  GENERATE_CHUNK_SIZE,
  getCountryEntry,
  pickRandomCountryEntry,
  type MockProfileCountry,
} from "@/lib/mock-profile";
import { CURRENCY_BY_COUNTRY } from "@/lib/mock-products";
import { recordsToCsv, recordsToJson } from "@/lib/data-export";

export type MockOrderItem = {
  sku: string;
  name: string;
  quantity: number;
  unitPrice: string;
};

export type MockOrderStatus = "pending" | "paid" | "shipped" | "cancelled";

export type MockOrder = {
  id: string;
  orderNumber: string;
  status: MockOrderStatus;
  createdAt: string;
  currency: string;
  subtotal: string;
  tax: string;
  total: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  items: MockOrderItem[];
  locale: string;
};

/** Flat row used for CSV/SQL (items as JSON text). */
export type MockOrderFlat = {
  id: string;
  orderNumber: string;
  status: string;
  createdAt: string;
  currency: string;
  subtotal: string;
  tax: string;
  total: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  items: string;
  locale: string;
};

export type MockOrderFieldKey = keyof MockOrderFlat;

export type MockOrderField = {
  key: MockOrderFieldKey;
  label: string;
  defaultOn: boolean;
};

export const MAX_MOCK_ORDERS = 10000;
export const ORDER_COUNT_PRESETS = [10, 100, 1000, 10000] as const;

export const MOCK_ORDER_FIELDS: readonly MockOrderField[] = [
  { key: "id", label: "UUID", defaultOn: true },
  { key: "orderNumber", label: "Order number", defaultOn: true },
  { key: "status", label: "Status", defaultOn: true },
  { key: "createdAt", label: "Created at", defaultOn: true },
  { key: "currency", label: "Currency", defaultOn: true },
  { key: "subtotal", label: "Subtotal", defaultOn: true },
  { key: "tax", label: "Tax", defaultOn: true },
  { key: "total", label: "Total", defaultOn: true },
  { key: "customerName", label: "Customer name", defaultOn: true },
  { key: "customerEmail", label: "Customer email", defaultOn: true },
  { key: "shippingAddress", label: "Shipping address", defaultOn: true },
  { key: "items", label: "Items (JSON)", defaultOn: true },
  { key: "locale", label: "Locale", defaultOn: false },
];

export const DEFAULT_MOCK_ORDER_FIELDS: MockOrderFieldKey[] =
  MOCK_ORDER_FIELDS.filter((field) => field.defaultOn).map((field) => field.key);

const FIELD_KEY_SET = new Set(MOCK_ORDER_FIELDS.map((field) => field.key));
const STATUSES: readonly MockOrderStatus[] = [
  "pending",
  "paid",
  "shipped",
  "cancelled",
];

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
  return Math.min(MAX_MOCK_ORDERS, Math.max(1, Math.floor(count) || 1));
}

function resolveCountry(countryCode?: string): MockProfileCountry {
  const explicit = countryCode?.trim();
  const resolved = explicit ? getCountryEntry(explicit) : undefined;
  return resolved ?? pickRandomCountryEntry();
}

function formatMoney(amount: number, currency: string): string {
  if (currency === "JPY" || currency === "KRW" || currency === "VND" || currency === "IDR") {
    return String(Math.round(amount));
  }
  return amount.toFixed(2);
}

function asciiEmail(firstName: string, lastName: string, domain: string): string {
  const local = `${firstName}.${lastName}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "")
    .replace(/^\.+|\.+$/g, "");
  return `${local || "customer"}${randomInt(10, 99)}@${domain}`;
}

export type GenerateMockOrderOptions = {
  countryCode?: string;
};

function generateFromEntry(entry: MockProfileCountry): MockOrder {
  const f = entry.faker;
  const id = crypto.randomUUID();
  const currency = CURRENCY_BY_COUNTRY[entry.code] ?? "USD";
  const itemCount = randomInt(1, 4);
  const items: MockOrderItem[] = Array.from({ length: itemCount }, () => {
    const unit = Number(f.commerce.price({ min: 5, max: 250, dec: 2 }));
    return {
      sku: `SKU-${f.string.alphanumeric({ length: 8, casing: "upper" })}`,
      name: f.commerce.productName(),
      quantity: randomInt(1, 5),
      unitPrice: formatMoney(unit, currency),
    };
  });

  const subtotalNum = items.reduce(
    (sum, item) => sum + Number(item.unitPrice) * item.quantity,
    0
  );
  const taxNum = subtotalNum * 0.08;
  const totalNum = subtotalNum + taxNum;
  const firstName = f.person.firstName();
  const lastName = f.person.lastName();
  const street = f.location.streetAddress();
  const city = f.location.city();
  const region = f.location.state();
  const postal = f.location.zipCode();

  return {
    id,
    orderNumber: `ORD-${f.string.numeric(8)}`,
    status: STATUSES[randomIndex(STATUSES.length)]!,
    createdAt: f.date.recent({ days: 90 }).toISOString(),
    currency,
    subtotal: formatMoney(subtotalNum, currency),
    tax: formatMoney(taxNum, currency),
    total: formatMoney(totalNum, currency),
    customerName: `${firstName} ${lastName}`,
    customerEmail: asciiEmail(firstName, lastName, f.internet.domainName()),
    shippingAddress: `${street}, ${city}, ${region} ${postal}, ${entry.label}`,
    items,
    locale: entry.locale,
  };
}

export function orderToFlat(order: MockOrder): MockOrderFlat {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    createdAt: order.createdAt,
    currency: order.currency,
    subtotal: order.subtotal,
    tax: order.tax,
    total: order.total,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    shippingAddress: order.shippingAddress,
    items: JSON.stringify(order.items),
    locale: order.locale,
  };
}

export function sanitizeOrderFieldSelection(
  fields: readonly string[]
): MockOrderFieldKey[] {
  const unique: MockOrderFieldKey[] = [];
  const seen = new Set<string>();
  for (const key of fields) {
    if (!FIELD_KEY_SET.has(key as MockOrderFieldKey) || seen.has(key)) continue;
    seen.add(key);
    unique.push(key as MockOrderFieldKey);
  }
  return unique.length > 0 ? unique : [...DEFAULT_MOCK_ORDER_FIELDS];
}

export function pickOrderFlatFields(
  flat: MockOrderFlat,
  fields: readonly MockOrderFieldKey[]
): Partial<MockOrderFlat> {
  const keys = sanitizeOrderFieldSelection(fields);
  const picked: Partial<MockOrderFlat> = {};
  for (const key of keys) {
    picked[key] = flat[key];
  }
  return picked;
}

/** JSON keeps nested items[]; field picker still applies to top-level keys. */
export function ordersToJson(
  orders: readonly MockOrder[],
  fields: readonly MockOrderFieldKey[]
): string {
  const keys = sanitizeOrderFieldSelection(fields);
  const rows = orders.map((order) => {
    const out: Record<string, unknown> = {};
    for (const key of keys) {
      if (key === "items") {
        out.items = order.items;
      } else {
        out[key] = order[key as keyof MockOrder];
      }
    }
    return out;
  });
  return recordsToJson(rows);
}

export function ordersToCsv(
  orders: readonly MockOrder[],
  fields: readonly MockOrderFieldKey[]
): string {
  const keys = sanitizeOrderFieldSelection(fields);
  return recordsToCsv(
    orders.map((order) => pickOrderFlatFields(orderToFlat(order), keys) as Record<string, unknown>),
    keys
  );
}

export function ordersToFlatRecords(
  orders: readonly MockOrder[],
  fields: readonly MockOrderFieldKey[]
): Record<string, unknown>[] {
  const keys = sanitizeOrderFieldSelection(fields);
  return orders.map(
    (order) => pickOrderFlatFields(orderToFlat(order), keys) as Record<string, unknown>
  );
}

export function ordersToValueList(
  orders: readonly MockOrder[],
  field: MockOrderFieldKey
): string {
  return orders.map((order) => String(orderToFlat(order)[field] ?? "")).join("\n");
}

export function generateMockOrder(options?: GenerateMockOrderOptions): MockOrder {
  return generateFromEntry(resolveCountry(options?.countryCode));
}

export function generateMockOrders(
  count: number,
  options?: GenerateMockOrderOptions
): MockOrder[] {
  const n = clampCount(count);
  return Array.from({ length: n }, () => generateMockOrder(options));
}

export async function generateMockOrdersChunked(
  count: number,
  options: GenerateMockOrderOptions | undefined,
  onProgress?: (done: number, total: number) => void
): Promise<MockOrder[]> {
  const total = clampCount(count);
  const out: MockOrder[] = [];
  for (let i = 0; i < total; i += GENERATE_CHUNK_SIZE) {
    const chunkSize = Math.min(GENERATE_CHUNK_SIZE, total - i);
    for (let j = 0; j < chunkSize; j++) {
      out.push(generateMockOrder(options));
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

export function regenerateOrderField(
  order: MockOrder,
  field: MockOrderFieldKey,
  options?: GenerateMockOrderOptions
): MockOrder {
  const fresh = generateFromEntry(resolveCountry(options?.countryCode));
  if (field === "items") {
    return { ...order, items: fresh.items, subtotal: fresh.subtotal, tax: fresh.tax, total: fresh.total };
  }
  if (field === "id") {
    return { ...order, id: fresh.id };
  }
  return { ...order, [field]: fresh[field as keyof MockOrder] };
}
