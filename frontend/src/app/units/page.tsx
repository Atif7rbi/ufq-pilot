"use client";

import {
  Archive,
  Building2,
  Edit3,
  Eye,
  Filter,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { UnitArchiveDialog } from "@/components/units/UnitArchiveDialog";
import { UnitDetailsModal } from "@/components/units/UnitDetailsModal";
import { UnitFormModal } from "@/components/units/UnitFormModal";
import { Button } from "@/components/ui/Button";
import {
  CrudPageHeader,
  CrudPageLayout,
  CrudSection,
} from "@/components/ui/crud/CrudPageLayout";
import { DataTable } from "@/components/ui/crud/DataTable";
import { FilterBar } from "@/components/ui/crud/FilterBar";
import {
  ListEmptyState,
  ListErrorState,
  ListLoadingState,
} from "@/components/ui/crud/ListState";
import { Pagination } from "@/components/ui/crud/Pagination";
import { SummaryCard } from "@/components/ui/crud/SummaryCard";
import { useAuth } from "@/providers/AuthProvider";
import { fetchProjects } from "@/services/projects";
import {
  archiveUnit,
  createUnit,
  fetchUnit,
  fetchUnits,
  restoreUnit,
  updateUnit,
} from "@/services/units";
import type { Project } from "@/types/project";
import type {
  Unit,
  UnitFormPayload,
  UnitStatus,
  UnitSummary,
  UnitType,
} from "@/types/unit";

type ArchiveAction = "archive" | "restore";

const emptySummary: UnitSummary = {
  total: 0,
  available: 0,
  sold: 0,
};

const typeLabels: Record<UnitType, string> = {
  apartment: "شقة",
  villa: "فيلا",
  office: "مكتب",
  shop: "محل",
  land: "أرض",
  other: "أخرى",
};

export default function UnitsPage() {
  const { token } = useAuth();
  const [units, setUnits] = useState<Unit[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [summary, setSummary] = useState<UnitSummary>(emptySummary);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState<UnitType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<UnitStatus | "all">("all");
  const [archiveFilter, setArchiveFilter] = useState<
    "all" | "active" | "archived"
  >("active");
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formUnit, setFormUnit] = useState<Unit | null>(null);
  const [isFormOpen, setFormOpen] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [detailUnit, setDetailUnit] = useState<Unit | null>(null);
  const [isDetailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [actionUnit, setActionUnit] = useState<Unit | null>(null);
  const [action, setAction] = useState<ArchiveAction>("archive");
  const [isProcessing, setProcessing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadUnits = useCallback(
    async (targetPage = page): Promise<void> => {
      if (!token) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetchUnits(token, {
          page: targetPage,
          per_page: 20,
          search,
          project_id:
            projectFilter === "all" ? undefined : projectFilter,
          unit_type: typeFilter === "all" ? undefined : typeFilter,
          status: statusFilter === "all" ? undefined : statusFilter,
          archived:
            archiveFilter === "all"
              ? undefined
              : archiveFilter === "archived",
        });

        setUnits(response.data.units.data);
        setPage(response.data.units.current_page);
        setLastPage(response.data.units.last_page);
        setTotal(response.data.units.total);
        setSummary(response.data.summary);
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "تعذر تحميل الوحدات."
        );
      } finally {
        setLoading(false);
      }
    },
    [
      archiveFilter,
      page,
      projectFilter,
      search,
      statusFilter,
      token,
      typeFilter,
    ]
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadUnits();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [loadUnits]);

  useEffect(() => {
    if (!token) {
      return;
    }

    let cancelled = false;

    fetchProjects(token, { perPage: 100 })
      .then((response) => {
        if (!cancelled) {
          setProjects(response.data.data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProjects([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const changeFilter = (callback: () => void): void => {
    callback();
    setPage(1);
  };

  const openDetail = async (unit: Unit): Promise<void> => {
    if (!token) {
      return;
    }

    setDetailUnit(unit);
    setDetailLoading(true);
    setDetailError(null);

    try {
      setDetailUnit(await fetchUnit(token, unit.id));
    } catch (caughtError) {
      setDetailError(
        caughtError instanceof Error
          ? caughtError.message
          : "تعذر تحميل تفاصيل الوحدة."
      );
    } finally {
      setDetailLoading(false);
    }
  };

  const openEdit = async (unit: Unit): Promise<void> => {
    if (!token) {
      return;
    }

    setSubmitting(true);

    try {
      setFormUnit(await fetchUnit(token, unit.id));
      setFormOpen(true);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "تعذر تحميل الوحدة."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const submitForm = async (
    payload: UnitFormPayload
  ): Promise<void> => {
    if (!token) {
      return;
    }

    setSubmitting(true);

    try {
      if (formUnit) {
        await updateUnit(token, formUnit.id, payload);
      } else {
        await createUnit(token, payload);
      }

      await loadUnits(formUnit ? page : 1);
      setFormOpen(false);
      setFormUnit(null);
    } finally {
      setSubmitting(false);
    }
  };

  const confirmAction = async (): Promise<void> => {
    if (!token || !actionUnit) {
      return;
    }

    setProcessing(true);
    setActionError(null);

    try {
      if (action === "archive") {
        await archiveUnit(token, actionUnit.id);
      } else {
        await restoreUnit(token, actionUnit.id);
      }

      await loadUnits();
      setActionUnit(null);
    } catch (caughtError) {
      setActionError(
        caughtError instanceof Error
          ? caughtError.message
          : "تعذر إتمام العملية."
      );
    } finally {
      setProcessing(false);
    }
  };

  const hasFilters = Boolean(
    search ||
      projectFilter !== "all" ||
      typeFilter !== "all" ||
      statusFilter !== "all" ||
      archiveFilter !== "active"
  );

  return (
    <AppShell>
      <CrudPageLayout>
        <CrudPageHeader
          icon={Building2}
          title="الوحدات"
          description="إدارة الوحدات والأسعار والحالة"
          action={
            <Button
              type="button"
              onClick={() => {
                setFormUnit(null);
                setFormOpen(true);
              }}
              className="gap-2 !bg-[var(--brand-gold)] !text-white hover:!bg-[var(--brand-gold-strong)]"
            >
              <Plus size={18} />
              إضافة وحدة
            </Button>
          }
        />

        <section className="grid gap-4 sm:grid-cols-3">
          <SummaryCard
            title="إجمالي الوحدات"
            value={summary.total}
            icon={Building2}
          />
          <SummaryCard
            title="الوحدات المتاحة"
            value={summary.available}
            icon={Building2}
            tone="success"
          />
          <SummaryCard
            title="الوحدات المباعة"
            value={summary.sold}
            icon={Building2}
            tone="info"
          />
        </section>

        <CrudSection>
          <FilterBar
            title="الفلاتر"
            icon={
              <Filter
                size={17}
                className="text-[var(--brand-gold-strong)]"
              />
            }
          >
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_180px_150px_150px_150px_auto]">
              <div className="relative">
                <Search
                  size={17}
                  className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    changeFilter(() => setSearch(event.target.value))
                  }
                  placeholder="البحث برقم الوحدة"
                  className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] ps-11 pe-4 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--brand-gold)]"
                />
              </div>

              <select
                value={projectFilter}
                onChange={(event) =>
                  changeFilter(() => setProjectFilter(event.target.value))
                }
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 text-sm"
              >
                <option value="all">كل المشاريع</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>

              <select
                value={typeFilter}
                onChange={(event) =>
                  changeFilter(() =>
                    setTypeFilter(event.target.value as UnitType | "all")
                  )
                }
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 text-sm"
              >
                <option value="all">كل الأنواع</option>
                {Object.entries(typeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(event) =>
                  changeFilter(() =>
                    setStatusFilter(event.target.value as UnitStatus | "all")
                  )
                }
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 text-sm"
              >
                <option value="all">كل الحالات</option>
                <option value="available">متاحة</option>
                <option value="sold">مباعة</option>
              </select>

              <select
                value={archiveFilter}
                onChange={(event) =>
                  changeFilter(() =>
                    setArchiveFilter(
                      event.target.value as "all" | "active" | "archived"
                    )
                  )
                }
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 text-sm"
              >
                <option value="active">غير مؤرشفة</option>
                <option value="archived">مؤرشفة</option>
                <option value="all">الكل</option>
              </select>

              <Button
                type="button"
                variant="secondary"
                onClick={() => void loadUnits()}
                disabled={isLoading}
                className="gap-2"
              >
                <RefreshCw
                  size={17}
                  className={isLoading ? "animate-spin" : ""}
                />
                تحديث
              </Button>
            </div>
          </FilterBar>
        </CrudSection>

        <CrudSection className="p-4 sm:p-5">
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm font-bold text-[var(--text-primary)]">
              النتائج: {total}
            </p>
          </div>

          {isLoading ? (
            <ListLoadingState label="جارٍ تحميل الوحدات..." />
          ) : error ? (
            <ListErrorState
              message={error}
              action={
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => void loadUnits()}
                >
                  إعادة المحاولة
                </Button>
              }
            />
          ) : units.length === 0 ? (
            <ListEmptyState
              icon={Building2}
              title="لا توجد وحدات"
              description={
                hasFilters
                  ? "لا توجد وحدات تطابق الفلاتر الحالية."
                  : "ابدأ بإضافة أول وحدة داخل المشروع."
              }
            />
          ) : (
            <DataTable>
              <thead className="border-b border-[var(--border)] text-xs text-[var(--text-secondary)]">
                <tr>
                  <th className="px-3 py-3">رقم الوحدة</th>
                  <th className="px-3 py-3">المشروع</th>
                  <th className="px-3 py-3">النوع</th>
                  <th className="px-3 py-3">السعر</th>
                  <th className="px-3 py-3">الحالة</th>
                  <th className="px-3 py-3">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {units.map((unit) => (
                  <tr
                    key={unit.id}
                    className="border-b border-[var(--border)] last:border-0"
                  >
                    <td className="px-3 py-4 font-bold text-[var(--text-primary)]">
                      {unit.unit_number}
                      {unit.archived_at ? (
                        <span className="me-2 rounded-full bg-[var(--surface-muted)] px-2 py-1 text-[10px] text-[var(--text-secondary)]">
                          مؤرشفة
                        </span>
                      ) : null}
                    </td>
                    <td className="px-3 py-4 text-sm text-[var(--text-secondary)]">
                      {unit.project?.name ?? "—"}
                    </td>
                    <td className="px-3 py-4 text-sm text-[var(--text-secondary)]">
                      {typeLabels[unit.unit_type]}
                    </td>
                    <td className="px-3 py-4 text-sm font-semibold text-[var(--text-primary)]">
                      {new Intl.NumberFormat("en-US", {
                        maximumFractionDigits: 2,
                      }).format(Number(unit.selling_price))}{" "}
                      {unit.project?.currency ?? ""}
                    </td>
                    <td className="px-3 py-4">
                      <span
                        className={
                          unit.status === "available"
                            ? "rounded-full bg-[var(--success-soft)] px-3 py-1 text-xs font-bold text-[var(--success)]"
                            : "rounded-full bg-[var(--info-soft)] px-3 py-1 text-xs font-bold text-[var(--info)]"
                        }
                      >
                        {unit.status === "available" ? "متاحة" : "مباعة"}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => void openDetail(unit)}
                          className="rounded-lg p-2 text-[var(--info)] hover:bg-[var(--info-soft)]"
                          aria-label="عرض"
                        >
                          <Eye size={17} />
                        </button>

                        {!unit.archived_at ? (
                          <>
                            <button
                              type="button"
                              onClick={() => void openEdit(unit)}
                              className="rounded-lg p-2 text-[var(--brand-gold-strong)] hover:bg-[var(--brand-gold-soft)]"
                              aria-label="تعديل"
                            >
                              <Edit3 size={17} />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setActionUnit(unit);
                                setAction("archive");
                                setActionError(null);
                              }}
                              className="rounded-lg p-2 text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]"
                              aria-label="أرشفة"
                            >
                              <Archive size={17} />
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setActionUnit(unit);
                              setAction("restore");
                              setActionError(null);
                            }}
                            className="rounded-lg p-2 text-[var(--success)] hover:bg-[var(--success-soft)]"
                            aria-label="استعادة"
                          >
                            <RotateCcw size={17} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          )}

          <Pagination
            page={page}
            lastPage={lastPage}
            isLoading={isLoading}
            previousLabel="السابق"
            nextLabel="التالي"
            pageLabel="الصفحة"
            ofLabel="من"
            onPrevious={() => setPage((current) => current - 1)}
            onNext={() => setPage((current) => current + 1)}
          />
        </CrudSection>
      </CrudPageLayout>

      {isFormOpen ? (
        <UnitFormModal
          key={formUnit?.id ?? "new-unit"}
          isOpen
          unit={formUnit}
          projects={projects}
          isSubmitting={isSubmitting}
          onClose={() => {
            if (!isSubmitting) {
              setFormOpen(false);
              setFormUnit(null);
            }
          }}
          onSubmit={submitForm}
        />
      ) : null}

      <UnitDetailsModal
        unit={detailUnit}
        isLoading={isDetailLoading}
        error={detailError}
        onClose={() => {
          setDetailUnit(null);
          setDetailError(null);
        }}
      />

      <UnitArchiveDialog
        unit={actionUnit}
        action={action}
        isProcessing={isProcessing}
        error={actionError}
        onCancel={() => {
          if (!isProcessing) {
            setActionUnit(null);
          }
        }}
        onConfirm={confirmAction}
      />
    </AppShell>
  );
}
