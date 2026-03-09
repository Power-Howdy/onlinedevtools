"use client";

import { useState, useCallback } from "react";
import toast from "react-hot-toast";

function hexToRgb(hex: string): { r: number; g: number; b: number; a?: number } | null {
  const raw = hex.replace(/^#/, "").trim();
  // #fff or #ffffff
  if (/^[a-fA-F0-9]{3}$/.test(raw)) {
    const r = parseInt(raw[0]! + raw[0], 16);
    const g = parseInt(raw[1]! + raw[1], 16);
    const b = parseInt(raw[2]! + raw[2], 16);
    return { r, g, b };
  }
  // #ffffff or #ffffffff (8-digit with alpha) or #fff0 (4-digit with alpha)
  if (/^[a-fA-F0-9]{4}$/.test(raw)) {
    const r = parseInt(raw[0]! + raw[0], 16);
    const g = parseInt(raw[1]! + raw[1], 16);
    const b = parseInt(raw[2]! + raw[2], 16);
    const a = (parseInt(raw[3]! + raw[3], 16) / 255) * 100;
    return { r, g, b, a };
  }
  const m6 = raw.match(/^([a-fA-F0-9]{6})$/);
  const m8 = raw.match(/^([a-fA-F0-9]{8})$/);
  if (m6) {
    const n = parseInt(m6[1]!, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }
  if (m8) {
    const n = parseInt(m8[1]!, 16);
    return {
      r: (n >> 24) & 255,
      g: (n >> 16) & 255,
      b: (n >> 8) & 255,
      a: ((n & 255) / 255) * 100,
    };
  }
  return null;
}

function rgbToHex(r: number, g: number, b: number, a?: number): string {
  const hex = "#" + [r, g, b].map((x) => Math.round(Math.max(0, Math.min(255, x))).toString(16).padStart(2, "0")).join("");
  if (a !== undefined && a < 100) {
    const aa = Math.round((a / 100) * 255).toString(16).padStart(2, "0");
    return hex + aa;
  }
  return hex;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      default:
        h = ((r - g) / d + 4) / 6;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) {
    r = c;
    g = x;
  } else if (h < 120) {
    r = x;
    g = c;
  } else if (h < 180) {
    g = c;
    b = x;
  } else if (h < 240) {
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

function parseRgb(input: string): { r: number; g: number; b: number } | null {
  const m = input.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i) ?? input.match(/^(\d+)\s*,?\s*(\d+)\s*,?\s*(\d+)$/);
  if (!m) return null;
  const r = parseInt(m[1], 10);
  const g = parseInt(m[2], 10);
  const b = parseInt(m[3], 10);
  if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) return null;
  return { r, g, b };
}

function parseRgba(input: string): { r: number; g: number; b: number; a: number } | null {
  const m = input.match(/rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)(%?)\s*\)/i);
  if (!m) return null;
  const r = parseInt(m[1], 10);
  const g = parseInt(m[2], 10);
  const b = parseInt(m[3], 10);
  let a = parseFloat(m[4]);
  if (m[5] === "%") a = a / 100;
  if (a < 0 || a > 1) return null;
  if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) return null;
  return { r, g, b, a: a * 100 };
}

function parseHsl(input: string): { h: number; s: number; l: number } | null {
  const m = input.match(/hsla?\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*\)/i) ?? input.match(/^(\d+)\s*,?\s*(\d+)\s*,?\s*(\d+)$/);
  if (!m) return null;
  const h = parseInt(m[1], 10);
  const s = parseInt(m[2], 10);
  const l = parseInt(m[3], 10);
  if (h < 0 || h > 360 || s < 0 || s > 100 || l < 0 || l > 100) return null;
  return { h, s, l };
}

