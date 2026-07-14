"use client";

import {
  Building2,
  FileSignature,
  FolderKanban,
  Users,
} from "lucide-react";

import { ActivityPanel } from "@/components/dashboard/ActivityPanel";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { CollectionSummary } from "@/components/dashboard/CollectionSummary";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { ProjectsOverview } from "@/components/dashboard/ProjectsOverview";
import { StatCard } from "@/components/dashboard/StatCard";
import { AppShell } from "@/components/layout/AppShell";
import { useTranslation } from "@/hooks/useTranslation";

export default function HomePage() {
  const { t } = useTranslation();

  const stats = [
    {
      label: t("dashboard.stats.projects"),
      value: "0",
      description: t("dashboard.stats.noProjects"),
      icon: FolderKanban,
      tone: "gold" as const,
    },
    {
      label: t("dashboard.stats.customers"),
      value: "0",
      description: t("dashboard.stats.noCustomers"),
      icon: Users,
      tone: "blue" as const,
    },
    {
      label: t("dashboard.stats.units"),
      value: "0",
      description: t("dashboard.stats.noUnits"),
      icon: Building2,
      tone: "green" as const,
    },
    {
      label: t("dashboard.stats.contracts"),
      value: "0",
      description: t("dashboard.stats.noContracts"),
      icon: FileSignature,
      tone: "violet" as const,
    },
  ];

  return (
    <AppShell>
      <div className="mx-auto max-w-[1600px] space-y-5">
        <DashboardHero />

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard
              key={stat.label}
              {...stat}
            />
          ))}
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.45fr_0.75fr]">
          <ProjectsOverview />
          <ActivityPanel />
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
          <CollectionSummary />
          <AlertsPanel />
        </section>
      </div>
    </AppShell>
  );
}
