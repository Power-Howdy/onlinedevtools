"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Copy, Download, RefreshCw } from "lucide-react";
import { copyToClipboard } from "@/lib/clipboard";
import { useToolSettings } from "@/hooks/useToolSettings";
import {
  downloadTextFile,
  EXPORT_MIME,
  recordsToSql,
  recordsToYaml,
  type ExportRecord,
} from "@/lib/data-export";
import {
  COUNT_PRESETS,
  DEFAULT_MOCK_PROFILE_FIELDS,
  MAX_MOCK_PROFILES,
  MOCK_PROFILE_COUNTRIES,
  MOCK_PROFILE_FIELD_GROUPS,
  MOCK_PROFILE_FIELDS,
  PREVIEW_ROW_LIMIT,
  generateMockProfilesChunked,
  pickProfileFields,
  profilesToCsv,
  profilesToJson,
  profilesToValueList,
  regenerateProfileField,
  sanitizeFieldSelection,
  type GenderOption,
  type MockProfile,
  type MockProfileFieldKey,
} from "@/lib/mock-profile";
import {
  DEFAULT_MOCK_PRODUCT_FIELDS,
  MAX_MOCK_PRODUCTS,
  MOCK_PRODUCT_FIELDS,
  PRODUCT_COUNT_PRESETS,
  generateMockProductsChunked,
  pickProductFields,
  productsToCsv,
  productsToJson,
  productsToValueList,
  regenerateProductField,
  sanitizeProductFieldSelection,
  type MockProduct,
  type MockProductFieldKey,
} from "@/lib/mock-products";
import {
  DEFAULT_MOCK_ORDER_FIELDS,
  MAX_MOCK_ORDERS,
  MOCK_ORDER_FIELDS,
  ORDER_COUNT_PRESETS,
  generateMockOrdersChunked,
  orderToFlat,
  ordersToCsv,
  ordersToFlatRecords,
  ordersToJson,
  ordersToValueList,
  pickOrderFlatFields,
  regenerateOrderField,
  sanitizeOrderFieldSelection,
  type MockOrder,
  type MockOrderFieldKey,
} from "@/lib/mock-orders";

export type DatasetType = "users" | "products" | "orders";

type CopiedKind = "json" | "csv" | "sql" | "yaml" | "values" | null;

const DATASET_TABS: { id: DatasetType; label: string }[] = [
  { id: "users", label: "Users" },
  { id: "products", label: "Products" },
  { id: "orders", label: "Orders" },
];

const DEFAULT_TABLE_NAMES: Record<DatasetType, string> = {
  users: "users",
  products: "products",
  orders: "orders",
};

const MOCK_PROFILE_DEFAULTS: {
  dataset: DatasetType;
  countryCode: string;
  gender: GenderOption;
  count: number;
  fields: MockProfileFieldKey[];
  productFields: MockProductFieldKey[];
  orderFields: MockOrderFieldKey[];
  tableName: string;
  snakeCase: boolean;
} = {
  dataset: "users",
  countryCode: "",
  gender: "any",
  count: 10,
  fields: [...DEFAULT_MOCK_PROFILE_FIELDS],
  productFields: [...DEFAULT_MOCK_PRODUCT_FIELDS],
  orderFields: [...DEFAULT_MOCK_ORDER_FIELDS],
  tableName: "users",
  snakeCase: true,
};

function parseDataset(raw: string | null | undefined): DatasetType | null {
  if (raw === "users" || raw === "products" || raw === "orders") return raw;
  if (raw === "user" || raw === "profiles") return "users";
  if (raw === "product") return "products";
  if (raw === "order") return "orders";
  return null;
}

function fieldLabelUsers(key: MockProfileFieldKey): string {
  return MOCK_PROFILE_FIELDS.find((field) => field.key === key)?.label ?? key;
}

function fieldLabelProducts(key: MockProductFieldKey): string {
  return MOCK_PRODUCT_FIELDS.find((field) => field.key === key)?.label ?? key;
}

function fieldLabelOrders(key: MockOrderFieldKey): string {
  return MOCK_ORDER_FIELDS.find((field) => field.key === key)?.label ?? key;
}

function isMultilineUserField(key: MockProfileFieldKey): boolean {
  return key === "biography" || key === "address";
}

