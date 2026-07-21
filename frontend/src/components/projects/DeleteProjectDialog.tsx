"use client";

import {
  AlertTriangle,
  X,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/hooks/useTranslation";
import type { Project } from "@/types/project";

type DeleteProjectDialogProps = {
  project: Project | null;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
};

export function DeleteProjectDialog({
  project,
  isDeleting,
  onCancel,
  onConfirm,
}: DeleteProjectDialogProps) {
  const { isArabic } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  if (!project) {
    return null;
  }

  const handleConfirm = async (): Promise<void> => {
    setError(null);

    try {
      await onConfirm();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : isArabic
            ? "تعذر حذف المشروع. حاول مرة أخرى."
            : "Unable to delete the project. Please try again."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button
        type="button"
        onClick={onCancel}
        aria-label="Close"
        className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]"
      />

      <div className="relative w-full max-w-md rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-lg)]">
        <button
          type="button"
          onClick={onCancel}
          className="absolute end-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-muted)]"
        >
          <X size={17} />
        </button>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--danger-soft)] text-[var(--danger)]">
          <AlertTriangle size={22} />
        </div>

        <h2 className="mt-5 text-lg font-bold text-[var(--text-primary)]">
          {isArabic
            ? "حذف المشروع"
            : "Delete project"}
        </h2>

        <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
          {isArabic
            ? `هل أنت متأكد من حذف المشروع «${project.name}»؟ سيختفي من قوائم النظام.`
            : `Are you sure you want to delete “${project.name}”? It will be removed from the system lists.`}
        </p>

        {error ? (
          <div className="mt-4 rounded-xl border border-[var(--danger)]/25 bg-[var(--danger-soft)] px-4 py-3 text-sm font-semibold text-[var(--danger)]">
            {error}
          </div>
        ) : null}

        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isDeleting}
            className="!border-[var(--border)] !bg-[var(--surface)] !text-[var(--text-primary)] hover:!bg-[var(--surface-muted)]"
          >
            {isArabic ? "إلغاء" : "Cancel"}
          </Button>

          <Button
            type="button"
            variant="danger"
            onClick={() => void handleConfirm()}
            disabled={isDeleting}
          >
            {isDeleting
              ? isArabic
                ? "جارٍ الحذف..."
                : "Deleting..."
              : isArabic
                ? "حذف المشروع"
                : "Delete project"}
          </Button>
        </div>
      </div>
    </div>
  );
}
