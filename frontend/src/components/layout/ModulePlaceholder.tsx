"use client";

import type { LucideIcon } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { useTranslation } from "@/hooks/useTranslation";
import type { TranslationKey } from "@/i18n/types";

type ModulePlaceholderProps = {
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  icon: LucideIcon;
};

export function ModulePlaceholder({
  titleKey,
  descriptionKey,
  icon: Icon,
}: ModulePlaceholderProps) {
  const { t } = useTranslation();

  return (
    <AppShell>
      <section className="flex min-h-[460px] items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-14 text-center shadow-[var(--shadow-sm)]">
        <div className="max-w-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--surface-muted)] text-[var(--text-secondary)]">
            <Icon size={29} strokeWidth={1.6} />
          </div>

          <h2 className="mt-5 text-lg font-bold text-[var(--text-primary)]">
            {t(titleKey)}
          </h2>

          <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
            {t(descriptionKey)}
          </p>

          <span className="mt-5 inline-flex rounded-full border border-[var(--brand-gold)]/35 bg-[var(--brand-gold-soft)] px-4 py-2 text-xs font-bold text-[var(--brand-gold-strong)]">
            {t("common.underConstruction")}
          </span>
        </div>
      </section>
    </AppShell>
  );
}
