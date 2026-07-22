import type { ComponentType, ReactNode } from "react";

type CrudPageLayoutProps = {
  children: ReactNode;
};

type CrudPageHeaderProps = {
  icon: ComponentType<{ size?: number }>;
  title: string;
  description: string;
  action?: ReactNode;
};

type CrudSectionProps = {
  children: ReactNode;
  className?: string;
};

export function CrudPageLayout({
  children,
}: CrudPageLayoutProps) {
  return (
    <div className="mx-auto max-w-[1600px] space-y-5">
      {children}
    </div>
  );
}

export function CrudPageHeader({
  icon: Icon,
  title,
  description,
  action,
}: CrudPageHeaderProps) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand-gold-soft)] text-[var(--brand-gold-strong)]">
            <Icon size={21} />
          </span>

          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              {title}
            </h2>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              {description}
            </p>
          </div>
        </div>

        {action ? <div>{action}</div> : null}
      </div>
    </section>
  );
}

export function CrudSection({
  children,
  className = "",
}: CrudSectionProps) {
  return (
    <section
      className={[
        "rounded-2xl border border-[var(--border)]",
        "bg-[var(--surface)] shadow-[var(--shadow-sm)]",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}
