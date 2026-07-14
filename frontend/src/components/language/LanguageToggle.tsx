"use client";

import { Languages } from "lucide-react";

import { useTranslation } from "@/hooks/useTranslation";

type LanguageToggleProps = {
  compact?: boolean;
};

export function LanguageToggle({
  compact = false,
}: LanguageToggleProps) {
  const {
    isArabic,
    toggleLocale,
    t,
  } = useTranslation();

  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={t("common.language")}
      title={t("common.language")}
      className={[
        "motion-ui inline-flex h-10 items-center justify-center gap-2",
        "rounded-xl border border-[var(--border)]",
        "bg-[var(--surface)] text-[var(--text-secondary)]",
        "hover:-translate-y-0.5 hover:bg-[var(--surface-muted)]",
        compact ? "w-10" : "min-w-20 px-3",
      ].join(" ")}
    >
      <Languages size={17} strokeWidth={1.8} />

      {!compact ? (
        <span className="text-xs font-bold">
          {isArabic
            ? t("common.english")
            : t("common.arabic")}
        </span>
      ) : null}
    </button>
  );
}
