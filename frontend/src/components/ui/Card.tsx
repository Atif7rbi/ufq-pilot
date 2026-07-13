import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

type CardHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <section
      className={[
        "rounded-2xl border border-slate-200 bg-white shadow-sm",
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
}: CardHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
      <div>
        <h2 className="text-base font-bold text-slate-950">{title}</h2>

        {description ? (
          <p className="mt-1 text-sm leading-6 text-slate-500">
            {description}
          </p>
        ) : null}
      </div>

      {action}
    </header>
  );
}

export function CardContent({ children, className = "" }: CardProps) {
  return (
    <div className={["p-5", className].join(" ")}>
      {children}
    </div>
  );
}
