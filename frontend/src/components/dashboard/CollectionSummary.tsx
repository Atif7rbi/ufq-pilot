"use client";

import {
  CircleDollarSign,
} from "lucide-react";

import { useTranslation } from "@/hooks/useTranslation";

export function CollectionSummary() {
  const { t } = useTranslation();

  return (
    <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)]">
      <div>
        <h3 className="text-lg font-bold text-[var(--text-primary)]">
          {t("dashboard.collectionsSummary")}
        </h3>

        <p className="mt-1 text-xs text-[var(--text-secondary)]">
          {t("dashboard.collectionsDescription")}
        </p>
      </div>

      <div className="mt-5 flex min-h-48 items-center justify-center rounded-[var(--radius-md)] border border-dashed border-[var(--border-strong)] bg-[var(--surface-soft)] px-8 text-center">
        <div className="max-w-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[var(--radius-md)] bg-[var(--surface-muted)] text-[var(--text-secondary)]">
            <CircleDollarSign size={23} strokeWidth={1.7} />
          </div>

          <h4 className="mt-4 text-sm font-bold text-[var(--text-primary)]">
            {t("dashboard.noCollections")}
          </h4>

          <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
            {t("dashboard.noCollectionsDescription")}
          </p>
        </div>
      </div>
    </section>
  );
}
