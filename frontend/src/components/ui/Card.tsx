import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
};

type CardHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  eyebrow?: string;
};

export function Card({
  children,
  className = "",
  interactive = false,
}: CardProps) {
  return (
    <section
      className={[
        "rounded-[var(--radius-lg)] border",
        "border-[var(--border)] bg-[var(--surface)]",
        "shadow-[var(--shadow-sm)]",
        interactive
          ? [
              "motion-ui",
              "hover:-translate-y-0.5",
              "hover:border-[var(--border-strong)]",
              "hover:shadow-[var(--shadow-md)]",
            ].join(" ")
          : "",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}

export function CardHeader({
  title,
  description,
  action,
  eyebrow,
}: CardHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-4 border-b border-[var(--border)] px-5 py-5 sm:px-6">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--brand-primary)]">
            {eyebrow}
          </p>
        ) : null}

        <h2 className="text-base font-bold leading-6 text-[var(--text-primary)] sm:text-lg">
          {title}
        </h2>

        {description ? (
          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
            {description}
          </p>
        ) : null}
      </div>

      {action ? (
        <div className="shrink-0">
          {action}
        </div>
      ) : null}
    </header>
  );
}

export function CardContent({
  children,
  className = "",
}: CardProps) {
  return (
    <div className={["p-5 sm:p-6", className].join(" ")}>
      {children}
    </div>
  );
}
