import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  description: string;
  icon: LucideIcon;
  tone: "gold" | "blue" | "green" | "violet";
  href?: string;
};

const toneClasses = {
  gold: {
    icon: "bg-[var(--warning-soft)] text-[var(--warning)]",
  },
  blue: {
    icon: "bg-[var(--info-soft)] text-[var(--info)]",
  },
  green: {
    icon: "bg-[var(--success-soft)] text-[var(--success)]",
  },
  violet: {
    icon: "bg-[var(--violet-soft)] text-[var(--violet)]",
  },
};

export function StatCard({
  label,
  value,
  description,
  icon: Icon,
  tone,
  href,
}: StatCardProps) {
  const content = (
    <article
      className={[
        "motion-ui h-full rounded-2xl border border-[var(--border)]",
        "bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]",
        href
          ? "cursor-pointer hover:-translate-y-1 hover:border-[var(--brand-gold)] hover:shadow-[var(--shadow-md)]"
          : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--text-secondary)]">
            {label}
          </p>

          <p
            className="mt-3 text-3xl font-bold text-[var(--text-primary)]"
            dir="ltr"
          >
            {value}
          </p>

          <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">
            {description}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${toneClasses[tone].icon}`}
        >
          <Icon size={21} strokeWidth={1.8} />
        </div>
      </div>
    </article>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} className="block h-full">
      {content}
    </Link>
  );
}
