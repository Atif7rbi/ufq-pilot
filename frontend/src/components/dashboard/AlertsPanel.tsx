"use client";

import {
  AlertCircle,
  CalendarClock,
  CircleCheckBig,
} from "lucide-react";

import { useTranslation } from "@/hooks/useTranslation";

export function AlertsPanel() {
  const { t } = useTranslation();

  const alerts = [
    {
      title: t("dashboard.noOverdueInstallments"),
      description: t(
        "dashboard.noOverdueInstallmentsDescription"
      ),
      icon: CircleCheckBig,
      tone:
        "bg-[var(--success-soft)] text-[var(--success)]",
    },
    {
      title: t("dashboard.noDelayedProjects"),
      description: t(
        "dashboard.noDelayedProjectsDescription"
      ),
      icon: CalendarClock,
      tone:
        "bg-[var(--info-soft)] text-[var(--info)]",
    },
    {
      title: t("dashboard.noUrgentAlerts"),
      description: t(
        "dashboard.noUrgentAlertsDescription"
      ),
      icon: AlertCircle,
      tone:
        "bg-[var(--warning-soft)] text-[var(--warning)]",
    },
  ];

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
      <div>
        <h3 className="text-base font-bold text-[var(--text-primary)]">
          {t("dashboard.alerts")}
        </h3>

        <p className="mt-1 text-xs text-[var(--text-secondary)]">
          {t("dashboard.alertsDescription")}
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {alerts.map((alert) => {
          const Icon = alert.icon;

          return (
            <div
              key={alert.title}
              className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${alert.tone}`}
              >
                <Icon size={18} />
              </div>

              <div>
                <p className="text-sm font-bold text-[var(--text-primary)]">
                  {alert.title}
                </p>

                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  {alert.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
