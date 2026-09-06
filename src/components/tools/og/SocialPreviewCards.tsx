"use client";

import { useState } from "react";
import type { SocialPreview } from "@/lib/og-debug";

type Viewport = "desktop" | "mobile";

function PreviewImage({
  src,
  alt,
  className,
  missingLabel = "No image",
}: {
  src?: string;
  alt: string;
  className?: string;
  missingLabel?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-neutral-200 text-[11px] text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400 ${className ?? ""}`}
      >
        {missingLabel}
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={src}
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}

function Favicon({ src, className }: { src?: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-sm bg-neutral-300 text-[9px] font-bold text-neutral-600 dark:bg-neutral-700 dark:text-neutral-200 ${className ?? "h-4 w-4"}`}
      >
        ●
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={src}
      src={src}
      alt=""
      className={`rounded-sm object-cover ${className ?? "h-4 w-4"}`}
      onError={() => setFailed(true)}
    />
  );
}

function Frame({
  viewport,
  children,
  className,
}: {
  viewport: Viewport;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`${viewport === "mobile" ? "max-w-[320px]" : "max-w-[520px]"} ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

export function FacebookPreview({
  preview,
  viewport,
}: {
  preview: SocialPreview;
  viewport: Viewport;
}) {
  const compact = viewport === "mobile";
  return (
    <Frame viewport={viewport}>
      <div className="overflow-hidden rounded-lg border border-[#ccd0d5] bg-white shadow-sm dark:border-neutral-700">
        <PreviewImage
          src={preview.image}
          alt={preview.title}
          className={`w-full bg-[#ebedf0] object-cover ${compact ? "h-40" : "h-56"}`}
        />
        <div className={`bg-[#f2f3f5] ${compact ? "px-3 py-2" : "px-3.5 py-2.5"}`}>
          <div className="truncate text-[11px] font-normal uppercase tracking-wide text-[#606770]">
            {preview.domain}
          </div>
          <div
            className={`mt-0.5 font-semibold leading-snug text-[#1d2129] line-clamp-2 ${compact ? "text-[15px]" : "text-[17px]"}`}
          >
            {preview.title}
          </div>
          <div className="mt-0.5 line-clamp-1 text-[13px] leading-snug text-[#606770]">
            {preview.description}
          </div>
        </div>
      </div>
    </Frame>
  );
}

export function LinkedInPreview({
  preview,
  viewport,
}: {
  preview: SocialPreview;
  viewport: Viewport;
}) {
  return (
    <Frame viewport={viewport}>
      <div className="overflow-hidden rounded-lg border border-[#e0e0e0] bg-white shadow-sm dark:border-neutral-700">
        <PreviewImage
          src={preview.image}
          alt={preview.title}
          className="h-52 w-full bg-[#f3f2ef] object-cover"
        />
        <div className="px-3.5 py-3">
          <div className="line-clamp-2 text-[14px] font-semibold leading-snug text-[#191919]">
            {preview.title}
          </div>
          <div className="mt-1 truncate text-[12px] text-[#666666]">
            {preview.domain}
          </div>
        </div>
      </div>
    </Frame>
  );
}

export function TwitterPreview({
  preview,
  viewport,
}: {
  preview: SocialPreview;
  viewport: Viewport;
}) {
  const large =
    preview.twitterCard !== "summary" && preview.twitterCard !== "app";

  if (!large) {
    return (
      <Frame viewport={viewport}>
        <div className="flex overflow-hidden rounded-2xl border border-[#cfd9de] bg-white dark:border-neutral-700 dark:bg-neutral-950">
          <PreviewImage
            src={preview.image}
            alt={preview.title}
            className="h-[126px] w-[126px] shrink-0 bg-[#f7f9f9] object-cover"
          />
          <div className="min-w-0 flex-1 px-3 py-2.5">
            <div className="truncate text-[13px] text-[#536471]">{preview.domain}</div>
            <div className="mt-0.5 line-clamp-2 text-[15px] font-medium leading-snug text-[#0f1419] dark:text-neutral-100">
              {preview.title}
            </div>
            <div className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-[#536471]">
              {preview.description}
            </div>
          </div>
        </div>
      </Frame>
    );
  }

  return (
    <Frame viewport={viewport}>
      <div className="overflow-hidden rounded-2xl border border-[#cfd9de] bg-white dark:border-neutral-700 dark:bg-neutral-950">
        <PreviewImage
          src={preview.image}
          alt={preview.title}
          className="h-52 w-full bg-[#f7f9f9] object-cover"
        />
        <div className="border-t border-[#cfd9de] px-3 py-2 dark:border-neutral-700">
          <div className="truncate text-[13px] text-[#536471]">{preview.domain}</div>
          <div className="mt-0.5 line-clamp-2 text-[15px] font-medium leading-snug text-[#0f1419] dark:text-neutral-100">
            {preview.title}
          </div>
          <div className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-[#536471]">
            {preview.description}
          </div>
        </div>
      </div>
    </Frame>
  );
}

export function DiscordPreview({
  preview,
  viewport,
}: {
  preview: SocialPreview;
  viewport: Viewport;
}) {
  return (
    <Frame viewport={viewport}>
      <div className="rounded-md bg-[#313338] p-3 text-left shadow-sm">
        <div className="overflow-hidden rounded-sm border-l-4 border-[#1e1f22] bg-[#2b2d31] pl-3 pr-3 py-2">
          <div className="mb-1 flex items-center gap-1.5 text-[12px] font-semibold text-[#00a8fc]">
            <Favicon src={preview.favicon} className="h-3.5 w-3.5" />
            <span className="truncate text-[#00a8fc]">
              {preview.siteName || preview.domain}
            </span>
          </div>
          <div className="line-clamp-2 text-[16px] font-semibold leading-snug text-[#00a8fc]">
            {preview.title}
          </div>
          <div className="mt-1 line-clamp-3 text-[14px] leading-relaxed text-[#dbdee1]">
            {preview.description}
          </div>
          {preview.image ? (
            <PreviewImage
              src={preview.image}
              alt={preview.title}
              className="mt-2 max-h-56 w-full rounded-md object-cover"
            />
          ) : null}
        </div>
      </div>
    </Frame>
  );
}

export function SlackPreview({
  preview,
  viewport,
}: {
  preview: SocialPreview;
  viewport: Viewport;
}) {
  return (
    <Frame viewport={viewport}>
      <div className="rounded-lg border border-[#ddd] bg-white px-3 py-2.5 dark:border-neutral-700 dark:bg-neutral-950">
        <div className="flex gap-2">
          <div className="w-1 shrink-0 rounded-full bg-[#ddd] dark:bg-neutral-600" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#1d1c1d] dark:text-neutral-100">
              <Favicon src={preview.favicon} className="h-3.5 w-3.5" />
              <span className="truncate">{preview.siteName || preview.domain}</span>
            </div>
            <div className="mt-0.5 line-clamp-2 text-[15px] font-bold leading-snug text-[#1264a3]">
              {preview.title}
            </div>
            <div className="mt-0.5 line-clamp-3 text-[13px] leading-snug text-[#1d1c1d] dark:text-neutral-300">
              {preview.description}
            </div>
            <PreviewImage
              src={preview.image}
              alt={preview.title}
              className="mt-2 max-h-48 w-full rounded-md object-cover"
            />
          </div>
        </div>
      </div>
    </Frame>
  );
}
