"use client";

import type { Dispatch, SetStateAction } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useToolSlug } from "@/contexts/ToolAnalyticsContext";
import { readToolSettingsSegment, writeToolSettingsSegment } from "@/lib/tool-settings-storage";

/**
 * Persist a JSON-serializable settings object per tool slug and segment.
 * Use a stable `defaultState` (e.g. module-level const). `segment` separates
 * e.g. "main" vs "io" (InputOutput) within the same page.
 */
export function useToolSettings<T extends Record<string, unknown>>(
  segment: string,
  defaultState: T
): [T, Dispatch<SetStateAction<T>>] {
  const slug = useToolSlug();
  const [state, setState] = useState<T>(() => defaultState);
  const defaultsRef = useRef(defaultState);
  defaultsRef.current = defaultState;
  const loadedForSlug = useRef<string | null>(null);

  useLayoutEffect(() => {
    if (!slug) {
      loadedForSlug.current = null;
      setState(defaultsRef.current);
      return;
    }
    const stored = readToolSettingsSegment(slug, segment);
    const merged = {
      ...defaultsRef.current,
      ...(stored ?? {}),
    } as T;
    setState(merged);
    loadedForSlug.current = slug;
  }, [slug, segment]);

  useEffect(() => {
    if (!slug || loadedForSlug.current !== slug) return;
    writeToolSettingsSegment(slug, segment, state as Record<string, unknown>);
  }, [slug, segment, state]);

  return [state, setState];
}
