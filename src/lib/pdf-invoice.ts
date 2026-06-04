import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

type JsPdfWithAutoTable = jsPDF & {
  lastAutoTable?: { finalY: number };
};

/** US Letter layout (612×792 pt), matching reference invoice typography. */
const PAGE_W = 612;
const MARGIN_L = 48;
const MARGIN_R = 564;
const TABLE_MARGIN = 29.25;

const FONT_REGULAR = "helvetica";

const SIZE_BODY = 9.8;
const SIZE_INVOICE_TITLE = 27.8;
const SIZE_INVOICE_NUM = 12;
const SIZE_BALANCE = 11.2;

const COLOR_HEADER_BG: [number, number, number] = [58, 58, 58];
const COLOR_HEADER_TEXT: [number, number, number] = [255, 255, 255];
const COLOR_BALANCE_BG: [number, number, number] = [245, 245, 245];

export type LineItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
};

export type InvoiceParty = {
  name: string;
  email: string;
  address: string;
};

export type InvoiceData = {
  seller: InvoiceParty;
  buyer: InvoiceParty;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  taxRate: number;
  lineItems: LineItem[];
  notes: string;
};

export type InvoiceTotals = {
  lineAmounts: number[];
  subtotal: number;
  tax: number;
  total: number;
};

export const INVOICE_CURRENCIES = [
  { code: "USD", label: "USD – US Dollar" },
  { code: "EUR", label: "EUR – Euro" },
  { code: "GBP", label: "GBP – British Pound" },
  { code: "CAD", label: "CAD – Canadian Dollar" },
  { code: "AUD", label: "AUD – Australian Dollar" },
  { code: "JPY", label: "JPY – Japanese Yen" },
  { code: "CHF", label: "CHF – Swiss Franc" },
  { code: "INR", label: "INR – Indian Rupee" },
] as const;

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function dueDateIso(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
}

function newLineItem(
  description: string,
  quantity: number,
  unitPrice: number
): LineItem {
  return {
    id: crypto.randomUUID(),
    description,
    quantity,
    unitPrice,
  };
}

export const DEFAULT_INVOICE_DATA: InvoiceData = {
  seller: {
    name: "ACME Corporation",
    email: "acme@example.com",
    address: "123 Main St, Anytown, USA",
  },
  buyer: {
    name: "John Doe",
    email: "john.doe@example.com",
    address: "456 Oak Ave, Othertown, USA",
  },
  invoiceNumber: "INV-2026-0001",
  issueDate: todayIso(),
  dueDate: dueDateIso(3),
  currency: "USD",
  taxRate: 0,
  lineItems: [
    newLineItem("Software development service", 100, 35),
  ],
  notes: "Thank you for your business!",
};