function UserFieldValue({
  field,
  value,
}: {
  field: MockProfileFieldKey;
  value: string;
}) {
  if (field === "avatarUrl" && value) {
    return (
      <div className="flex items-center gap-3 min-w-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={value}
          alt=""
          width={40}
          height={40}
          className="h-10 w-10 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
        />
        <span className="font-mono text-xs sm:text-sm break-all">{value}</span>
      </div>
    );
  }

  if (isMultilineUserField(field)) {
    return (
      <textarea
        readOnly
        value={value}
        rows={field === "biography" ? 4 : 3}
        className="w-full px-0 py-0 bg-transparent border-0 resize-y text-sm leading-relaxed"
      />
    );
  }

  return (
    <span
      className={
        field === "email" ||
        field === "phone" ||
        field === "id" ||
        field === "username" ||
        field === "testCardNumber" ||
        field === "testCardCvc" ||
        field === "companyWebsite" ||
        field === "linkedInUrl" ||
        field === "postalCode" ||
        field === "countryCode"
          ? "font-mono text-xs sm:text-sm break-all"
          : "text-sm break-words"
      }
    >
      {value || "—"}
    </span>
  );
}

function GridField({
  label,
  multiline,
  value,
  mono,
  onRegenerate,
  leading,
}: {
  label: string;
  multiline?: boolean;
  value: string;
  mono?: boolean;
  onRegenerate: () => void;
  leading?: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    if (!value) {
      toast.error("Nothing to copy");
      return;
    }
    const ok = await copyToClipboard(value);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Copy failed. Try selecting and copying manually.");
    }
  }, [value]);

  return (
    <div className={`min-w-0 ${multiline ? "sm:col-span-2" : ""}`}>
      <div className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
        {label}
      </div>
      <div className="flex gap-2 min-w-0">
        <div className="flex-1 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-900/50 text-neutral-900 dark:text-neutral-100">
          {leading ??
            (multiline ? (
              <textarea
                readOnly
                value={value}
                rows={3}
                className="w-full px-0 py-0 bg-transparent border-0 resize-y text-sm leading-relaxed"
              />
            ) : (
              <span className={mono ? "font-mono text-xs sm:text-sm break-all" : "text-sm break-words"}>
                {value || "—"}
              </span>
            ))}
        </div>
        <div className="flex shrink-0 self-start gap-1">
          <button
            type="button"
            onClick={onRegenerate}
            title={`Regenerate ${label.toLowerCase()}`}
            className="px-2.5 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
          >
            <RefreshCw className="h-4 w-4" aria-hidden />
            <span className="sr-only">Regenerate {label}</span>
          </button>
          <button
            type="button"
            onClick={copy}
            disabled={!value}
            className="px-3 py-2 text-sm font-medium rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:pointer-events-none"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function MockProfileGeneratorTool() {
  const searchParams = useSearchParams();
  const [s, setS] = useToolSettings("main", MOCK_PROFILE_DEFAULTS);
  const dataset = (parseDataset(s.dataset) ?? "users") as DatasetType;
  const countryCode = s.countryCode;
  const gender = s.gender;
  const maxCount =
    dataset === "users"
      ? MAX_MOCK_PROFILES
      : dataset === "products"
        ? MAX_MOCK_PRODUCTS
        : MAX_MOCK_ORDERS;
  const count = Math.min(maxCount, Math.max(1, Number(s.count) || 1));
  const userFields = useMemo(
    () => sanitizeFieldSelection(s.fields ?? DEFAULT_MOCK_PROFILE_FIELDS),
    [s.fields]
  );
  const productFields = useMemo(
    () => sanitizeProductFieldSelection(s.productFields ?? DEFAULT_MOCK_PRODUCT_FIELDS),
    [s.productFields]
  );
  const orderFields = useMemo(
    () => sanitizeOrderFieldSelection(s.orderFields ?? DEFAULT_MOCK_ORDER_FIELDS),
    [s.orderFields]
  );

  const [profiles, setProfiles] = useState<MockProfile[]>([]);
  const [products, setProducts] = useState<MockProduct[]>([]);
  const [orders, setOrders] = useState<MockOrder[]>([]);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(
    null
  );
  const [copiedKind, setCopiedKind] = useState<CopiedKind>(null);
  const [fieldsOpen, setFieldsOpen] = useState(false);

  // Deep-link ?type=products|orders|users
  useEffect(() => {
    const fromUrl = parseDataset(searchParams.get("type"));
    if (fromUrl && fromUrl !== dataset) {
      setS((prev) => ({
        ...prev,
        dataset: fromUrl,
        tableName:
          prev.tableName === DEFAULT_TABLE_NAMES[prev.dataset as DatasetType] ||
          !prev.tableName
            ? DEFAULT_TABLE_NAMES[fromUrl]
            : prev.tableName,
      }));
    }
    // Only react to URL changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const sortedCountries = useMemo(
    () => [...MOCK_PROFILE_COUNTRIES].sort((a, b) => a.label.localeCompare(b.label)),
    []
  );

  const generateOptions = useMemo(
    () => ({
      countryCode: countryCode || undefined,
      gender,
    }),
    [countryCode, gender]
  );

  const recordCount =
    dataset === "users"
      ? profiles.length
      : dataset === "products"
        ? products.length
        : orders.length;

  const activeFields =
    dataset === "users" ? userFields : dataset === "products" ? productFields : orderFields;

  const countPresets =
    dataset === "users"
      ? COUNT_PRESETS
      : dataset === "products"
        ? PRODUCT_COUNT_PRESETS
        : ORDER_COUNT_PRESETS;

  const noun =
    dataset === "users" ? "user" : dataset === "products" ? "product" : "order";
  const nounPlural =
    dataset === "users" ? "users" : dataset === "products" ? "products" : "orders";

  const setDataset = useCallback(
    (next: DatasetType) => {
      setS((prev) => {
        const prevDataset = parseDataset(String(prev.dataset)) ?? "users";
        const keepTable =
          prev.tableName &&
          prev.tableName !== DEFAULT_TABLE_NAMES[prevDataset];
        return {
          ...prev,
          dataset: next,
          tableName: keepTable ? prev.tableName : DEFAULT_TABLE_NAMES[next],
        };
      });
      setCopiedKind(null);
    },
    [setS]
  );

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    setProgress({ done: 0, total: count });
    try {
      if (dataset === "users") {
        const next = await generateMockProfilesChunked(count, generateOptions, (done, total) =>
          setProgress({ done, total })
        );
        setProfiles(next);
        setProducts([]);
        setOrders([]);
      } else if (dataset === "products") {
        const next = await generateMockProductsChunked(
          count,
          { countryCode: countryCode || undefined },
          (done, total) => setProgress({ done, total })
        );
        setProducts(next);
        setProfiles([]);
        setOrders([]);
      } else {
        const next = await generateMockOrdersChunked(
          count,
          { countryCode: countryCode || undefined },
          (done, total) => setProgress({ done, total })
        );
        setOrders(next);
        setProfiles([]);
        setProducts([]);
      }
    } catch {
      toast.error("Could not generate test data. Try a smaller count.");
    } finally {
      setGenerating(false);
      setProgress(null);
    }
  }, [count, countryCode, dataset, generateOptions]);

  const markCopied = useCallback((kind: Exclude<CopiedKind, null>) => {
    setCopiedKind(kind);
    window.setTimeout(() => setCopiedKind(null), 2000);
  }, []);

  const ensureGenerated = useCallback(() => {
    if (recordCount === 0) {
      toast.error("Generate data first");
      return false;
    }
    return true;
  }, [recordCount]);

  const buildJson = useCallback((): string => {
    if (dataset === "users") return profilesToJson(profiles, userFields);
    if (dataset === "products") return productsToJson(products, productFields);
    return ordersToJson(orders, orderFields);
  }, [dataset, orderFields, orders, productFields, products, profiles, userFields]);

  const buildCsv = useCallback((): string => {
    if (dataset === "users") return profilesToCsv(profiles, userFields);
    if (dataset === "products") return productsToCsv(products, productFields);
    return ordersToCsv(orders, orderFields);
  }, [dataset, orderFields, orders, productFields, products, profiles, userFields]);

  const buildFlatRecords = useCallback((): ExportRecord[] => {
    if (dataset === "users") {
      return profiles.map(
        (profile) => pickProfileFields(profile, userFields) as ExportRecord
      );
    }
    if (dataset === "products") {
      return products.map(
        (product) => pickProductFields(product, productFields) as ExportRecord
      );
    }
    return ordersToFlatRecords(orders, orderFields);
  }, [dataset, orderFields, orders, productFields, products, profiles, userFields]);

  const buildSql = useCallback((): string => {
    const rows = buildFlatRecords();
    const columns =
      dataset === "users"
        ? userFields
        : dataset === "products"
          ? productFields
          : orderFields;
    return recordsToSql(rows, {
      tableName: (s.tableName || DEFAULT_TABLE_NAMES[dataset]).trim() || DEFAULT_TABLE_NAMES[dataset],
      columns,
      snakeCase: Boolean(s.snakeCase),
    });
  }, [
    buildFlatRecords,
    dataset,
    orderFields,
    productFields,
    s.snakeCase,
    s.tableName,
    userFields,
  ]);

  const buildYaml = useCallback((): string => {
    if (dataset === "orders") {
      // Keep nested items in YAML like JSON
      const keys = sanitizeOrderFieldSelection(orderFields);
      const rows = orders.map((order) => {
        const out: ExportRecord = {};
        for (const key of keys) {
          if (key === "items") out.items = order.items;
          else out[key] = order[key as keyof MockOrder];
        }
        return out;
      });
      return recordsToYaml(rows);
    }
    return recordsToYaml(buildFlatRecords());
  }, [buildFlatRecords, dataset, orderFields, orders]);

  const copyText = useCallback(
    async (text: string, kind: Exclude<CopiedKind, null>, emptyMessage: string) => {
      if (!ensureGenerated()) return;
      if (!text) {
        toast.error(emptyMessage);
        return;
      }
      const ok = await copyToClipboard(text);
      if (ok) {
        markCopied(kind);
        toast.success(
          kind === "json"
            ? `Copied ${recordCount} ${recordCount === 1 ? noun : nounPlural} as JSON`
            : `${kind.toUpperCase()} copied`
        );
      } else {
        toast.error("Copy failed. Try selecting and copying manually.");
      }
    },
    [ensureGenerated, markCopied, noun, nounPlural, recordCount]
  );

  const handleCopyJson = useCallback(() => {
    void copyText(buildJson(), "json", "Nothing to copy");
  }, [buildJson, copyText]);

  const handleCopyCsv = useCallback(() => {
    void copyText(buildCsv(), "csv", "Nothing to copy");
  }, [buildCsv, copyText]);

  const handleCopySql = useCallback(() => {
    void copyText(buildSql(), "sql", "Nothing to copy");
  }, [buildSql, copyText]);

  const handleCopyYaml = useCallback(() => {
    void copyText(buildYaml(), "yaml", "Nothing to copy");
  }, [buildYaml, copyText]);

  const handleCopyValues = useCallback(() => {
    if (activeFields.length !== 1 || !activeFields[0]) return;
    const only = activeFields[0];
    let text = "";
    if (dataset === "users") {
      text = profilesToValueList(profiles, only as MockProfileFieldKey);
    } else if (dataset === "products") {
      text = productsToValueList(products, only as MockProductFieldKey);
    } else {
      text = ordersToValueList(orders, only as MockOrderFieldKey);
    }
    void copyText(text, "values", "Nothing to copy");
  }, [activeFields, copyText, dataset, orders, products, profiles]);

  const handleDownload = useCallback(
    (format: "json" | "csv" | "sql" | "yaml") => {
      if (!ensureGenerated()) return;
      const body =
        format === "json"
          ? buildJson()
          : format === "csv"
            ? buildCsv()
            : format === "sql"
              ? buildSql()
              : buildYaml();
      downloadTextFile(
        `test-${nounPlural}-${recordCount}.${format === "yaml" ? "yml" : format}`,
        body,
        EXPORT_MIME[format]
      );
      toast.success(`${format.toUpperCase()} downloaded`);
    },
    [
      buildCsv,
      buildJson,
      buildSql,
      buildYaml,
      ensureGenerated,
      nounPlural,
      recordCount,
    ]
  );

  const toggleUserField = useCallback(
    (key: MockProfileFieldKey) => {
      setS((prev) => {
        const current = sanitizeFieldSelection(prev.fields ?? DEFAULT_MOCK_PROFILE_FIELDS);
        const next = current.includes(key)
          ? current.filter((item) => item !== key)
          : [...current, key];
        return { ...prev, fields: next.length > 0 ? next : current };
      });
    },
    [setS]
  );

  const toggleProductField = useCallback(
    (key: MockProductFieldKey) => {
      setS((prev) => {
        const current = sanitizeProductFieldSelection(
          prev.productFields ?? DEFAULT_MOCK_PRODUCT_FIELDS
        );
        const next = current.includes(key)
          ? current.filter((item) => item !== key)
          : [...current, key];
        return { ...prev, productFields: next.length > 0 ? next : current };
      });
    },
    [setS]
  );

  const toggleOrderField = useCallback(
    (key: MockOrderFieldKey) => {
      setS((prev) => {
        const current = sanitizeOrderFieldSelection(
          prev.orderFields ?? DEFAULT_MOCK_ORDER_FIELDS
        );
        const next = current.includes(key)
          ? current.filter((item) => item !== key)
          : [...current, key];
        return { ...prev, orderFields: next.length > 0 ? next : current };
      });
    },
    [setS]
  );

  const userSelected = useMemo(() => new Set(userFields), [userFields]);
  const productSelected = useMemo(() => new Set(productFields), [productFields]);
  const orderSelected = useMemo(() => new Set(orderFields), [orderFields]);
  const includesTestCard = userFields.some((field) => field.startsWith("testCard"));

  const singleUser = dataset === "users" && profiles.length === 1 ? profiles[0] : null;
  const singleProduct =
    dataset === "products" && products.length === 1 ? products[0] : null;
  const singleOrder = dataset === "orders" && orders.length === 1 ? orders[0] : null;

  const previewProfiles = profiles.slice(0, PREVIEW_ROW_LIMIT);
  const previewProducts = products.slice(0, PREVIEW_ROW_LIMIT);
  const previewOrders = orders.slice(0, PREVIEW_ROW_LIMIT);

  return (
    <div className="space-y-5">
      <p className="text-sm text-neutral-600 dark:text-neutral-400 rounded-lg border border-amber-200/80 dark:border-amber-900/50 bg-amber-50/80 dark:bg-amber-950/30 px-3 py-2">
        Synthetic data for testing only. These are not real people or live
        commerce records—use only on non-production systems and test accounts.
      </p>

      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Dataset type"
      >
        {DATASET_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={dataset === tab.id}
            onClick={() => setDataset(tab.id)}
            className={`px-3 py-2 rounded-lg text-sm font-medium ${
              dataset === tab.id
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label
            htmlFor="mock-profile-country"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
          >
            Locale / country
          </label>
          <select
            id="mock-profile-country"
            value={countryCode}
            onChange={(e) => setS((p) => ({ ...p, countryCode: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-sm"
          >
            <option value="">Random (any supported locale)</option>
            {sortedCountries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label} ({c.locale})
              </option>
            ))}
          </select>
        </div>

        {dataset === "users" && (
          <div>
            <label
              htmlFor="mock-profile-gender"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
            >
              Gender
            </label>
            <select
              id="mock-profile-gender"
              value={gender}
              onChange={(e) =>
                setS((p) => ({ ...p, gender: e.target.value as GenderOption }))
              }
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-sm"
            >
              <option value="any">Any</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </div>
        )}

        <div className={dataset === "users" ? "sm:col-span-2" : "sm:col-span-2 lg:col-span-3"}>
          <span className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            How many {nounPlural}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {countPresets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setS((p) => ({ ...p, count: preset }))}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  count === preset
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                }`}
              >
                {preset.toLocaleString()}
              </button>
            ))}
            <input
              id="mock-profile-count"
              type="number"
              min={1}
              max={maxCount}
              value={s.count}
              onChange={(e) =>
                setS((p) => ({
                  ...p,
                  count: Math.min(
                    maxCount,
                    Math.max(1, parseInt(e.target.value, 10) || 1)
                  ),
                }))
              }
              className="w-24 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 font-mono text-sm"
              aria-label={`Custom ${noun} count`}
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-neutral-200 dark:border-neutral-800">
        <button
          type="button"
          onClick={() => setFieldsOpen((open) => !open)}
          className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm font-medium text-neutral-800 dark:text-neutral-200"
        >
          <span>{`Fields (${activeFields.length} selected)`}</span>
          <span className="text-neutral-500 dark:text-neutral-400">
            {fieldsOpen ? "Hide" : "Customize"}
          </span>
        </button>
        {fieldsOpen && (
          <div className="space-y-4 border-t border-neutral-200 dark:border-neutral-800 px-3 py-3">
            {dataset === "users" && (
              <>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setS((p) => ({
                        ...p,
                        fields: [...DEFAULT_MOCK_PROFILE_FIELDS],
                      }))
                    }
                    className="px-2.5 py-1 text-xs font-medium rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  >
                    Defaults
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setS((p) => ({
                        ...p,
                        fields: MOCK_PROFILE_FIELDS.map((field) => field.key),
                      }))
                    }
                    className="px-2.5 py-1 text-xs font-medium rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  >
                    Select all
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setS((p) => ({
                        ...p,
                        fields: sanitizeFieldSelection(["email", "fullName", "username"]),
                      }))
                    }
                    className="px-2.5 py-1 text-xs font-medium rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  >
                    Minimal user
                  </button>
                </div>
                {MOCK_PROFILE_FIELD_GROUPS.map((group) => (
                  <div key={group.id}>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                      {group.label}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                      {MOCK_PROFILE_FIELDS.filter((field) => field.group === group.id).map(
                        (field) => (
                          <label
                            key={field.key}
                            className="inline-flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={userSelected.has(field.key)}
                              onChange={() => toggleUserField(field.key)}
                              className="rounded border-neutral-300"
                            />
                            {field.label}
                          </label>
                        )
                      )}
                    </div>
                  </div>
                ))}
                {includesTestCard && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Test card numbers use published sandbox BINs (for example Stripe
                    4242 / 5555 / 3782). They are not real payment instruments.
                  </p>
                )}
              </>
            )}

            {dataset === "products" && (
              <>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setS((p) => ({
                        ...p,
                        productFields: [...DEFAULT_MOCK_PRODUCT_FIELDS],
                      }))
                    }
                    className="px-2.5 py-1 text-xs font-medium rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  >
                    Defaults
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setS((p) => ({
                        ...p,
                        productFields: MOCK_PRODUCT_FIELDS.map((field) => field.key),
                      }))
                    }
                    className="px-2.5 py-1 text-xs font-medium rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  >
                    Select all
                  </button>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {MOCK_PRODUCT_FIELDS.map((field) => (
                    <label
                      key={field.key}
                      className="inline-flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={productSelected.has(field.key)}
                        onChange={() => toggleProductField(field.key)}
                        className="rounded border-neutral-300"
                      />
                      {field.label}
                    </label>
                  ))}
                </div>
              </>
            )}

            {dataset === "orders" && (
              <>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setS((p) => ({
                        ...p,
                        orderFields: [...DEFAULT_MOCK_ORDER_FIELDS],
                      }))
                    }
                    className="px-2.5 py-1 text-xs font-medium rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  >
                    Defaults
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setS((p) => ({
                        ...p,
                        orderFields: MOCK_ORDER_FIELDS.map((field) => field.key),
                      }))
                    }
                    className="px-2.5 py-1 text-xs font-medium rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  >
                    Select all
                  </button>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {MOCK_ORDER_FIELDS.map((field) => (
                    <label
                      key={field.key}
                      className="inline-flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={orderSelected.has(field.key)}
                        onChange={() => toggleOrderField(field.key)}
                        className="rounded border-neutral-300"
                      />
                      {field.label}
                    </label>
                  ))}
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  CSV and SQL flatten line items into a JSON text column so nested
                  order items survive flat formats.
                </p>
              </>
            )}
          </div>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 rounded-lg border border-neutral-200 dark:border-neutral-800 p-3">
        <div>
          <label
            htmlFor="mock-sql-table"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
          >
            SQL table name
          </label>
          <input
            id="mock-sql-table"
            type="text"
            value={s.tableName}
            onChange={(e) => setS((p) => ({ ...p, tableName: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 font-mono text-sm"
            placeholder={DEFAULT_TABLE_NAMES[dataset]}
          />
        </div>
        <div className="flex items-end">
          <label className="inline-flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300 cursor-pointer pb-2">
            <input
              type="checkbox"
              checked={Boolean(s.snakeCase)}
              onChange={(e) => setS((p) => ({ ...p, snakeCase: e.target.checked }))}
              className="rounded border-neutral-300"
            />
            Snake_case SQL columns (e.g. first_name)
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void handleGenerate()}
          disabled={generating}
          className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium rounded-lg hover:bg-neutral-700 dark:hover:bg-neutral-200 disabled:opacity-60"
        >
          {generating
            ? progress
              ? `Generating… ${progress.done.toLocaleString()}/${progress.total.toLocaleString()}`
              : "Generating…"
            : `Generate ${count.toLocaleString()} ${count === 1 ? noun : nounPlural}`}
        </button>
        <button
          type="button"
          onClick={handleCopyJson}
          disabled={!recordCount}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:pointer-events-none"
        >
          <Copy className="h-4 w-4" aria-hidden />
          {copiedKind === "json" ? "JSON copied" : "Copy JSON"}
        </button>
        <button
          type="button"
          onClick={handleCopyCsv}
          disabled={!recordCount}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:pointer-events-none"
        >
          <Copy className="h-4 w-4" aria-hidden />
          {copiedKind === "csv" ? "CSV copied" : "Copy CSV"}
        </button>
        <button
          type="button"
          onClick={handleCopySql}
          disabled={!recordCount}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:pointer-events-none"
        >
          <Copy className="h-4 w-4" aria-hidden />
          {copiedKind === "sql" ? "SQL copied" : "Copy SQL"}
        </button>
        <button
          type="button"
          onClick={handleCopyYaml}
          disabled={!recordCount}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:pointer-events-none"
        >
          <Copy className="h-4 w-4" aria-hidden />
          {copiedKind === "yaml" ? "YAML copied" : "Copy YAML"}
        </button>
        {activeFields.length === 1 && (
          <button
            type="button"
            onClick={handleCopyValues}
            disabled={!recordCount}
            className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:pointer-events-none"
          >
            {copiedKind === "values" ? "Values copied" : "Copy values"}
          </button>
        )}
        {(["json", "csv", "sql", "yaml"] as const).map((format) => (
          <button
            key={format}
            type="button"
            onClick={() => handleDownload(format)}
            disabled={!recordCount}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:pointer-events-none"
          >
            <Download className="h-4 w-4" aria-hidden />
            {format.toUpperCase()}
          </button>
        ))}
      </div>

      {recordCount > 0 && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {`${recordCount.toLocaleString()} synthetic ${
            recordCount === 1 ? noun : nounPlural
          } · ${activeFields.length} ${
            activeFields.length === 1 ? "field" : "fields"
          }${countryCode ? ` · ${countryCode}` : " · mixed locales"}`}
        </p>
      )}

      {singleUser && (
        <div className="grid gap-4 sm:grid-cols-2 pt-1">
          {userFields.map((field) => (
            <GridField
              key={field}
              label={fieldLabelUsers(field)}
              multiline={isMultilineUserField(field)}
              value={String(pickProfileFields(singleUser, userFields)[field] ?? "")}
              onRegenerate={() =>
                setProfiles([regenerateProfileField(singleUser, field, generateOptions)])
              }
              leading={
                field === "avatarUrl" || isMultilineUserField(field) ? (
                  <UserFieldValue
                    field={field}
                    value={String(singleUser[field] ?? "")}
                  />
                ) : undefined
              }
            />
          ))}
        </div>
      )}

      {singleProduct && (
        <div className="grid gap-4 sm:grid-cols-2 pt-1">
          {productFields.map((field) => (
            <GridField
              key={field}
              label={fieldLabelProducts(field)}
              multiline={field === "description"}
              mono={
                field === "id" ||
                field === "sku" ||
                field === "price" ||
                field === "currency" ||
                field === "imageUrl"
              }
              value={String(pickProductFields(singleProduct, productFields)[field] ?? "")}
              onRegenerate={() =>
                setProducts([
                  regenerateProductField(singleProduct, field, {
                    countryCode: countryCode || undefined,
                  }),
                ])
              }
            />
          ))}
        </div>
      )}

      {singleOrder && (
        <div className="grid gap-4 sm:grid-cols-2 pt-1">
          {orderFields.map((field) => {
            const flat = orderToFlat(singleOrder);
            const value = String(pickOrderFlatFields(flat, orderFields)[field] ?? "");
            return (
              <GridField
                key={field}
                label={fieldLabelOrders(field)}
                multiline={field === "shippingAddress" || field === "items"}
                mono={
                  field === "id" ||
                  field === "orderNumber" ||
                  field === "customerEmail" ||
                  field === "items"
                }
                value={value}
                onRegenerate={() =>
                  setOrders([
                    regenerateOrderField(singleOrder, field, {
                      countryCode: countryCode || undefined,
                    }),
                  ])
                }
              />
            );
          })}
        </div>
      )}

      {dataset === "users" && profiles.length > 1 && (
        <PreviewTable
          columns={userFields.map((field) => ({
            key: field,
            label: fieldLabelUsers(field),
          }))}
          rows={previewProfiles.map((profile) => {
            const row = pickProfileFields(profile, userFields);
            return {
              id: profile.id,
              cells: userFields.map((field) =>
                field === "avatarUrl" && row.avatarUrl
                  ? { type: "avatar" as const, url: row.avatarUrl }
                  : {
                      type: "text" as const,
                      value: String(row[field] ?? "").replace(/\n/g, " · "),
                    }
              ),
            };
          })}
          total={profiles.length}
          formatHint="JSON/CSV/SQL/YAML"
        />
      )}

      {dataset === "products" && products.length > 1 && (
        <PreviewTable
          columns={productFields.map((field) => ({
            key: field,
            label: fieldLabelProducts(field),
          }))}
          rows={previewProducts.map((product) => {
            const row = pickProductFields(product, productFields);
            return {
              id: product.id,
              cells: productFields.map((field) => ({
                type: "text" as const,
                value: String(row[field] ?? "").replace(/\n/g, " · "),
              })),
            };
          })}
          total={products.length}
          formatHint="JSON/CSV/SQL/YAML"
        />
      )}

      {dataset === "orders" && orders.length > 1 && (
        <PreviewTable
          columns={orderFields.map((field) => ({
            key: field,
            label: fieldLabelOrders(field),
          }))}
          rows={previewOrders.map((order) => {
            const row = pickOrderFlatFields(orderToFlat(order), orderFields);
            return {
              id: order.id,
              cells: orderFields.map((field) => ({
                type: "text" as const,
                value: String(row[field] ?? "").replace(/\n/g, " · "),
              })),
            };
          })}
          total={orders.length}
          formatHint="JSON/CSV/SQL/YAML"
        />
      )}
    </div>
  );
}

