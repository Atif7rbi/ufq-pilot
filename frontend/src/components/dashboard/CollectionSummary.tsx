"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import { useTranslation } from "@/hooks/useTranslation";

export function CollectionSummary() {
  const { t } = useTranslation();

  const items = [
    {
      label: t("dashboard.dueThisMonth"),
      value: "0",
      icon: Clock3,
      className:
        "bg-[var(--warning-soft)] text-[var(--warning)]",
    },
    {
      label: t("dashboard.collected"),
      value: "0",
      icon: CheckCircle2,
      className:
        "bg-[var(--success-soft)] text-[var(--success)]",
    },
    {
      label: t("dashboard.overdue"),
      value: "0",
      icon: AlertTriangle,
      className:
        "bg-[var(--danger-soft)] text-[var(--danger)]",
    },
  ];

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
      <div>
        <h3 className="text-base font-bold text-[var(--text-primary)]">
          {t("dashboard.collectionsSummary")}
        </h3>

        <p className="mt-1 text-xs text-[var(--text-secondary)]">
          {t("dashboard.collectionsDescription")}
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4"
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${item.className}`}
              >
                <Icon size={17} />
              </div>

              <p className="mt-4 text-xs font-semibold text-[var(--text-secondary)]">
                {item.label}
              </p>

              <p className="mt-2 text-lg font-bold text-[var(--text-primary)]">
                {item.value}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
