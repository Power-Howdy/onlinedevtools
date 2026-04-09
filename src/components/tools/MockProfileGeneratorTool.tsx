"use client";

import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { copyToClipboard } from "@/lib/clipboard";
import { useToolSettings } from "@/hooks/useToolSettings";
import {
  generateMockProfile,
  MOCK_PROFILE_COUNTRIES,
  type MockProfile,
} from "@/lib/mock-profile";

function BiographyBlock({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(async () => {
    const ok = await copyToClipboard(value);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Copy failed. Try selecting and copying manually.");
    }
  }, [value]);
  return (
    <div className="min-w-0 sm:col-span-2">
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
          Biography
        </span>
        <button
          type="button"
          onClick={copy}
          className="shrink-0 px-3 py-1.5 text-sm font-medium rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <textarea
        readOnly
        value={value}
        rows={5}
        className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-900/50 text-sm text-neutral-900 dark:text-neutral-100 leading-relaxed resize-y"
      />
    </div>
  );
}

function AddressBlock({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(async () => {
    const ok = await copyToClipboard(value);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Copy failed. Try selecting and copying manually.");
    }
  }, [value]);
  return (
    <div className="min-w-0 sm:col-span-2">
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
          Full address (multiline)
        </span>
        <button
          type="button"
          onClick={copy}
          className="shrink-0 px-3 py-1.5 text-sm font-medium rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <textarea
        readOnly
        value={value}
        rows={4}
        className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-900/50 font-mono text-sm resize-y"
      />
    </div>
  );
}

/** Stacked label + value + copy for two-column grid cells. */
function GridField({
  label,
  value,
  monospace,
}: {
  label: string;
  value: string;
  monospace?: boolean;
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
    <div className="min-w-0">
      <div className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
        {label}
      </div>
      <div className="flex gap-2 min-w-0">
        <div
          className={`flex-1 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-900/50 text-neutral-900 dark:text-neutral-100 break-words ${
            monospace ? "font-mono text-xs sm:text-sm" : "text-sm"
          }`}
        >
          {value || "—"}
        </div>
        <button
          type="button"
          onClick={copy}
          disabled={!value}
          className="shrink-0 self-start px-3 py-2 text-sm font-medium rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:pointer-events-none"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

const MOCK_PROFILE_DEFAULTS = { countryCode: "" };

export function MockProfileGeneratorTool() {
  const [s, setS] = useToolSettings("main", MOCK_PROFILE_DEFAULTS);
  const { countryCode } = s;
  const [profile, setProfile] = useState<MockProfile | null>(null);
  const [jsonCopied, setJsonCopied] = useState(false);

  const sortedCountries = useMemo(
    () => [...MOCK_PROFILE_COUNTRIES].sort((a, b) => a.label.localeCompare(b.label)),
    []
  );

  const handleGenerate = useCallback(() => {
    setProfile(
      generateMockProfile({
        countryCode: countryCode || undefined,
      })
    );
  }, [countryCode]);

  const copyJson = useCallback(async () => {
    if (!profile) {
      toast.error("Generate a profile first");
      return;
    }
    const ok = await copyToClipboard(JSON.stringify(profile, null, 2));
    if (ok) {
      setJsonCopied(true);
      setTimeout(() => setJsonCopied(false), 2000);
    } else {
      toast.error("Copy failed. Try selecting and copying manually.");
    }
  }, [profile]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-neutral-600 dark:text-neutral-400 rounded-lg border border-amber-200/80 dark:border-amber-900/50 bg-amber-50/80 dark:bg-amber-950/30 px-3 py-2">
        Synthetic data for testing only. These are not real people—use only on
        non-production systems and test accounts.
      </p>

      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-[min(100%,16rem)]">
          <label
            htmlFor="mock-profile-country"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
          >
            Country
          </label>
          <select
            id="mock-profile-country"
            value={countryCode}
            onChange={(e) => setS((p) => ({ ...p, countryCode: e.target.value }))}
            className="w-full max-w-md px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-sm"
          >
            <option value="">Random (any supported country)</option>
            {sortedCountries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label} ({c.code})
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={handleGenerate}
          className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium rounded-lg hover:bg-neutral-700 dark:hover:bg-neutral-200"
        >
          Generate
        </button>
        {profile && (
          <button
            type="button"
            onClick={copyJson}
            className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700"
          >
            {jsonCopied ? "JSON copied" : "Copy as JSON"}
          </button>
        )}
      </div>

      {profile && (
        <div className="grid gap-4 sm:grid-cols-2 pt-2">
          <div className="sm:col-span-2">
            <GridField label="Full name" value={profile.fullName} />
          </div>
          <GridField label="Email" value={profile.email.toLowerCase()} monospace />
          <GridField label="Phone" value={profile.phone} monospace />
          <GridField label="Professional title" value={profile.professionalTitle} />
          <GridField label="Specialty / focus" value={profile.specialty} />
          <GridField label="Company" value={profile.companyName} />
          <GridField label="Company website" value={profile.companyWebsite} monospace />
          <GridField label="LinkedIn URL" value={profile.linkedInUrl} monospace />
          <GridField label="Address line 1" value={profile.addressLine1} />
          <GridField label="City" value={profile.city} />
          <GridField label="Region / state" value={profile.region} />
          <GridField label="Postal code" value={profile.postalCode} monospace />
          <GridField label="Country" value={profile.countryName} />
          <GridField label="Country code" value={profile.countryCode} monospace />
          <BiographyBlock value={profile.biography} />
          <AddressBlock value={profile.address} />
        </div>
      )}
    </div>
  );
}
