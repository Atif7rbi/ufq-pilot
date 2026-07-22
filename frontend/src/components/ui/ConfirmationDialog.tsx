import type { ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { FormErrorBanner } from "@/components/ui/FormErrorBanner";
import { Modal } from "@/components/ui/Modal";

type ConfirmationDialogProps = {
  isOpen: boolean;
  title: string;
  description: string;
  icon: ReactNode;
  error?: string | null;
  isProcessing: boolean;
  closeLabel: string;
  cancelLabel: string;
  confirmLabel: string;
  processingLabel: string;
  children?: ReactNode;
  confirmVariant?: "primary" | "danger";
  confirmClassName?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmationDialog({
  isOpen,
  title,
  description,
  icon,
  error = null,
  isProcessing,
  closeLabel,
  cancelLabel,
  confirmLabel,
  processingLabel,
  children,
  confirmVariant = "primary",
  confirmClassName = "",
  onCancel,
  onConfirm,
}: ConfirmationDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      closeLabel={closeLabel}
      maxWidthClassName="max-w-md"
      zIndexClassName="z-[80]"
    >
      <div className="p-6">
        <div>{icon}</div>
        <h2 className="mt-5 text-lg font-bold text-[var(--text-primary)]">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
          {description}
        </p>
        <div className="mt-4">
          <FormErrorBanner message={error} />
        </div>
        {children ? <div className="mt-4">{children}</div> : null}

        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isProcessing}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={confirmVariant}
            onClick={onConfirm}
            disabled={isProcessing}
            className={confirmClassName}
          >
            {isProcessing ? processingLabel : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
