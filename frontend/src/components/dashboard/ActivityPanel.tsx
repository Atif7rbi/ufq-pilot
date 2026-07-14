"use client";

import { History } from "lucide-react";

import { useTranslation } from "@/hooks/useTranslation";

export function ActivityPanel() {
  const { t } = useTranslation();

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
      <div>
        <h3 className="text-base font-bold text-[var(--text-primary)]">
          {t("dashboard.recentActivity")}
        </h3>

        <p className="mt-1 text-xs text-[var(--text-secondary)]">
          {t("dashboard.recentActivityDescription")}
        </p>
      </div>

      <div className="mt-5 flex min-h-64 items-center justify-center rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--surface-soft)] px-6 text-center">
        <div className="max-w-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface-muted)] text-[var(--text-secondary)]">
            <History size={24} strokeWidth={1.7} />
          </div>

          <h4 className="mt-4 text-sm font-bold text-[var(--text-primary)]">
            {t("dashboard.noActivity")}
          </h4>

          <p className="mt-2 text-xs leading-6 text-[var(--text-secondary)]">
            {t("dashboard.noActivityDescription")}
          </p>
        </div>
      </div>
    </section>
  );
}
