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
    <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)]">
      <div>
        <h3 className="text-lg font-bold text-[var(--text-primary)]">
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
              className="motion-ui flex items-center gap-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-soft)] p-5 hover:border-[var(--border-strong)] hover:bg-[var(--surface)]"
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] ${alert.tone}`}
              >
                <Icon size={18} />
              </div>

              <div>
                <p className="text-sm font-bold text-[var(--text-primary)]">
                  {alert.title}
                </p>

                <p className="mt-1 text-sm text-[var(--text-secondary)]">
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
