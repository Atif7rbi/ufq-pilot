import type { ReactNode } from "react";

type BadgeVariant =
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "primary";

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
};

const variantClasses: Record<BadgeVariant, string> = {
  neutral:
    "border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-secondary)]",

  success:
    "border border-transparent bg-[var(--success-soft)] text-[var(--success)]",

  warning:
    "border border-transparent bg-[var(--warning-soft)] text-[var(--warning)]",

  danger:
    "border border-transparent bg-[var(--danger-soft)] text-[var(--danger)]",

  info:
    "border border-transparent bg-[var(--info-soft)] text-[var(--info)]",

  primary:
    "border border-transparent bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]",
};

export function Badge({
  children,
  variant = "neutral",
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center justify-center",
        "rounded-[var(--radius-pill)]",
        "px-3 py-1.5",
        "text-[11px] font-bold tracking-[0.04em]",
        "motion-ui",
        variantClasses[variant],
      ].join(" ")}
    >
      {children}
    </span>
  );
}
