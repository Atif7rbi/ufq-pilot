"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { useSystemSettings } from "@/providers/SystemSettingsProvider";

type CompanyBrandProps = {
  compact?: boolean;
  hideText?: boolean;
  variant?: "default" | "inverse";
};

export function CompanyBrand({
  compact = false,
  hideText = false,
  variant = "default",
}: CompanyBrandProps) {
  const settings = useSystemSettings();
  const { isArabic } = useTranslation();

  const logoSource =
    settings.logo_path || "/brand/ufq-mark.svg";

  const companyName = isArabic
    ? settings.company_name_ar
    : settings.company_name_en ??
      settings.company_name_ar;

  const companyTagline = isArabic
    ? settings.company_tagline_ar
    : settings.company_tagline_en ??
      settings.company_tagline_ar;

  const isInverse = variant === "inverse";

  return (
    <div className="flex min-w-0 items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoSource}
        alt={companyName}
        className={[
          "shrink-0 object-contain",
          compact
            ? "h-10 w-10 rounded-xl"
            : "h-12 w-12 rounded-2xl",
        ].join(" ")}
      />

      {!hideText ? (
        <div className="min-w-0">
          <p
            className={[
              "truncate text-[15px] font-bold",
              isInverse
                ? "text-white"
                : "text-[var(--text-primary)]",
            ].join(" ")}
          >
            {companyName}
          </p>

          {companyTagline ? (
            <p
              className={[
                "mt-1 truncate text-[11px] font-medium",
                isInverse
                  ? "text-white/65"
                  : "text-[var(--text-secondary)]",
              ].join(" ")}
            >
              {companyTagline}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
