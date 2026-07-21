import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger";

type ButtonSize =
  | "sm"
  | "md"
  | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  isLoading?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    "border border-transparent",
    "bg-[var(--brand-primary)] text-[var(--text-inverse)]",
    "shadow-[var(--shadow-sm)]",
    "hover:-translate-y-0.5 hover:bg-[var(--brand-primary-hover)]",
    "hover:shadow-[var(--shadow-md)]",
    "focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]",
    "disabled:bg-[var(--surface-muted)]",
    "disabled:text-[var(--text-muted)]",
    "disabled:shadow-none",
  ].join(" "),

  secondary: [
    "border border-[var(--border-strong)]",
    "bg-[var(--surface)] text-[var(--text-primary)]",
    "shadow-[var(--shadow-sm)]",
    "hover:-translate-y-0.5 hover:border-[var(--brand-primary)]",
    "hover:bg-[var(--brand-primary-soft)]",
    "focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]",
  ].join(" "),

  ghost: [
    "border border-transparent",
    "bg-transparent text-[var(--text-secondary)]",
    "hover:bg-[var(--surface-muted)]",
    "hover:text-[var(--text-primary)]",
    "focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]",
  ].join(" "),

  danger: [
    "border border-transparent",
    "bg-[var(--danger)] text-white",
    "shadow-[var(--shadow-sm)]",
    "hover:-translate-y-0.5 hover:brightness-95",
    "hover:shadow-[var(--shadow-md)]",
    "focus-visible:ring-4 focus-visible:ring-[var(--danger-soft)]",
    "disabled:bg-[var(--surface-muted)]",
    "disabled:text-[var(--text-muted)]",
    "disabled:shadow-none",
  ].join(" "),
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 rounded-[var(--radius-sm)] px-3 text-xs",
  md: "h-11 rounded-[var(--radius-md)] px-4 text-sm",
  lg: "h-12 rounded-[var(--radius-lg)] px-5 text-sm",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  leadingIcon,
  trailingIcon,
  isLoading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      className={[
        "motion-ui inline-flex items-center justify-center gap-2",
        "whitespace-nowrap font-bold",
        "focus-visible:outline-none",
        "disabled:pointer-events-none disabled:translate-y-0",
        sizeClasses[size],
        variantClasses[variant],
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      disabled={isDisabled}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-e-transparent"
          aria-hidden="true"
        />
      ) : leadingIcon ? (
        <span className="shrink-0" aria-hidden="true">
          {leadingIcon}
        </span>
      ) : null}

      <span>{children}</span>

      {!isLoading && trailingIcon ? (
        <span className="shrink-0" aria-hidden="true">
          {trailingIcon}
        </span>
      ) : null}
    </button>
  );
}
