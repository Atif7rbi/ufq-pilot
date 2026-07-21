"use client";

import { Building2, X } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/Button";
import { FormErrorBanner } from "@/components/ui/FormErrorBanner";
import { Input } from "@/components/ui/Input";
import { useFormValidation } from "@/hooks/useFormValidation";
import { useTranslation } from "@/hooks/useTranslation";
import type { Project } from "@/types/project";
import type {
  Unit,
  UnitFormPayload,
  UnitStatus,
  UnitType,
} from "@/types/unit";

type UnitFormModalProps = {
  isOpen: boolean;
  unit: Unit | null;
  projects: Project[];
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: UnitFormPayload) => Promise<void>;
};

type UnitFormState = {
  project_id: string;
  unit_number: string;
  unit_type: UnitType;
  status: UnitStatus;
  selling_price: string;
  area: string;
  floor: string;
  bedrooms: string;
  bathrooms: string;
  notes: string;
};

const emptyForm: UnitFormState = {
  project_id: "",
  unit_number: "",
  unit_type: "apartment",
  status: "available",
  selling_price: "",
  area: "",
  floor: "",
  bedrooms: "",
  bathrooms: "",
  notes: "",
};

const unitTypes: UnitType[] = [
  "apartment",
  "villa",
  "office",
  "shop",
  "land",
  "other",
];

function initialForm(unit: Unit | null): UnitFormState {
  if (!unit) {
    return { ...emptyForm };
  }

  return {
    project_id: unit.project_id,
    unit_number: unit.unit_number,
    unit_type: unit.unit_type,
    status: unit.status,
    selling_price: unit.selling_price,
    area: unit.area ?? "",
    floor: unit.floor?.toString() ?? "",
    bedrooms: unit.bedrooms?.toString() ?? "",
    bathrooms: unit.bathrooms?.toString() ?? "",
    notes: unit.notes ?? "",
  };
}

