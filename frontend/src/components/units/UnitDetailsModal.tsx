"use client";

import { Building2, X } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/hooks/useTranslation";
import type { Unit } from "@/types/unit";

type UnitDetailsModalProps = {
  unit: Unit | null;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
};

export function UnitDetailsModal({ unit, isLoading, error, onClose }: UnitDetailsModalProps) {
  const { isArabic } = useTranslation();

  if (!unit && !isLoading && !error) return null;

  const labels = isArabic ? { title: "تفاصيل الوحدة", close: "إغلاق", project: "المشروع", number: "رقم الوحدة", type: "النوع", status: "الحالة", price: "سعر البيع", area: "المساحة", floor: "الطابق", bedrooms: "غرف النوم", bathrooms: "دورات المياه", notes: "ملاحظات", archived: "مؤرشفة", available: "متاحة", sold: "مباعة", loading: "جارٍ تحميل التفاصيل...", failed: "تعذر تحميل تفاصيل الوحدة." } : { title: "Unit details", close: "Close", project: "Project", number: "Unit number", type: "Type", status: "Status", price: "Selling price", area: "Area", floor: "Floor", bedrooms: "Bedrooms", bathrooms: "Bathrooms", notes: "Notes", archived: "Archived", available: "Available", sold: "Sold", loading: "Loading details...", failed: "Unable to load unit details." };

  const typeLabel = unit ? ({ apartment: isArabic ? "شقة" : "Apartment", villa: isArabic ? "فيلا" : "Villa", office: isArabic ? "مكتب" : "Office", shop: isArabic ? "محل" : "Shop", land: isArabic ? "أرض" : "Land", other: isArabic ? "أخرى" : "Other" }[unit.unit_type]) : "";

  return <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6"><button type="button" onClick={onClose} aria-label={labels.close} className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]" /><div className="relative w-full max-w-2xl rounded-[26px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-lg)]"><header className="flex items-start justify-between gap-4 border-b border-[var(--border)] px-5 py-5 sm:px-7"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand-gold-soft)] text-[var(--brand-gold-strong)]"><Building2 size={21} /></span><h2 className="text-lg font-bold text-[var(--text-primary)]">{labels.title}</h2></div><button type="button" onClick={onClose} aria-label={labels.close} className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--text-muted)] hover:bg-[var(--surface-muted)]"><X size={19} /></button></header><div className="p-5 sm:p-7">{isLoading ? <p className="py-12 text-center text-sm text-[var(--text-secondary)]">{labels.loading}</p> : error || !unit ? <p className="py-12 text-center text-sm font-semibold text-[var(--danger)]">{error ?? labels.failed}</p> : <><div className="mb-5 flex items-center justify-between gap-3"><div><p className="text-xl font-bold text-[var(--text-primary)]">{unit.unit_number}</p><p className="mt-1 text-sm text-[var(--text-secondary)]">{unit.project?.name ?? unit.project_id}</p></div><div className="flex gap-2"><span className="rounded-full bg-[var(--success-soft)] px-3 py-1 text-xs font-bold text-[var(--success)]">{unit.status === "available" ? labels.available : labels.sold}</span>{unit.archived_at ? <span className="rounded-full bg-[var(--surface-muted)] px-3 py-1 text-xs font-bold text-[var(--text-secondary)]">{labels.archived}</span> : null}</div></div><dl className="grid gap-4 sm:grid-cols-2">{[[labels.project, unit.project ? `${unit.project.project_number} — ${unit.project.name}` : unit.project_id], [labels.number, unit.unit_number], [labels.type, typeLabel], [labels.status, unit.status === "available" ? labels.available : labels.sold], [labels.price, `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(Number(unit.selling_price))} ${unit.project?.currency ?? ""}`], [labels.area, unit.area ?? "—"], [labels.floor, unit.floor ?? "—"], [labels.bedrooms, unit.bedrooms ?? "—"], [labels.bathrooms, unit.bathrooms ?? "—"]].map(([label, value]) => <div key={label as string} className="rounded-xl bg-[var(--surface-soft)] p-4"><dt className="text-xs font-semibold text-[var(--text-secondary)]">{label}</dt><dd className="mt-1 text-sm font-bold text-[var(--text-primary)]">{value}</dd></div>)}</dl><div className="mt-4 rounded-xl bg-[var(--surface-soft)] p-4"><p className="text-xs font-semibold text-[var(--text-secondary)]">{labels.notes}</p><p className="mt-1 whitespace-pre-wrap text-sm text-[var(--text-primary)]">{unit.notes || "—"}</p></div></>}</div><footer className="flex justify-end border-t border-[var(--border)] px-5 py-4 sm:px-7"><Button type="button" variant="secondary" onClick={onClose}>{labels.close}</Button></footer></div></div>;
}
