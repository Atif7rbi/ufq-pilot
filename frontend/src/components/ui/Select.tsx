import type { SelectHTMLAttributes } from "react";

export type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string | null;
  options: SelectOption[];
};

export function Select({
  label,
  error,
  options,
  className = "",
  id,
  ...props
}: SelectProps) {
  const selectId = id ?? props.name;

  return (
    <div className="space-y-2">
      <label
        htmlFor={selectId}
        className="block text-sm font-semibold text-[var(--text-secondary)]"
      >
        {label}
      </label>

      <select
        id={selectId}
        aria-invalid={error ? true : undefined}
        className={[
          "motion-ui h-12 w-full rounded-[var(--radius-md)]",
          "border border-[var(--border)] bg-[var(--surface)] px-4",
          "text-sm text-[var(--text-primary)] shadow-[var(--shadow-sm)]",
          "outline-none focus:border-[var(--brand-primary)]",
          "focus:ring-4 focus:ring-[var(--focus-ring)]",
          "disabled:bg-[var(--surface-muted)]",
          "disabled:text-[var(--text-muted)]",
          error
            ? "border-[var(--danger)] focus:border-[var(--danger)]"
            : "",
          className,
        ].join(" ")}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error ? (
        <p className="text-xs font-semibold text-[var(--danger)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
