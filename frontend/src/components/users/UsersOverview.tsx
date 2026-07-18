"use client";

import {
  CirclePause,
  ShieldCheck,
  UserRoundCheck,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

import type { TenantUsersSummary } from "@/types/tenant-user";

type UsersOverviewProps = {
  summary: TenantUsersSummary;
  isArabic: boolean;
  isLoading?: boolean;
};

type OverviewCard = {
  key: string;
  icon: LucideIcon;
  labelAr: string;
  labelEn: string;
  value: number;
  hintAr: string;
  hintEn: string;
};

export function UsersOverview({
  summary,
  isArabic,
  isLoading = false,
}: UsersOverviewProps) {
  const availableSlots = Math.max(
    summary.limit - summary.total,
    0
  );

  const cards: OverviewCard[] = [
    {
      key: "total",
      icon: UsersRound,
      labelAr: "إجمالي المستخدمين",
      labelEn: "Total Users",
      value: summary.total,
      hintAr: "أعضاء الشركة المسجلون",
      hintEn: "Registered company members",
    },
    {
      key: "active",
      icon: UserRoundCheck,
      labelAr: "المستخدمون النشطون",
      labelEn: "Active Users",
      value: summary.active,
      hintAr: "يمكنهم الدخول واستخدام النظام",
      hintEn: "Can access and use the system",
    },
    {
      key: "paused",
      icon: CirclePause,
      labelAr: "المستخدمون الموقوفون",
      labelEn: "Paused Users",
      value: summary.paused,
      hintAr: "موقوفون أو معلقون مؤقتًا",
      hintEn: "Paused or temporarily suspended",
    },
    {
      key: "available",
      icon: ShieldCheck,
      labelAr: "الخانات المتاحة",
      labelEn: "Available Slots",
      value: availableSlots,
      hintAr: `الحد الحالي ${summary.limit} مستخدمين`,
      hintEn: `Current limit is ${summary.limit} users`,
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article
            key={card.key}
            className={[
              "rounded-2xl border border-[var(--border)]",
              "bg-[var(--surface)] p-5",
              "shadow-[var(--shadow-sm)]",
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[var(--text-secondary)]">
                  {isArabic
                    ? card.labelAr
                    : card.labelEn}
                </p>

                <p className="mt-3 text-3xl font-bold text-[var(--text-primary)]">
                  {isLoading ? "—" : card.value}
                </p>
              </div>

              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-gold-soft)] text-[var(--brand-gold-strong)]">
                <Icon size={21} strokeWidth={1.9} />
              </span>
            </div>

            <p className="mt-4 text-xs leading-6 text-[var(--text-muted)]">
              {isArabic
                ? card.hintAr
                : card.hintEn}
            </p>
          </article>
        );
      })}
    </section>
  );
}
