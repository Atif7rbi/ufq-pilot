import type {
  InputHTMLAttributes,
  ReactNode,
} from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string | null;
  leading?: ReactNode;
  trailing?: ReactNode;
  hint?: string | null;
};

export function Input({
  label,
  error,
  leading,
  trailing,
  hint,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id ?? props.name;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-2 block text-sm font-semibold text-[var(--text-secondary)]"
      >
        {label}
      </label>

      <div className="relative">
        {leading ? (
          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-4 text-[var(--text-muted)]">
            {leading}
          </div>
        ) : null}

        <input
          id={inputId}
          className={[
            "h-12 w-full rounded-xl border px-4 text-sm outline-none transition",
            "border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-primary)]",
            "placeholder:text-[var(--text-muted)]",
            "focus:border-[var(--brand-gold)] focus:ring-2 focus:ring-[var(--brand-gold-soft)]",
            "disabled:cursor-not-allowed disabled:bg-[var(--surface-muted)] disabled:text-[var(--text-muted)]",
            "read-only:cursor-default",
            error
              ? "border-[var(--danger)]"
              : "",
            leading ? "ps-11" : "",
            trailing ? "pe-14" : "",
            className,
          ].join(" ")}
          {...props}
        />

        {trailing ? (
          <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-4 text-xs font-bold text-[var(--text-secondary)]">
            {trailing}
          </div>
        ) : null}
      </div>

      {hint ? (
        <p className="mt-2 text-xs font-medium leading-5 text-[var(--text-secondary)]">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p className="mt-2 text-xs font-semibold text-[var(--danger)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
