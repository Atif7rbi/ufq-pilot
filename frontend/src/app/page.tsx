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
import { useDashboard } from "@/hooks/useDashboard";
import { useTranslation } from "@/hooks/useTranslation";

export default function HomePage() {
  const { t, isArabic } = useTranslation();
  const dashboard = useDashboard();

  const stats = [
    {
      label: t("dashboard.stats.projects"),
      value: new Intl.NumberFormat("en-US").format(
        dashboard.totalProjects
      ),
      description:
        dashboard.totalProjects > 0
          ? isArabic
            ? "إجمالي المشاريع المسجلة"
            : "Total registered projects"
          : t("dashboard.stats.noProjects"),
      icon: FolderKanban,
      tone: "gold" as const,
      href: "/projects/",
    },
    {
      label: t("dashboard.stats.customers"),
      value: new Intl.NumberFormat("en-US").format(
        dashboard.totalCustomers
      ),
      description:
        dashboard.totalCustomers > 0
          ? isArabic
            ? "إجمالي العملاء المسجلين"
            : "Total registered customers"
          : t("dashboard.stats.noCustomers"),
      icon: Users,
      tone: "blue" as const,
      href: "/customers/",
    },
    {
      label: t("dashboard.stats.units"),
      value: "0",
      description: t("dashboard.stats.noUnits"),
      icon: Building2,
      tone: "green" as const,
      href: "/units/",
    },
    {
      label: t("dashboard.stats.contracts"),
      value: "0",
      description: t("dashboard.stats.noContracts"),
      icon: FileSignature,
      tone: "violet" as const,
      href: "/contracts/",
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
          <ProjectsOverview
            projects={dashboard.recentProjects}
            isLoading={dashboard.isLoading}
            error={dashboard.error}
          />

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
