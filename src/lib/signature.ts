export type SignatureBackground = "transparent" | "white";

export const SIGNATURE_FONT_IDS = [
  "caveat",
  "dancing-script",
  "handlee",
  "great-vibes",
  "kalam",
  "patrick-hand",
  "sacramento",
  "satisfy",
  "shadows-into-light",
] as const;

export type SignatureFontId = (typeof SIGNATURE_FONT_IDS)[number];

export const SIGNATURE_FONTS: {
  id: SignatureFontId;
  label: string;
  cssFamily: string;
}[] = [
  {
    id: "caveat",
    label: "Caveat",
    cssFamily: "var(--font-signature-caveat), cursive",
  },
  {
    id: "dancing-script",
    label: "Dancing Script",
    cssFamily: "var(--font-signature-dancing), cursive",
  },
  {
    id: "handlee",
    label: "Handlee",
    cssFamily: "var(--font-signature-handlee), cursive",
  },
  {
    id: "great-vibes",
    label: "Great Vibes",
    cssFamily: "var(--font-signature-great-vibes), cursive",
  },
  {
    id: "kalam",
    label: "Kalam",
    cssFamily: "var(--font-signature-kalam), cursive",
  },
  {
    id: "patrick-hand",
    label: "Patrick Hand",
    cssFamily: "var(--font-signature-patrick-hand), cursive",
  },
  {
    id: "sacramento",
    label: "Sacramento",
    cssFamily: "var(--font-signature-sacramento), cursive",
  },
  {
    id: "satisfy",
    label: "Satisfy",
    cssFamily: "var(--font-signature-satisfy), cursive",
  },
  {
    id: "shadows-into-light",
    label: "Shadows Into Light",
    cssFamily: "var(--font-signature-shadows-into-light), cursive",
  },
];

export const SIGNATURE_CANVAS_WIDTH = 600;
export const SIGNATURE_CANVAS_HEIGHT = 200;
export const MAX_UNDO_STACK = 20;

export function setupCanvas(
  canvas: HTMLCanvasElement,
  width = SIGNATURE_CANVAS_WIDTH,
  height = SIGNATURE_CANVAS_HEIGHT
): CanvasRenderingContext2D {
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

export function fillCanvasBackground(
  ctx: CanvasRenderingContext2D,
  background: SignatureBackground,
  width = SIGNATURE_CANVAS_WIDTH,
  height = SIGNATURE_CANVAS_HEIGHT
): void {
  ctx.clearRect(0, 0, width, height);
  if (background === "white") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
  }
}

export function renderTypedSignature(
  ctx: CanvasRenderingContext2D,
  options: {
    text: string;
    fontFamily: string;
    strokeColor: string;
    background: SignatureBackground;
    width?: number;
    height?: number;
  }
): void {
  const width = options.width ?? SIGNATURE_CANVAS_WIDTH;
  const height = options.height ?? SIGNATURE_CANVAS_HEIGHT;
  fillCanvasBackground(ctx, options.background, width, height);

  const trimmed = options.text.trim();
  if (!trimmed) return;

  const fontSize = Math.min(72, Math.max(32, Math.floor(width / (trimmed.length * 0.55))));
  ctx.fillStyle = options.strokeColor;
  ctx.font = `${fontSize}px ${options.fontFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(trimmed, width / 2, height / 2);
}

export function canvasHasContent(
  ctx: CanvasRenderingContext2D,
  width = SIGNATURE_CANVAS_WIDTH,
  height = SIGNATURE_CANVAS_HEIGHT
): boolean {
  const { data } = ctx.getImageData(0, 0, width, height);
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] > 0) return true;
  }
  return false;
}

export function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

export function sanitizeSignatureFilename(text: string): string {
  const base = text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return base ? `signature-${base}.png` : "signature.png";
}

export function getFontCssFamily(fontId: SignatureFontId): string {
  return SIGNATURE_FONTS.find((f) => f.id === fontId)?.cssFamily ?? SIGNATURE_FONTS[0].cssFamily;
}
