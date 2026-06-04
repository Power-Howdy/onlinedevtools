"use client";

import { useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { useToolSettings } from "@/hooks/useToolSettings";
import {
  computeInvoiceTotals,
  DEFAULT_INVOICE_DATA,
  formatDisplayDate,
  formatMoney,
  generateInvoicePdf,
  INVOICE_CURRENCIES,
  sanitizeFilename,
  validateInvoice,
  type InvoiceData,
  type LineItem,
} from "@/lib/pdf-invoice";

const inputClass =
  "w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-sm focus:ring-2 focus:ring-neutral-400 outline-none";
const labelClass =
  "block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1";

function FieldGroup({
  title,
  party,
  onChange,
  prefix,
}: {
  title: string;
  party: InvoiceData["seller"];
  onChange: (party: InvoiceData["seller"]) => void;
  prefix: string;
}) {
  return (
    <fieldset className="space-y-3 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4">
      <legend className="px-1 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
        {title}
      </legend>
      <div>
        <label htmlFor={`${prefix}-name`} className={labelClass}>
          Name
        </label>
        <input
          id={`${prefix}-name`}
          type="text"
          value={party.name}
          onChange={(e) => onChange({ ...party, name: e.target.value })}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor={`${prefix}-email`} className={labelClass}>
          Email
        </label>
        <input
          id={`${prefix}-email`}
          type="email"
          value={party.email}
          onChange={(e) => onChange({ ...party, email: e.target.value })}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor={`${prefix}-address`} className={labelClass}>
          Address
        </label>
        <textarea
          id={`${prefix}-address`}
          value={party.address}
          onChange={(e) => onChange({ ...party, address: e.target.value })}
          rows={3}
          className={`${inputClass} resize-y`}
        />
      </div>
    </fieldset>
  );
}

function InvoicePreview({ data }: { data: InvoiceData }) {
  const totals = useMemo(() => computeInvoiceTotals(data), [data]);
  const visibleItems = data.lineItems.filter((item) => item.description.trim());
  const taxPct = Math.round(data.taxRate * 100) / 100;

  return (
    <div
      className="rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-white p-8 text-[13px] text-neutral-900 shadow-sm min-h-[320px] max-w-3xl mx-auto"
      style={{ fontFamily: "Helvetica, Arial, sans-serif", minHeight: "1020px" }}
    >
      <div className="flex justify-between items-start gap-6 mb-8">
        <div className="min-w-0">
          <div className="font-bold text-[13px]">{data.seller.name || "—"}</div>
          {data.seller.email && (
            <div className="text-neutral-700 mt-1 text-[13px]">{data.seller.email}</div>
          )}
          {data.seller.address && (
            <pre className="mt-1 whitespace-pre-wrap font-sans text-neutral-700 text-[13px] leading-relaxed">
              {data.seller.address}
            </pre>
          )}
        </div>
        <div className="text-right shrink-0">
          <div className="text-[28px] font-normal tracking-tight leading-none">
            INVOICE
          </div>
          <div className="text-[12px] mt-2"># {data.invoiceNumber || "—"}</div>
        </div>
      </div>

      <div className="flex justify-between gap-8 mb-6">
        <div>
          <div className="text-[13px] mb-1">Bill To:</div>
          <div className="font-bold text-[13px]">{data.buyer.name || "—"}</div>
          {data.buyer.email && (
            <div className="text-neutral-700 mt-1 text-[13px]">{data.buyer.email}</div>
          )}
          {data.buyer.address && (
            <pre className="mt-1 whitespace-pre-wrap font-sans text-neutral-700 text-[13px] leading-relaxed">
              {data.buyer.address}
            </pre>
          )}
        </div>
        <div className="text-[13px] space-y-2 shrink-0 min-w-[200px]">
          <div className="flex justify-between gap-6">
            <span>Date:</span>
            <span>{formatDisplayDate(data.issueDate)}</span>
          </div>
          <div className="flex justify-between gap-6">
            <span>Due Date:</span>
            <span>{formatDisplayDate(data.dueDate)}</span>
          </div>
          <div className="flex justify-between gap-6">
            <span>PO Number:</span>
            <span>{data.invoiceNumber || "—"}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center bg-neutral-100 px-4 py-3 mb-6 text-[13px] font-bold">
        <span>Balance Due:</span>
        <span className="tabular-nums">{formatMoney(totals.total, data.currency)}</span>
      </div>

      <div className="overflow-x-auto mb-6">
        <table className="w-full text-[13px] border-collapse">
          <thead>
            <tr className="bg-[#3a3a3a] text-white">
              <th className="text-left py-2.5 px-3 font-normal w-[55%]">Item</th>
              <th className="text-right py-2.5 px-3 font-normal">Quantity</th>
              <th className="text-right py-2.5 px-3 font-normal">Rate</th>
              <th className="text-right py-2.5 px-3 font-normal">Amount</th>
            </tr>
          </thead>
          <tbody>
            {visibleItems.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-4 px-3 text-center text-neutral-500">
                  Add line items to preview
                </td>
              </tr>
            ) : (
              visibleItems.map((item) => {
                const qty = Number(item.quantity) || 0;
                const rate = Number(item.unitPrice) || 0;
                const amount = qty * rate;
                return (
                  <tr key={item.id}>
                    <td className="py-2.5 px-3 font-bold align-top">
                      {item.description}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums align-top">
                      {qty}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums align-top">
                      {formatMoney(rate, data.currency)}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums align-top">
                      {formatMoney(amount, data.currency)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="space-y-2 text-[13px] ml-auto max-w-xs">
        <div className="flex justify-between gap-8 tabular-nums">
          <span>Subtotal:</span>
          <span>{formatMoney(totals.subtotal, data.currency)}</span>
        </div>
        <div className="flex justify-between gap-8 tabular-nums">
          <span>Tax ({taxPct}%):</span>
          <span>{formatMoney(totals.tax, data.currency)}</span>
        </div>
        <div className="flex justify-between gap-8 tabular-nums">
          <span>Total:</span>
          <span>{formatMoney(totals.total, data.currency)}</span>
        </div>
      </div>

      {data.notes.trim() && (
        <div className="pt-6 mt-6 border-t border-neutral-200">
          <div className="font-bold text-[13px] mb-1">Notes</div>
          <p className="text-[13px] text-neutral-700 whitespace-pre-wrap leading-relaxed">
            {data.notes}
          </p>
        </div>
      )}
    </div>
  );
}

export function PdfInvoiceGeneratorTool() {
  const [data, setData] = useToolSettings("main", DEFAULT_INVOICE_DATA);

  const updateLineItem = useCallback(
    (id: string, patch: Partial<Omit<LineItem, "id">>) => {
      setData((prev) => ({
        ...prev,
        lineItems: prev.lineItems.map((item) =>
          item.id === id ? { ...item, ...patch } : item
        ),
      }));
    },
    [setData]
  );

  const addLineItem = useCallback(() => {
    setData((prev) => ({
      ...prev,
      lineItems: [
        ...prev.lineItems,
        {
          id: crypto.randomUUID(),
          description: "",
          quantity: 1,
          unitPrice: 0,
        },
      ],
    }));
  }, [setData]);

  const removeLineItem = useCallback(
    (id: string) => {
      setData((prev) => {
        if (prev.lineItems.length <= 1) return prev;
        return {
          ...prev,
          lineItems: prev.lineItems.filter((item) => item.id !== id),
        };
      });
    },
    [setData]
  );

  const handleDownload = useCallback(() => {
    const validation = validateInvoice(data);
    if (!validation.ok) {
      toast.error(validation.message);
      return;
    }
    try {
      const blob = generateInvoicePdf(data);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${sanitizeFilename(data.invoiceNumber)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Failed to generate PDF. Please try again.");
    }
  }, [data]);

  const handleReset = useCallback(() => {
    setData({
      ...DEFAULT_INVOICE_DATA,
      lineItems: DEFAULT_INVOICE_DATA.lineItems.map((item) => ({
        ...item,
        id: crypto.randomUUID(),
      })),
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: (() => {
        const d = new Date();
        d.setDate(d.getDate() + 30);
        return d.toISOString().slice(0, 10);
      })(),
    });
  }, [setData]);

  const buttons = <div className="flex flex-wrap gap-3">
  <button
    type="button"
    onClick={handleDownload}
    className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium rounded-lg hover:bg-neutral-700 dark:hover:bg-neutral-200"
  >
    Download PDF
  </button>
  <button
    type="button"
    onClick={handleReset}
    className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700"
  >
    Reset to sample
  </button>
</div>

  return (
    <div className="space-y-4">
      <p className="text-sm text-neutral-600 dark:text-neutral-400 rounded-lg border border-emerald-200/80 dark:border-emerald-900/50 bg-emerald-50/80 dark:bg-emerald-950/30 px-3 py-2">
        All invoice data is processed in your browser. Nothing is uploaded to a
        server. Form fields are saved locally on this device only.
      </p>

      { buttons }

      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <FieldGroup
            title="From (seller)"
            party={data.seller}
            prefix="seller"
            onChange={(seller) => setData((p) => ({ ...p, seller }))}
          />
          <FieldGroup
            title="Bill to (buyer)"
            party={data.buyer}
            prefix="buyer"
            onChange={(buyer) => setData((p) => ({ ...p, buyer }))}
          />
        </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="invoice-number" className={labelClass}>
                Invoice / PO number
              </label>
              <input
                id="invoice-number"
                type="text"
                value={data.invoiceNumber}
                onChange={(e) =>
                  setData((p) => ({ ...p, invoiceNumber: e.target.value }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="issue-date" className={labelClass}>
                Issue date
              </label>
              <input
                id="issue-date"
                type="date"
                value={data.issueDate}
                onChange={(e) =>
                  setData((p) => ({ ...p, issueDate: e.target.value }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="due-date" className={labelClass}>
                Due date
              </label>
              <input
                id="due-date"
                type="date"
                value={data.dueDate}
                onChange={(e) =>
                  setData((p) => ({ ...p, dueDate: e.target.value }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="currency" className={labelClass}>
                Currency
              </label>
              <select
                id="currency"
                value={data.currency}
                onChange={(e) =>
                  setData((p) => ({ ...p, currency: e.target.value }))
                }
                className={inputClass}
              >
                {INVOICE_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="tax-rate" className={labelClass}>
                Tax rate (%)
              </label>
              <input
                id="tax-rate"
                type="number"
                min={0}
                max={100}
                step={0.01}
                value={data.taxRate}
                onChange={(e) =>
                  setData((p) => ({
                    ...p,
                    taxRate: parseFloat(e.target.value) || 0,
                  }))
                }
                className={inputClass}
              />
            </div>
          </div>

          <fieldset className="space-y-3 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4">
            <legend className="px-1 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              Line items
            </legend>
            <div className="space-y-3">
              {data.lineItems.map((item, index) => (
                <div
                  key={item.id}
                  className="space-y-2 rounded-lg border border-neutral-100 dark:border-neutral-800 p-3 bg-neutral-50/50 dark:bg-neutral-900/30"
                >
                  <div>
                    <label
                      htmlFor={`line-desc-${item.id}`}
                      className={labelClass}
                    >
                      Description
                    </label>
                    <textarea
                      id={`line-desc-${item.id}`}
                      value={item.description}
                      onChange={(e) =>
                        updateLineItem(item.id, { description: e.target.value })
                      }
                      placeholder="Service or product"
                      rows={2}
                      className={`${inputClass} resize-y`}
                    />
                  </div>
                  <div className="flex flex-wrap items-end gap-2">
                    <div className="w-20 min-w-[4rem]">
                      <label
                        htmlFor={`line-qty-${item.id}`}
                        className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1 block"
                      >
                        Qty
                      </label>
                      <input
                        id={`line-qty-${item.id}`}
                        type="number"
                        min={0}
                        step={1}
                        value={item.quantity}
                        onChange={(e) =>
                          updateLineItem(item.id, {
                            quantity: parseFloat(e.target.value) || 0,
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div className="w-28 min-w-[6rem]">
                      <label
                        htmlFor={`line-rate-${item.id}`}
                        className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1 block"
                      >
                        Rate
                      </label>
                      <input
                        id={`line-rate-${item.id}`}
                        type="number"
                        min={0}
                        step={0.01}
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateLineItem(item.id, {
                            unitPrice: parseFloat(e.target.value) || 0,
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLineItem(item.id)}
                      disabled={data.lineItems.length <= 1}
                      aria-label={`Remove line item ${index + 1}`}
                      className="px-3 py-2 text-sm font-medium rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:pointer-events-none"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addLineItem}
              className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:underline"
            >
              + Add line item
            </button>
          </fieldset>

          <div>
            <label htmlFor="notes" className={labelClass}>
              Notes / payment terms
            </label>
            <textarea
              id="notes"
              value={data.notes}
              onChange={(e) => setData((p) => ({ ...p, notes: e.target.value }))}
              rows={3}
              className={`${inputClass} resize-y`}
            />
          </div>
      </div>

      <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700">
        <label className={labelClass}>Preview</label>
        <InvoicePreview data={data} />
      </div>
      <hr/>
      { buttons }
    </div>
  );
}
