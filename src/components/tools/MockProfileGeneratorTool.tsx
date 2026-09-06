"use client";

import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Copy, Download, RefreshCw } from "lucide-react";
import { copyToClipboard } from "@/lib/clipboard";
import { useToolSettings } from "@/hooks/useToolSettings";
import {
  COUNT_PRESETS,
  DEFAULT_MOCK_PROFILE_FIELDS,
  MAX_MOCK_PROFILES,
  MOCK_PROFILE_COUNTRIES,
  MOCK_PROFILE_FIELD_GROUPS,
  MOCK_PROFILE_FIELDS,
  PREVIEW_ROW_LIMIT,
  generateMockProfiles,
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

const MOCK_PROFILE_DEFAULTS: {
  countryCode: string;
  gender: GenderOption;
  count: number;
  fields: MockProfileFieldKey[];
} = {
  countryCode: "",
  gender: "any",
  count: 1,
  fields: [...DEFAULT_MOCK_PROFILE_FIELDS],
};

function downloadTextFile(filename: string, contents: string, mime: string) {
  const blob = new Blob([contents], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function fieldLabel(key: MockProfileFieldKey): string {
  return MOCK_PROFILE_FIELDS.find((field) => field.key === key)?.label ?? key;
}

function isMultilineField(key: MockProfileFieldKey): boolean {
  return key === "biography" || key === "address";
}

function FieldValue({
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

  if (isMultilineField(field)) {
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
  field,
  value,
  onRegenerate,
}: {
  field: MockProfileFieldKey;
  value: string;
  onRegenerate: () => void;
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
    <div className={`min-w-0 ${isMultilineField(field) ? "sm:col-span-2" : ""}`}>
      <div className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
        {fieldLabel(field)}
      </div>
      <div className="flex gap-2 min-w-0">
        <div className="flex-1 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-900/50 text-neutral-900 dark:text-neutral-100">
          <FieldValue field={field} value={value} />
        </div>
        <div className="flex shrink-0 self-start gap-1">
          <button
            type="button"
            onClick={onRegenerate}
            title={`Regenerate ${fieldLabel(field).toLowerCase()}`}
            className="px-2.5 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
          >
            <RefreshCw className="h-4 w-4" aria-hidden />
            <span className="sr-only">Regenerate {fieldLabel(field)}</span>
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
  const [s, setS] = useToolSettings("main", MOCK_PROFILE_DEFAULTS);
  const countryCode = s.countryCode;
  const gender = s.gender;
  const count = Math.min(MAX_MOCK_PROFILES, Math.max(1, Number(s.count) || 1));
  const fields = useMemo(
    () => sanitizeFieldSelection(s.fields ?? DEFAULT_MOCK_PROFILE_FIELDS),
    [s.fields]
  );

  const [profiles, setProfiles] = useState<MockProfile[]>([]);
  const [generating, setGenerating] = useState(false);
  const [copiedKind, setCopiedKind] = useState<"json" | "csv" | "values" | null>(
    null
  );
  const [fieldsOpen, setFieldsOpen] = useState(false);

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

  const handleGenerate = useCallback(() => {
    setGenerating(true);
    window.setTimeout(() => {
      try {
        setProfiles(generateMockProfiles(count, generateOptions));
      } catch {
        toast.error("Could not generate test data. Try a smaller count.");
      } finally {
        setGenerating(false);
      }
    }, 0);
  }, [count, generateOptions]);

  const markCopied = useCallback((kind: "json" | "csv" | "values") => {
    setCopiedKind(kind);
    window.setTimeout(() => setCopiedKind(null), 2000);
  }, []);

  const copyText = useCallback(
    async (text: string, kind: "json" | "csv" | "values", emptyMessage: string) => {
      if (!profiles.length) {
        toast.error("Generate profiles first");
        return;
      }
      if (!text) {
        toast.error(emptyMessage);
        return;
      }
      const ok = await copyToClipboard(text);
      if (ok) {
        markCopied(kind);
        toast.success(
          kind === "json"
            ? `Copied ${profiles.length} user${profiles.length === 1 ? "" : "s"} as JSON`
            : kind === "csv"
              ? "CSV copied"
              : "Values copied"
        );
      } else {
        toast.error("Copy failed. Try selecting and copying manually.");
      }
    },
    [markCopied, profiles.length]
  );

  const handleCopyJson = useCallback(() => {
    void copyText(profilesToJson(profiles, fields), "json", "Nothing to copy");
  }, [copyText, fields, profiles]);

  const handleCopyCsv = useCallback(() => {
    void copyText(profilesToCsv(profiles, fields), "csv", "Nothing to copy");
  }, [copyText, fields, profiles]);

  const handleCopyValues = useCallback(() => {
    const only = fields[0];
    if (!only || fields.length !== 1) return;
    void copyText(profilesToValueList(profiles, only), "values", "Nothing to copy");
  }, [copyText, fields, profiles]);

  const handleDownload = useCallback(
    (format: "json" | "csv") => {
      if (!profiles.length) {
        toast.error("Generate profiles first");
        return;
      }
      const body =
        format === "json" ? profilesToJson(profiles, fields) : profilesToCsv(profiles, fields);
      downloadTextFile(
        `test-users-${profiles.length}.${format}`,
        body,
        format === "json" ? "application/json;charset=utf-8" : "text/csv;charset=utf-8"
      );
      toast.success(`${format.toUpperCase()} downloaded`);
    },
    [fields, profiles]
  );

  const toggleField = useCallback(
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

  const setFieldPreset = useCallback(
    (next: MockProfileFieldKey[]) => {
      setS((prev) => ({ ...prev, fields: sanitizeFieldSelection(next) }));
    },
    [setS]
  );

  const handleRegenerateField = useCallback(
    (field: MockProfileFieldKey) => {
      setProfiles((current) => {
        if (current.length !== 1 || !current[0]) return current;
        return [regenerateProfileField(current[0], field, generateOptions)];
      });
    },
    [generateOptions]
  );

  const selectedSet = useMemo(() => new Set(fields), [fields]);
  const previewRows = profiles.slice(0, PREVIEW_ROW_LIMIT);
  const single = profiles.length === 1 ? profiles[0] : null;
  const singleView = single ? pickProfileFields(single, fields) : null;
  const includesTestCard = fields.some((field) => field.startsWith("testCard"));

  return (
    <div className="space-y-5">
      <p className="text-sm text-neutral-600 dark:text-neutral-400 rounded-lg border border-amber-200/80 dark:border-amber-900/50 bg-amber-50/80 dark:bg-amber-950/30 px-3 py-2">
        Synthetic data for testing only. These are not real people—use only on
        non-production systems and test accounts.
      </p>

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

        <div className="sm:col-span-2">
          <span className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            How many users
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {COUNT_PRESETS.map((preset) => (
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
              max={MAX_MOCK_PROFILES}
              value={s.count}
              onChange={(e) =>
                setS((p) => ({
                  ...p,
                  count: Math.min(
                    MAX_MOCK_PROFILES,
                    Math.max(1, parseInt(e.target.value, 10) || 1)
                  ),
                }))
              }
              className="w-24 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 font-mono text-sm"
              aria-label="Custom user count"
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
          <span>{`Fields (${fields.length} selected)`}</span>
          <span className="text-neutral-500 dark:text-neutral-400">
            {fieldsOpen ? "Hide" : "Customize"}
          </span>
        </button>
        {fieldsOpen && (
          <div className="space-y-4 border-t border-neutral-200 dark:border-neutral-800 px-3 py-3">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setFieldPreset(DEFAULT_MOCK_PROFILE_FIELDS)}
                className="px-2.5 py-1 text-xs font-medium rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              >
                Defaults
              </button>
              <button
                type="button"
                onClick={() =>
                  setFieldPreset(MOCK_PROFILE_FIELDS.map((field) => field.key))
                }
                className="px-2.5 py-1 text-xs font-medium rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              >
                Select all
              </button>
              <button
                type="button"
                onClick={() => setFieldPreset(["email", "fullName", "username"])}
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
                          checked={selectedSet.has(field.key)}
                          onChange={() => toggleField(field.key)}
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
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={generating}
          className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium rounded-lg hover:bg-neutral-700 dark:hover:bg-neutral-200 disabled:opacity-60"
        >
          {generating
            ? "Generating…"
            : `Generate ${count.toLocaleString()} ${count === 1 ? "user" : "users"}`}
        </button>
        <button
          type="button"
          onClick={handleCopyJson}
          disabled={!profiles.length}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:pointer-events-none"
        >
          <Copy className="h-4 w-4" aria-hidden />
          {copiedKind === "json" ? "JSON copied" : "Copy as JSON"}
        </button>
        <button
          type="button"
          onClick={handleCopyCsv}
          disabled={!profiles.length}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:pointer-events-none"
        >
          <Copy className="h-4 w-4" aria-hidden />
          {copiedKind === "csv" ? "CSV copied" : "Copy as CSV"}
        </button>
        {fields.length === 1 && (
          <button
            type="button"
            onClick={handleCopyValues}
            disabled={!profiles.length}
            className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:pointer-events-none"
          >
            {copiedKind === "values" ? "Values copied" : "Copy values"}
          </button>
        )}
        <button
          type="button"
          onClick={() => handleDownload("json")}
          disabled={!profiles.length}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:pointer-events-none"
        >
          <Download className="h-4 w-4" aria-hidden />
          Download JSON
        </button>
        <button
          type="button"
          onClick={() => handleDownload("csv")}
          disabled={!profiles.length}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:pointer-events-none"
        >
          <Download className="h-4 w-4" aria-hidden />
          Download CSV
        </button>
      </div>

      {profiles.length > 0 && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {`${profiles.length.toLocaleString()} synthetic ${
            profiles.length === 1 ? "user" : "users"
          } · ${fields.length} ${fields.length === 1 ? "field" : "fields"}${
            countryCode ? ` · ${countryCode}` : " · mixed locales"
          }`}
        </p>
      )}

      {single && singleView && (
        <div className="grid gap-4 sm:grid-cols-2 pt-1">
          {fields.map((field) => (
            <GridField
              key={field}
              field={field}
              value={String(singleView[field] ?? "")}
              onRegenerate={() => handleRegenerateField(field)}
            />
          ))}
        </div>
      )}

      {profiles.length > 1 && (
        <div className="space-y-2">
          <div className="overflow-x-auto rounded-lg border border-neutral-300 dark:border-neutral-700">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-neutral-50 dark:bg-neutral-900/80 text-neutral-600 dark:text-neutral-400">
                <tr>
                  {fields.map((field) => (
                    <th
                      key={field}
                      className="whitespace-nowrap px-3 py-2 font-medium"
                    >
                      {fieldLabel(field)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewRows.map((profile, index) => {
                  const row = pickProfileFields(profile, fields);
                  return (
                    <tr
                      key={profile.id || index}
                      className="border-t border-neutral-200 dark:border-neutral-800"
                    >
                      {fields.map((field) => (
                        <td
                          key={field}
                          className="max-w-[16rem] truncate px-3 py-2 text-neutral-800 dark:text-neutral-200"
                          title={String(row[field] ?? "")}
                        >
                          {field === "avatarUrl" && row.avatarUrl ? (
                            <span className="inline-flex items-center gap-2">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={row.avatarUrl}
                                alt=""
                                width={24}
                                height={24}
                                className="h-6 w-6 rounded-full bg-neutral-100 dark:bg-neutral-800"
                              />
                              <span className="font-mono text-xs">avatar</span>
                            </span>
                          ) : (
                            String(row[field] ?? "").replace(/\n/g, " · ")
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {profiles.length > PREVIEW_ROW_LIMIT && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Showing {PREVIEW_ROW_LIMIT} of {profiles.length.toLocaleString()}.
              Copy or download JSON/CSV for the full set.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