function PreviewTable({
  columns,
  rows,
  total,
  formatHint,
}: {
  columns: { key: string; label: string }[];
  rows: {
    id: string;
    cells: (
      | { type: "text"; value: string }
      | { type: "avatar"; url: string }
    )[];
  }[];
  total: number;
  formatHint: string;
}) {
  return (
    <div className="space-y-2">
      <div className="overflow-x-auto rounded-lg border border-neutral-300 dark:border-neutral-700">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-neutral-50 dark:bg-neutral-900/80 text-neutral-600 dark:text-neutral-400">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="whitespace-nowrap px-3 py-2 font-medium"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-t border-neutral-200 dark:border-neutral-800"
              >
                {row.cells.map((cell, index) => (
                  <td
                    key={`${row.id}-${columns[index]?.key ?? index}`}
                    className="max-w-[16rem] truncate px-3 py-2 text-neutral-800 dark:text-neutral-200"
                    title={cell.type === "text" ? cell.value : cell.url}
                  >
                    {cell.type === "avatar" ? (
                      <span className="inline-flex items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={cell.url}
                          alt=""
                          width={24}
                          height={24}
                          className="h-6 w-6 rounded-full bg-neutral-100 dark:bg-neutral-800"
                        />
                        <span className="font-mono text-xs">avatar</span>
                      </span>
                    ) : (
                      cell.value
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {total > PREVIEW_ROW_LIMIT && (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Showing {PREVIEW_ROW_LIMIT} of {total.toLocaleString()}. Copy or download{" "}
          {formatHint} for the full set.
        </p>
      )}
    </div>
  );
}
