"use client";

import {
  Caveat,
  Dancing_Script,
  Great_Vibes,
  Handlee,
  Kalam,
  Patrick_Hand,
  Sacramento,
  Satisfy,
  Shadows_Into_Light,
} from "next/font/google";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import { useToolSettings } from "@/hooks/useToolSettings";
import {
  canvasToPngBlob,
  fillCanvasBackground,
  MAX_UNDO_STACK,
  renderTypedSignature,
  sanitizeSignatureFilename,
  setupCanvas,
  SIGNATURE_CANVAS_HEIGHT,
  SIGNATURE_CANVAS_WIDTH,
  SIGNATURE_FONTS,
  type SignatureBackground,
  type SignatureFontId,
} from "@/lib/signature";

const caveat = Caveat({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-signature-caveat",
  display: "swap",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-signature-dancing",
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-signature-great-vibes",
  display: "swap",
});

const handlee = Handlee({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-signature-handlee",
  display: "swap",
});

const kalam = Kalam({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-signature-kalam",
  display: "swap",
});

const patrickHand = Patrick_Hand({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-signature-patrick-hand",
  display: "swap",
});

const sacramento = Sacramento({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-signature-sacramento",
  display: "swap",
});

const satisfy = Satisfy({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-signature-satisfy",
  display: "swap",
});

const shadowsIntoLight = Shadows_Into_Light({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-signature-shadows-into-light",
  display: "swap",
});

const fontClassName = [
  caveat.variable,
  dancingScript.variable,
  handlee.variable,
  greatVibes.variable,
  kalam.variable,
  patrickHand.variable,
  sacramento.variable,
  satisfy.variable,
  shadowsIntoLight.variable,
]
  .filter(Boolean)
  .join(" ");
const signatureFontFamilies: Record<SignatureFontId, string> = {
  caveat: caveat.style.fontFamily,
  "dancing-script": dancingScript.style.fontFamily,
  handlee: handlee.style.fontFamily,
  "great-vibes": greatVibes.style.fontFamily,
  kalam: kalam.style.fontFamily,
  "patrick-hand": patrickHand.style.fontFamily,
  "sacramento": sacramento.style.fontFamily,
  satisfy: satisfy.style.fontFamily,
  "shadows-into-light": shadowsIntoLight.style.fontFamily,
};

