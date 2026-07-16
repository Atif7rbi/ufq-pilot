"use client";

import Link from "next/link";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Coins,
  MapPin,
} from "lucide-react";

import { useTranslation } from "@/hooks/useTranslation";
import type {
  Project,
  ProjectStatus,
  ProjectType,
} from "@/types/project";

type ProjectsOverviewProps = {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
};

const projectTypeLabels: Record<
  ProjectType,
  {
    ar: string;
    en: string;
  }
> = {
  residential: {
    ar: "سكني",
    en: "Residential",
  },
  commercial: {
    ar: "تجاري",
    en: "Commercial",
  },
  mixed_use: {
    ar: "متعدد الاستخدامات",
    en: "Mixed use",
  },
  land: {
    ar: "أرض",
    en: "Land",
  },
  villa: {
    ar: "فلل",
    en: "Villas",
  },
  tower: {
    ar: "برج",
    en: "Tower",
  },
  compound: {
    ar: "مجمع",
    en: "Compound",
  },
  warehouse: {
    ar: "مستودعات",
    en: "Warehouses",
  },
  other: {
    ar: "أخرى",
    en: "Other",
  },
};

const projectStatusLabels: Record<
  ProjectStatus,
  {
    ar: string;
    en: string;
  }
> = {
  draft: {
    ar: "مسودة",
    en: "Draft",
  },
  planning: {
    ar: "تخطيط",
    en: "Planning",
  },
  active: {
    ar: "نشط",
    en: "Active",
  },
  completed: {
    ar: "مكتمل",
    en: "Completed",
  },
  archived: {
    ar: "مؤرشف",
    en: "Archived",
  },
  cancelled: {
    ar: "ملغي",
    en: "Cancelled",
  },
};

const statusClasses: Record<ProjectStatus, string> = {
  draft:
    "bg-[var(--surface-muted)] text-[var(--text-secondary)]",
  planning:
    "bg-[var(--info-soft)] text-[var(--info)]",
  active:
    "bg-[var(--success-soft)] text-[var(--success)]",
  completed:
    "bg-[var(--brand-gold-soft)] text-[var(--brand-gold-strong)]",
  archived:
    "bg-[var(--surface-muted)] text-[var(--text-muted)]",
  cancelled:
    "bg-[var(--danger-soft)] text-[var(--danger)]",
};

export function ProjectsOverview({
  projects,
  isLoading,
  error,
}: ProjectsOverviewProps) {
  const { t, isArabic } = useTranslation();
  const ArrowIcon = isArabic
    ? ChevronLeft
    : ChevronRight;

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            {t("dashboard.currentProjects")}
          </h3>

          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            {t("dashboard.currentProjectsDescription")}
          </p>
        </div>

        <Link
          href="/projects/"
          className="inline-flex items-center gap-1 text-xs font-bold text-[var(--brand-gold-strong)] hover:underline"
        >
          {t("common.showAll")}
          <ArrowIcon size={14} />
        </Link>
      </div>

      {isLoading ? (
        <div className="mt-5 flex min-h-64 items-center justify-center rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--surface-soft)]">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--brand-gold)]" />
        </div>
      ) : error ? (
        <div className="mt-5 flex min-h-64 items-center justify-center rounded-xl border border-[var(--danger)]/25 bg-[var(--danger-soft)] px-6 text-center">
          <p className="text-sm font-semibold text-[var(--danger)]">
            {isArabic
              ? "تعذر تحميل المشاريع."
              : "Unable to load projects."}
          </p>
        </div>
      ) : projects.length === 0 ? (
        <div className="mt-5 flex min-h-64 items-center justify-center rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--surface-soft)] px-6 text-center">
          <div className="max-w-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--brand-gold-soft)] text-[var(--brand-gold-strong)]">
              <Building2 size={24} strokeWidth={1.7} />
            </div>

            <h4 className="mt-4 text-sm font-bold text-[var(--text-primary)]">
              {t("dashboard.noProjects")}
            </h4>

            <p className="mt-2 text-xs leading-6 text-[var(--text-secondary)]">
              {t("dashboard.noProjectsDescription")}
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-5 divide-y divide-[var(--border)] overflow-hidden rounded-xl border border-[var(--border)]">
          {projects.map((project) => (
            <article
              key={project.id}
              className="flex items-center justify-between gap-4 bg-[var(--surface-soft)] px-4 py-4 transition-colors hover:bg-[var(--surface-muted)]"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-gold-soft)] text-[var(--brand-gold-strong)]">
                  <Building2 size={18} />
                </span>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[var(--text-primary)]">
                    {project.name}
                  </p>

                  <p className="mt-1 text-xs text-[var(--text-secondary)]">
                    {
                      projectTypeLabels[
                        project.project_type
                      ][isArabic ? "ar" : "en"]
                    }
                  </p>

                  <div className="mt-3 flex flex-col gap-2 text-[11px] sm:flex-row sm:items-center sm:gap-5">
                    <span className="inline-flex items-center gap-1.5 text-[var(--text-secondary)]">
                      <MapPin
                        size={13}
                        className="shrink-0 text-[var(--text-muted)]"
                      />

                      <span>
                        {project.city}
                        {project.district
                          ? `، ${project.district}`
                          : ""}
                      </span>
                    </span>

                    <span
                      className="inline-flex items-center gap-1.5 font-bold text-[var(--brand-gold-strong)]"
                      dir="ltr"
                    >
                      <Coins size={13} />

                      {project.estimated_budget
                        ? `${new Intl.NumberFormat(
                            "en-US",
                            {
                              maximumFractionDigits: 0,
                            }
                          ).format(
                            Number(
                              project.estimated_budget
                            )
                          )} SAR`
                        : isArabic
                          ? "الميزانية غير محددة"
                          : "Budget not specified"}
                    </span>
                  </div>
                </div>
              </div>

              <span
                className={[
                  "shrink-0 rounded-full px-3 py-1 text-[11px] font-bold",
                  statusClasses[project.status],
                ].join(" ")}
              >
                {
                  projectStatusLabels[project.status][
                    isArabic ? "ar" : "en"
                  ]
                }
              </span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
