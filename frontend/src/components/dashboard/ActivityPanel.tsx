"use client";

import { History } from "lucide-react";

import { useTranslation } from "@/hooks/useTranslation";

export function ActivityPanel() {
  const { t } = useTranslation();

  return (
    <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)]">
      <div>
        <h3 className="text-lg font-bold text-[var(--text-primary)]">
          {t("dashboard.recentActivity")}
        </h3>

        <p className="mt-1 text-xs text-[var(--text-secondary)]">
          {t("dashboard.recentActivityDescription")}
        </p>
      </div>

      <div className="mt-8 flex min-h-72 items-center justify-center rounded-[var(--radius-md)] border border-dashed border-[var(--border-strong)] bg-[var(--surface-soft)] px-8 text-center">
        <div className="max-w-xs">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[var(--radius-md)] bg-[var(--surface-muted)] text-[var(--text-secondary)]">
            <History size={24} strokeWidth={1.7} />
          </div>

          <h4 className="mt-4 text-sm font-bold text-[var(--text-primary)]">
            {t("dashboard.noActivity")}
          </h4>

          <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
            {t("dashboard.noActivityDescription")}
          </p>
        </div>
      </div>
    </section>
  );
}
