import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
};

export function EmptyState({
  title,
  description,
  action,
  icon,
}: EmptyStateProps) {
  return (
    <div
      className={[
        "flex min-h-56 flex-col items-center justify-center",
        "rounded-[var(--radius-lg)]",
        "border border-dashed border-[var(--border-strong)]",
        "bg-[var(--surface-soft)]",
        "px-6 py-12 text-center",
      ].join(" ")}
    >
      <div
        className={[
          "mb-5 flex h-14 w-14 items-center justify-center",
          "rounded-[var(--radius-lg)]",
          "border border-[var(--border)]",
          "bg-[var(--surface)]",
          "text-xl text-[var(--brand-primary)]",
          "shadow-[var(--shadow-sm)]",
        ].join(" ")}
      >
        {icon ?? "◌"}
      </div>

      <h3 className="text-base font-bold text-[var(--text-primary)]">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-[var(--text-secondary)]">
        {description}
      </p>

      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