export function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: currency === "JPY" ? 0 : 2,
      maximumFractionDigits: currency === "JPY" ? 0 : 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export function formatDisplayDate(isoDate: string): string {
  if (!isoDate) return "—";
  const d = new Date(isoDate + "T00:00:00");
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function computeInvoiceTotals(data: InvoiceData): InvoiceTotals {
  const lineAmounts = data.lineItems.map(
    (item) => (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)
  );
  const subtotal = lineAmounts.reduce((sum, n) => sum + n, 0);
  const taxRate = Math.max(0, Number(data.taxRate) || 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;
  return { lineAmounts, subtotal, tax, total };
}

export type InvoiceValidationResult =
  | { ok: true }
  | { ok: false; message: string };

export function validateInvoice(data: InvoiceData): InvoiceValidationResult {
  if (!data.seller.name.trim()) {
    return { ok: false, message: "Seller name is required" };
  }
  if (!data.buyer.name.trim()) {
    return { ok: false, message: "Buyer name is required" };
  }
  if (!data.invoiceNumber.trim()) {
    return { ok: false, message: "Invoice number is required" };
  }
  const hasLine = data.lineItems.some((item) => item.description.trim());
  if (!hasLine) {
    return { ok: false, message: "Add at least one line item with a description" };
  }
  return { ok: true };
}

function setFont(
  doc: jsPDF,
  style: "normal" | "bold",
  size: number
): void {
  doc.setFont(FONT_REGULAR, style);
  doc.setFontSize(size);
}

function drawPartyExtras(
  doc: jsPDF,
  party: InvoiceParty,
  x: number,
  startY: number,
  maxWidth: number
): number {
  let y = startY;
  setFont(doc, "normal", SIZE_BODY);
  if (party.email.trim()) {
    doc.text(party.email.trim(), x, y);
    y += 12;
  }
  if (party.address.trim()) {
    const lines = doc.splitTextToSize(party.address.trim(), maxWidth) as string[];
    for (const line of lines) {
      doc.text(line, x, y);
      y += 12;
    }
  }
  return y;
}

function drawMetaRow(
  doc: jsPDF,
  label: string,
  value: string,
  y: number,
  labelX: number
): void {
  setFont(doc, "normal", SIZE_BODY);
  doc.text(label, labelX, y);
  doc.text(value, MARGIN_R, y, { align: "right" });
}

function drawTotalsRows(
  doc: jsPDF,
  y: number,
  totals: InvoiceTotals,
  taxRate: number,
  currency: string
): number {
  const labelX = 438;
  const amountX = MARGIN_R;

  setFont(doc, "normal", SIZE_BODY);
  doc.text("Subtotal:", labelX, y);
  doc.text(formatMoney(totals.subtotal, currency), amountX, y, { align: "right" });
  y += 14;

  const taxPct = Math.round(taxRate * 100) / 100;
  doc.text(`Tax (${taxPct}%):`, labelX - 18, y);
  doc.text(formatMoney(totals.tax, currency), amountX, y, { align: "right" });
  y += 14;

  doc.text("Total:", labelX, y);
  doc.text(formatMoney(totals.total, currency), amountX, y, { align: "right" });
  return y + 8;
}

export function generateInvoicePdf(data: InvoiceData): Blob {
  const totals = computeInvoiceTotals(data);
  const doc = new jsPDF({ unit: "pt", format: "letter" });

  // Seller (top left, bold)
  setFont(doc, "bold", SIZE_BODY);
  doc.text(data.seller.name.trim() || "—", MARGIN_L, 30);
  drawPartyExtras(doc, data.seller, MARGIN_L, 42, 280);

  // INVOICE title + number (top right)
  setFont(doc, "normal", SIZE_INVOICE_TITLE);
  doc.text("INVOICE", MARGIN_R, 35, { align: "right" });
  setFont(doc, "normal", SIZE_INVOICE_NUM);
  doc.text(`# ${data.invoiceNumber.trim()}`, MARGIN_R, 62, { align: "right" });

  // Date / Due / PO (right column)
  drawMetaRow(doc, "Date:", formatDisplayDate(data.issueDate), 118, 440);
  drawMetaRow(doc, "Due Date:", formatDisplayDate(data.dueDate), 140, 418);
  drawMetaRow(doc, "PO Number:", data.invoiceNumber.trim(), 162, 408);

  // Bill to (left)
  setFont(doc, "normal", SIZE_BODY);
  doc.text("Bill To:", MARGIN_L, 130);
  setFont(doc, "bold", SIZE_BODY);
  doc.text(data.buyer.name.trim() || "—", MARGIN_L, 145);
  drawPartyExtras(doc, data.buyer, MARGIN_L, 157, 280);

  // Balance Due band
  doc.setFillColor(...COLOR_BALANCE_BG);
  doc.rect(317.25, 170.25, 586.5 - 317.25, 195.75 - 170.25, "F");
  setFont(doc, "bold", SIZE_BALANCE);
  doc.setTextColor(0, 0, 0);
  doc.text("Balance Due:", 392.2, 182);
  doc.text(formatMoney(totals.total, data.currency), MARGIN_R, 182, {
    align: "right",
  });

  const tableBody = data.lineItems
    .filter((item) => item.description.trim())
    .map((item) => {
      const qty = Number(item.quantity) || 0;
      const rate = Number(item.unitPrice) || 0;
      const amount = qty * rate;
      return [
        item.description.trim(),
        String(qty),
        formatMoney(rate, data.currency),
        formatMoney(amount, data.currency),
      ];
    });

  autoTable(doc, {
    startY: 230.25,
    head: [["Item", "Quantity", "Rate", "Amount"]],
    body: tableBody,
    theme: "plain",
    margin: { left: TABLE_MARGIN, right: TABLE_MARGIN },
    tableWidth: PAGE_W - TABLE_MARGIN * 2,
    styles: {
      font: FONT_REGULAR,
      fontSize: SIZE_BODY,
      cellPadding: { top: 8, right: 6, bottom: 8, left: 6 },
      textColor: [0, 0, 0],
      lineWidth: 0,
    },
    headStyles: {
      font: FONT_REGULAR,
      fontStyle: "normal",
      fontSize: SIZE_BODY,
      fillColor: COLOR_HEADER_BG,
      textColor: COLOR_HEADER_TEXT,
      halign: "left",
    },
    bodyStyles: {
      fontStyle: "normal",
    },
    columnStyles: {
      0: { cellWidth: 328.5, fontStyle: "bold", halign: "left" },
      1: { cellWidth: 75, halign: "right" },
      2: { cellWidth: 75, halign: "right" },
      3: { cellWidth: 75, halign: "right" },
    },
    didParseCell: (hook) => {
      if (hook.section === "body" && hook.column.index === 0) {
        hook.cell.styles.fontStyle = "bold";
      }
    },
  });

  const docWithTable = doc as JsPdfWithAutoTable;
  let y = (docWithTable.lastAutoTable?.finalY ?? 260) + 28;
  y = drawTotalsRows(doc, y, totals, data.taxRate, data.currency);

  if (data.notes.trim()) {
    y += 16;
    setFont(doc, "bold", SIZE_BODY);
    doc.text("Notes", MARGIN_L, y);
    y += 12;
    setFont(doc, "normal", SIZE_BODY);
    const noteLines = doc.splitTextToSize(
      data.notes.trim(),
      PAGE_W - MARGIN_L * 2
    ) as string[];
    for (const line of noteLines) {
      if (y > doc.internal.pageSize.getHeight() - 48) {
        doc.addPage();
        y = 48;
      }
      doc.text(line, MARGIN_L, y);
      y += 12;
    }
  }

  return doc.output("blob");
}

export function sanitizeFilename(invoiceNumber: string): string {
  return invoiceNumber.trim().replace(/[^\w.-]+/g, "_") || "invoice";
}
