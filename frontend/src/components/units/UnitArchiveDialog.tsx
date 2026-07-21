"use client";

import { Archive, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/Button";
import type { Unit } from "@/types/unit";

type UnitArchiveDialogProps = { unit: Unit | null; action: "archive" | "restore"; isProcessing: boolean; error: string | null; onCancel: () => void; onConfirm: () => Promise<void> };

export function UnitArchiveDialog({ unit, action, isProcessing, error, onCancel, onConfirm }: UnitArchiveDialogProps) {
  if (!unit) return null;
  const isArchive = action === "archive";
  const Icon = isArchive ? Archive : RotateCcw;
  const title = isArchive ? "أرشفة الوحدة" : "استعادة الوحدة";
  const description = isArchive ? `سيتم أرشفة الوحدة ${unit.unit_number}.` : `سيتم استعادة الوحدة ${unit.unit_number}.`;
  return <div className="fixed inset-0 z-[80] flex items-center justify-center p-4"><button type="button" onClick={onCancel} className="absolute inset-0 bg-slate-950/55" aria-label="إغلاق" /><div className="relative w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-lg)]"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-gold-soft)] text-[var(--brand-gold-strong)]"><Icon size={21} /></span><h2 className="mt-4 text-lg font-bold text-[var(--text-primary)]">{title}</h2><p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{description}</p>{error ? <p className="mt-4 rounded-xl border border-[var(--danger)]/25 bg-[var(--danger-soft)] px-4 py-3 text-sm font-semibold text-[var(--danger)]">{error}</p> : null}<div className="mt-6 flex justify-end gap-3"><Button type="button" variant="secondary" onClick={onCancel} disabled={isProcessing}>إلغاء</Button><Button type="button" onClick={() => void onConfirm()} disabled={isProcessing} className="!bg-[var(--brand-gold)] !text-white">{isProcessing ? "جارٍ التنفيذ..." : isArchive ? "أرشفة" : "استعادة"}</Button></div></div></div>;
}