function getCanvasFontFamily(fontFamily: string): string {
  return fontFamily
    .split(",")
    .map((family) => family.trim())
    .filter(Boolean)
    .map((family) => {
      if (/^["'].*["']$/.test(family)) return family;
      if (/^[a-z0-9_-]+$/i.test(family)) return family;
      return `"${family.replace(/"/g, '\\"')}"`;
    })
    .join(", ");
}

type SignatureMode = "draw" | "type";

const SIGNATURE_DEFAULTS = {
  mode: "draw" as SignatureMode,
  typedText: "",
  fontId: "caveat" as SignatureFontId,
  strokeColor: "#111827",
  strokeWidth: 2,
  background: "transparent" as SignatureBackground,
};

export function SignatureGeneratorTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const undoStackRef = useRef<ImageData[]>([]);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const [s, setS] = useToolSettings("main", SIGNATURE_DEFAULTS);
  const { mode, typedText, fontId, strokeColor, strokeWidth, background } = s;

  const [hasContent, setHasContent] = useState(false);
  const [canUndo, setCanUndo] = useState(false);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = setupCanvas(canvas);
    ctxRef.current = ctx;
    return ctx;
  }, []);

  useLayoutEffect(() => {
    const ctx = initCanvas();
    if (ctx) fillCanvasBackground(ctx, background);
    undoStackRef.current = [];
    setCanUndo(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- canvas init once; background applied via type render or clear
  }, [initCanvas]);

  const pushUndo = useCallback(() => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    undoStackRef.current.push(snapshot);
    if (undoStackRef.current.length > MAX_UNDO_STACK) {
      undoStackRef.current.shift();
    }
    setCanUndo(true);
  }, []);

  const renderTypeMode = useCallback(async () => {
    const ctx = ctxRef.current ?? initCanvas();
    if (!ctx) return;
    const canvasFontFamily = getCanvasFontFamily(signatureFontFamilies[fontId]);
    if (typeof document !== "undefined" && document.fonts) {
      await document.fonts.ready;
      const previewText = typedText.trim() || "Aa";
      const fontSize = Math.min(
        72,
        Math.max(32, Math.floor(SIGNATURE_CANVAS_WIDTH / (previewText.length * 0.55)))
      );
      await document.fonts.load(`${fontSize}px ${canvasFontFamily}`, previewText);
    }
    renderTypedSignature(ctx, {
      text: typedText,
      fontFamily: canvasFontFamily,
      strokeColor,
      background,
    });
    setHasContent(typedText.trim().length > 0);
    undoStackRef.current = [];
    setCanUndo(false);
  }, [typedText, fontId, strokeColor, background, initCanvas]);

  useEffect(() => {
    if (mode === "type") {
      void renderTypeMode();
    }
  }, [mode, renderTypeMode]);

  const getCanvasPoint = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((clientX - rect.left) / rect.width) * SIGNATURE_CANVAS_WIDTH,
        y: ((clientY - rect.top) / rect.height) * SIGNATURE_CANVAS_HEIGHT,
      };
    },
    []
  );

  const drawLine = useCallback(
    (from: { x: number; y: number }, to: { x: number; y: number }) => {
      const ctx = ctxRef.current;
      if (!ctx) return;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
    },
    [strokeColor, strokeWidth]
  );

  const handlePointerDown = useCallback(
    (clientX: number, clientY: number) => {
      if (mode !== "draw") return;
      const point = getCanvasPoint(clientX, clientY);
      if (!point) return;
      pushUndo();
      isDrawingRef.current = true;
      lastPointRef.current = point;
      setHasContent(true);
    },
    [mode, getCanvasPoint, pushUndo]
  );

  const handlePointerMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDrawingRef.current || mode !== "draw") return;
      const point = getCanvasPoint(clientX, clientY);
      const last = lastPointRef.current;
      if (!point || !last) return;
      drawLine(last, point);
      lastPointRef.current = point;
    },
    [mode, getCanvasPoint, drawLine]
  );

  const handlePointerUp = useCallback(() => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
  }, []);

  const handleClear = useCallback(() => {
    const ctx = ctxRef.current ?? initCanvas();
    if (!ctx) return;
    fillCanvasBackground(ctx, background);
    undoStackRef.current = [];
    setCanUndo(false);
    setHasContent(false);
  }, [background, initCanvas]);

  const handleUndo = useCallback(() => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    const stack = undoStackRef.current;
    if (!ctx || !canvas || stack.length === 0) return;
    const snapshot = stack.pop()!;
    ctx.putImageData(snapshot, 0, 0);
    setCanUndo(stack.length > 0);

    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let content = false;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] > 0) {
        content = true;
        break;
      }
    }
    setHasContent(content);
  }, []);

  const handleDownload = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasContent) {
      toast.error("Create a signature first");
      return;
    }
    const blob = await canvasToPngBlob(canvas);
    if (!blob) {
      toast.error("Failed to export PNG. Please try again.");
      return;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = sanitizeSignatureFilename(typedText);
    a.click();
    URL.revokeObjectURL(url);
  }, [hasContent, typedText]);

  const handleModeChange = useCallback(
    (next: SignatureMode) => {
      setS((p) => ({ ...p, mode: next }));
    },
    [setS]
  );

  return (
    <div className={`space-y-4 ${fontClassName}`}>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 rounded-lg border border-emerald-200/80 dark:border-emerald-900/50 bg-emerald-50/80 dark:bg-emerald-950/30 px-3 py-2">
        Your signature is created entirely in your browser. Nothing is uploaded
        to a server.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => handleModeChange("draw")}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            mode === "draw"
              ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
          }`}
        >
          Draw
        </button>
        <button
          type="button"
          onClick={() => handleModeChange("type")}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            mode === "type"
              ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
          }`}
        >
          Type
        </button>
      </div>

      {mode === "type" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="signature-text"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
            >
              Your name
            </label>
            <input
              id="signature-text"
              type="text"
              value={typedText}
              onChange={(e) =>
                setS((p) => ({ ...p, typedText: e.target.value }))
              }
              placeholder="Jane Doe"
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-sm focus:ring-2 focus:ring-neutral-400 outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="signature-font"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
            >
              Font
            </label>
            <select
              id="signature-font"
              value={fontId}
              onChange={(e) =>
                setS((p) => ({
                  ...p,
                  fontId: e.target.value as SignatureFontId,
                }))
              }
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-sm focus:ring-2 focus:ring-neutral-400 outline-none"
            >
              {SIGNATURE_FONTS.map((font) => (
                <option key={font.id} value={font.id}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <label
            htmlFor="signature-color"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
          >
            Ink color
          </label>
          <div className="flex items-center gap-2">
            <input
              id="signature-color"
              type="color"
              value={strokeColor}
              onChange={(e) =>
                setS((p) => ({ ...p, strokeColor: e.target.value }))
              }
              className="h-10 w-12 cursor-pointer rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900"
            />
            <input
              type="text"
              value={strokeColor}
              onChange={(e) =>
                setS((p) => ({ ...p, strokeColor: e.target.value }))
              }
              className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 font-mono text-sm focus:ring-2 focus:ring-neutral-400 outline-none"
            />
          </div>
        </div>
        {mode === "draw" && (
          <div>
            <label
              htmlFor="signature-width"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
            >
              Stroke width
            </label>
            <input
              id="signature-width"
              type="number"
              min={1}
              max={12}
              value={strokeWidth}
              onChange={(e) =>
                setS((p) => ({
                  ...p,
                  strokeWidth: Math.min(
                    12,
                    Math.max(1, parseInt(e.target.value, 10) || 2)
                  ),
                }))
              }
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 font-mono text-sm focus:ring-2 focus:ring-neutral-400 outline-none"
            />
          </div>
        )}
        <div>
          <label
            htmlFor="signature-background"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
          >
            Background
          </label>
          <select
            id="signature-background"
            value={background}
            onChange={(e) =>
              setS((p) => ({
                ...p,
                background: e.target.value as SignatureBackground,
              }))
            }
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-sm focus:ring-2 focus:ring-neutral-400 outline-none"
          >
            <option value="transparent">Transparent</option>
            <option value="white">White</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          Preview
        </label>
        <div
          className={`inline-block max-w-full rounded-lg border border-neutral-300 dark:border-neutral-600 overflow-hidden ${
            background === "transparent"
              ? "bg-[length:16px_16px] bg-[position:0_0,8px_8px] bg-[image:linear-gradient(45deg,#e5e7eb_25%,transparent_25%),linear-gradient(-45deg,#e5e7eb_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#e5e7eb_75%),linear-gradient(-45deg,transparent_75%,#e5e7eb_75%)] dark:bg-[image:linear-gradient(45deg,#374151_25%,transparent_25%),linear-gradient(-45deg,#374151_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#374151_75%),linear-gradient(-45deg,transparent_75%,#374151_75%)]"
              : "bg-white"
          }`}
        >
          <canvas
            ref={canvasRef}
            className={`block max-w-full h-auto ${
              mode === "draw" ? "cursor-crosshair touch-none" : "pointer-events-none"
            }`}
            onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
            onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            onTouchStart={(e) => {
              e.preventDefault();
              const touch = e.touches[0];
              if (touch) handlePointerDown(touch.clientX, touch.clientY);
            }}
            onTouchMove={(e) => {
              e.preventDefault();
              const touch = e.touches[0];
              if (touch) handlePointerMove(touch.clientX, touch.clientY);
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              handlePointerUp();
            }}
          />
        </div>
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          {mode === "draw"
            ? "Draw with mouse or touch. Use undo to step back."
            : "Type your name above—the preview updates automatically."}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleDownload}
          className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium rounded-lg hover:bg-neutral-700 dark:hover:bg-neutral-200"
        >
          Download PNG
        </button>
        {mode === "draw" && (
          <button
            type="button"
            onClick={handleUndo}
            disabled={!canUndo}
            className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Undo
          </button>
        )}
        <button
          type="button"
          onClick={handleClear}
          className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