function parseHsla(input: string): { h: number; s: number; l: number; a: number } | null {
  const m = input.match(/hsla\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*,\s*([\d.]+)(%?)\s*\)/i);
  if (!m) return null;
  const h = parseInt(m[1], 10);
  const s = parseInt(m[2], 10);
  const l = parseInt(m[3], 10);
  let a = parseFloat(m[4]);
  if (m[5] === "%") a = a / 100;
  if (a < 0 || a > 1) return null;
  if (h < 0 || h > 360 || s < 0 || s > 100 || l < 0 || l > 100) return null;
  return { h, s, l, a: a * 100 };
}

export function ColorConverterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<{ hex: string; rgb: string; rgba?: string; hsl: string; hsla?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = useCallback(() => {
    setError(null);
    setOutput(null);
    const trimmed = input.trim();
    if (!trimmed) {
      toast.error("Please enter a color");
      return;
    }
    let r: number, g: number, b: number;
    let alpha: number | undefined;
    const hex = hexToRgb(trimmed);
    if (hex) {
      r = hex.r;
      g = hex.g;
      b = hex.b;
      alpha = hex.a;
    } else {
      const rgba = parseRgba(trimmed);
      if (rgba) {
        r = rgba.r;
        g = rgba.g;
        b = rgba.b;
        alpha = rgba.a;
      } else {
        const rgb = parseRgb(trimmed);
        if (rgb) {
          r = rgb.r;
          g = rgb.g;
          b = rgb.b;
        } else {
          const hsla = parseHsla(trimmed);
          if (hsla) {
            const rgb2 = hslToRgb(hsla.h, hsla.s, hsla.l);
            r = rgb2.r;
            g = rgb2.g;
            b = rgb2.b;
            alpha = hsla.a;
          } else {
            const hsl = parseHsl(trimmed);
            if (hsl) {
              const rgb2 = hslToRgb(hsl.h, hsl.s, hsl.l);
              r = rgb2.r;
              g = rgb2.g;
              b = rgb2.b;
            } else {
              setError("Invalid color format. Use #fff, #ffffff, #ffffff03, rgb(), rgba(), hsl(), hsla().");
              toast.error("Invalid color format");
              return;
            }
          }
        }
      }
    }
    const hexOut = rgbToHex(r, g, b, alpha);
    const hsl = rgbToHsl(r, g, b);
    const hasAlpha = alpha !== undefined && alpha < 100;
    setOutput({
      hex: hexOut,
      rgb: `rgb(${r}, ${g}, ${b})`,
      ...(hasAlpha && { rgba: `rgba(${r}, ${g}, ${b}, ${(alpha / 100).toFixed(2)})` }),
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      ...(hasAlpha && { hsla: `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${(alpha! / 100).toFixed(2)})` }),
    });
  }, [input]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          Color (HEX, RGB, RGBA, HSL, HSLA)
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="#fff, #ffffff03, rgb(255,102,0), rgba(255,102,0,0.5), hsl(24,100%,50%)"
          className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 font-mono text-sm"
        />
      </div>
      <button
        onClick={handleConvert}
        className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium rounded-lg hover:bg-neutral-700 dark:hover:bg-neutral-200"
      >
        Convert
      </button>
      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}
      {output && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div
              className="w-16 h-16 rounded-lg border border-neutral-300 dark:border-neutral-600 shrink-0"
              style={{
              backgroundColor: output.rgba ?? output.hex,
            }}
              title={output.hex}
            />
            <div className="space-y-1">
              <p className="font-mono text-sm">
                <span className="text-neutral-500 dark:text-neutral-400">HEX:</span> {output.hex}
              </p>
              <p className="font-mono text-sm">
                <span className="text-neutral-500 dark:text-neutral-400">RGB:</span> {output.rgb}
              </p>
              {output.rgba && (
                <p className="font-mono text-sm">
                  <span className="text-neutral-500 dark:text-neutral-400">RGBA:</span> {output.rgba}
                </p>
              )}
              <p className="font-mono text-sm">
                <span className="text-neutral-500 dark:text-neutral-400">HSL:</span> {output.hsl}
              </p>
              {output.hsla && (
                <p className="font-mono text-sm">
                  <span className="text-neutral-500 dark:text-neutral-400">HSLA:</span> {output.hsla}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
