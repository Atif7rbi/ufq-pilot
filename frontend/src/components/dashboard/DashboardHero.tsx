"use client";

import {
  CalendarPlus,
  CircleDollarSign,
  FilePlus2,
  FolderPlus,
  UserPlus,
} from "lucide-react";

import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/providers/AuthProvider";
import { useSystemSettings } from "@/providers/SystemSettingsProvider";

export function DashboardHero() {
  const { t, isArabic } = useTranslation();
  const { user } = useAuth();
  const settings = useSystemSettings();

  const actions = [
    {
      label: t("dashboard.quickActions.newProject"),
      icon: FolderPlus,
    },
    {
      label: t("dashboard.quickActions.newCustomer"),
      icon: UserPlus,
    },
    {
      label: t("dashboard.quickActions.newContract"),
      icon: FilePlus2,
    },
    {
      label: t("dashboard.quickActions.newPayment"),
      icon: CircleDollarSign,
    },
  ];

  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
      <div className="relative px-5 py-6 sm:px-7">
        <div className="absolute inset-y-0 start-0 hidden w-72 bg-gradient-to-end from-[var(--brand-gold-soft)] to-transparent lg:block" />

        <div className="relative flex flex-col justify-between gap-6 xl:flex-row xl:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1.5 text-[11px] font-bold text-[var(--text-secondary)]">
              <CalendarPlus size={14} />
              <span>
                {isArabic
                  ? "الثلاثاء، 14 يوليو"
                  : "Tuesday, July 14"}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
              {t("dashboard.greetingMorning")}
              {user?.name ? `، ${user.name}` : ""}
            </h2>

            <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
              {isArabic
                ? settings.company_name_ar
                : settings.company_name_en ?? settings.company_name_ar}

              {(isArabic
                ? settings.company_tagline_ar
                : settings.company_tagline_en) ? (
                <>
                  {" — "}
                  {isArabic
                    ? settings.company_tagline_ar
                    : settings.company_tagline_en}
                </>
              ) : null}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {actions.map((action) => {
              const Icon = action.icon;

              return (
                <button
                  key={action.label}
                  type="button"
                  className={[
                    "motion-ui flex min-h-24 flex-col items-center justify-center gap-3",
                    "rounded-2xl border border-[var(--border)]",
                    "bg-[var(--surface-soft)] px-4",
                    "text-sm font-bold text-[var(--text-primary)]",
                    "hover:-translate-y-1 hover:border-[var(--brand-gold)]",
                    "hover:bg-[var(--brand-gold-soft)] hover:shadow-[var(--shadow-sm)]",
                  ].join(" ")}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--brand-gold-strong)] shadow-[var(--shadow-sm)]">
                    <Icon size={19} strokeWidth={1.9} />
                  </span>

                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