export function UnitFormModal({
  isOpen,
  unit,
  projects,
  isSubmitting,
  onClose,
  onSubmit,
}: UnitFormModalProps) {
  const { isArabic } = useTranslation();
  const [form, setForm] = useState<UnitFormState>(() => initialForm(unit));
  const {
    formRef,
    fieldErrors,
    formError,
    clearValidation,
    setClientFieldErrors,
    setValidationError,
  } = useFormValidation();

  if (!isOpen) {
    return null;
  }

  const labels = isArabic
    ? {
        create: "إضافة وحدة",
        edit: "تعديل الوحدة",
        description: "أدخل بيانات الوحدة الأساسية.",
        project: "المشروع",
        chooseProject: "اختر المشروع",
        number: "رقم الوحدة",
        type: "نوع الوحدة",
        status: "الحالة",
        price: "سعر البيع",
        area: "المساحة",
        floor: "الطابق",
        bedrooms: "غرف النوم",
        bathrooms: "دورات المياه",
        notes: "ملاحظات",
        cancel: "إلغاء",
        save: "حفظ",
        saving: "جارٍ الحفظ...",
        close: "إغلاق",
        required: "المشروع ورقم الوحدة وسعر البيع مطلوبة.",
        failed: "تعذر حفظ الوحدة.",
        available: "متاحة",
        sold: "مباعة",
        apartment: "شقة",
        villa: "فيلا",
        office: "مكتب",
        shop: "محل",
        land: "أرض",
        other: "أخرى",
      }
    : {
        create: "Add unit",
        edit: "Edit unit",
        description: "Enter the unit's essential information.",
        project: "Project",
        chooseProject: "Select a project",
        number: "Unit number",
        type: "Unit type",
        status: "Status",
        price: "Selling price",
        area: "Area",
        floor: "Floor",
        bedrooms: "Bedrooms",
        bathrooms: "Bathrooms",
        notes: "Notes",
        cancel: "Cancel",
        save: "Save",
        saving: "Saving...",
        close: "Close",
        required: "Project, unit number, and selling price are required.",
        failed: "Unable to save unit.",
        available: "Available",
        sold: "Sold",
        apartment: "Apartment",
        villa: "Villa",
        office: "Office",
        shop: "Shop",
        land: "Land",
        other: "Other",
      };

  const typeLabels: Record<UnitType, string> = {
    apartment: labels.apartment,
    villa: labels.villa,
    office: labels.office,
    shop: labels.shop,
    land: labels.land,
    other: labels.other,
  };

  const updateField = <Key extends keyof UnitFormState>(
    key: Key,
    value: UnitFormState[Key]
  ): void => {
    clearValidation();
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearValidation();

    const errors = {
      ...(!form.project_id ? { project_id: [labels.required] } : {}),
      ...(!form.unit_number.trim() ? { unit_number: [labels.required] } : {}),
      ...(!form.selling_price.trim() ? { selling_price: [labels.required] } : {}),
    };

    if (Object.keys(errors).length > 0) {
      setClientFieldErrors(errors);
      return;
    }

    try {
      await onSubmit({
        project_id: form.project_id,
        unit_number: form.unit_number.trim(),
        unit_type: form.unit_type,
        status: form.status,
        selling_price: Number(form.selling_price),
        area: form.area === "" ? null : Number(form.area),
        floor: form.floor === "" ? null : Number(form.floor),
        bedrooms: form.bedrooms === "" ? null : Number(form.bedrooms),
        bathrooms: form.bathrooms === "" ? null : Number(form.bathrooms),
        notes: form.notes.trim() || null,
      });
    } catch (error) {
      setValidationError(error, labels.failed);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6">
      <button type="button" onClick={onClose} aria-label={labels.close} className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]" />
      <div className="relative flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-[26px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-lg)]">
        <header className="flex items-start justify-between gap-4 border-b border-[var(--border)] px-5 py-5 sm:px-7">
          <div className="flex items-start gap-4"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand-gold-soft)] text-[var(--brand-gold-strong)]"><Building2 size={21} /></span><div><h2 className="text-lg font-bold text-[var(--text-primary)]">{unit ? labels.edit : labels.create}</h2><p className="mt-1 text-xs text-[var(--text-secondary)]">{labels.description}</p></div></div>
          <button type="button" onClick={onClose} aria-label={labels.close} className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--text-muted)] hover:bg-[var(--surface-muted)]"><X size={19} /></button>
        </header>
        <form ref={formRef} onSubmit={handleSubmit} className="min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-5 px-5 py-6 sm:px-7">
            <FormErrorBanner message={formError} />
            <SelectField label={labels.project} name="project_id" value={form.project_id} error={fieldErrors.project_id?.[0]} onChange={(value) => updateField("project_id", value)} options={[{ value: "", label: labels.chooseProject }, ...projects.map((project) => ({ value: project.id, label: `${project.project_number} — ${project.name}` }))]} />
            <div className="grid gap-5 sm:grid-cols-2">
              <Input label={labels.number} name="unit_number" value={form.unit_number} onChange={(event) => updateField("unit_number", event.target.value)} error={fieldErrors.unit_number?.[0]} required />
              <SelectField label={labels.type} name="unit_type" value={form.unit_type} error={fieldErrors.unit_type?.[0]} onChange={(value) => updateField("unit_type", value as UnitType)} options={unitTypes.map((type) => ({ value: type, label: typeLabels[type] }))} />
              <SelectField label={labels.status} name="status" value={form.status} error={fieldErrors.status?.[0]} onChange={(value) => updateField("status", value as UnitStatus)} options={[{ value: "available", label: labels.available }, { value: "sold", label: labels.sold }]} />
              <Input label={labels.price} name="selling_price" type="number" min="0" step="0.01" value={form.selling_price} onChange={(event) => updateField("selling_price", event.target.value)} error={fieldErrors.selling_price?.[0]} required />
              <Input label={labels.area} name="area" type="number" step="0.01" value={form.area} onChange={(event) => updateField("area", event.target.value)} error={fieldErrors.area?.[0]} />
              <Input label={labels.floor} name="floor" type="number" step="1" value={form.floor} onChange={(event) => updateField("floor", event.target.value)} error={fieldErrors.floor?.[0]} />
              <Input label={labels.bedrooms} name="bedrooms" type="number" min="0" step="1" value={form.bedrooms} onChange={(event) => updateField("bedrooms", event.target.value)} error={fieldErrors.bedrooms?.[0]} />
              <Input label={labels.bathrooms} name="bathrooms" type="number" min="0" step="1" value={form.bathrooms} onChange={(event) => updateField("bathrooms", event.target.value)} error={fieldErrors.bathrooms?.[0]} />
            </div>
            <div><label htmlFor="unit-notes" className="mb-2 block text-sm font-semibold text-[var(--text-secondary)]">{labels.notes}</label><textarea id="unit-notes" name="notes" rows={4} value={form.notes} onChange={(event) => updateField("notes", event.target.value)} className="w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--brand-gold)]" />{fieldErrors.notes?.[0] ? <p className="mt-2 text-sm font-medium text-[var(--danger)]">{fieldErrors.notes[0]}</p> : null}</div>
          </div>
          <footer className="sticky bottom-0 flex justify-end gap-3 border-t border-[var(--border)] bg-[var(--surface)] px-5 py-4 sm:px-7"><Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>{labels.cancel}</Button><Button type="submit" disabled={isSubmitting} className="!bg-[var(--brand-gold)] !text-white hover:!bg-[var(--brand-gold-strong)]">{isSubmitting ? labels.saving : labels.save}</Button></footer>
        </form>
      </div>
    </div>
  );
}

type SelectFieldProps = { label: string; name: string; value: string; error?: string; options: Array<{ value: string; label: string }>; onChange: (value: string) => void };

function SelectField({ label, name, value, error, options, onChange }: SelectFieldProps) {
  return <div><label className="mb-2 block text-sm font-semibold text-[var(--text-secondary)]">{label}</label><select name={name} value={value} aria-invalid={error ? true : undefined} onChange={(event) => onChange(event.target.value)} className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--brand-gold)]">{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>{error ? <p className="mt-2 text-sm font-medium text-[var(--danger)]">{error}</p> : null}</div>;
}
