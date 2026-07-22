"use client";

import {
  CalendarCheck2,
  Filter,
  RefreshCw,
  Search,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { AppShell } from "@/components/layout/AppShell";
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
import { fetchReservations } from "@/services/reservations";
import type { Project } from "@/types/project";
import type {
  Reservation,
  ReservationStatus,
  ReservationSummary,
} from "@/types/reservation";

const emptySummary: ReservationSummary = {
  total: 0,
  active: 0,
  cancelled: 0,
  expired: 0,
};

const statusLabels: Record<ReservationStatus, string> = {
  active: "نشط",
  cancelled: "ملغي",
  expired: "منتهي",
};

const statusClasses: Record<ReservationStatus, string> = {
  active: "bg-[var(--success-soft)] text-[var(--success)]",
  cancelled: "bg-[var(--danger-soft)] text-[var(--danger)]",
  expired: "bg-[var(--surface-muted)] text-[var(--text-secondary)]",
};

export default function ReservationsPage() {
  const { token } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [summary, setSummary] = useState<ReservationSummary>(emptySummary);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | "all">("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReservations = useCallback(
    async (targetPage = page): Promise<void> => {
      if (!token) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetchReservations(token, {
          page: targetPage,
          per_page: 20,
          search,
          status: statusFilter === "all" ? undefined : statusFilter,
          project_id: projectFilter === "all" ? undefined : projectFilter,
        });

        setReservations(response.data.reservations.data);
        setPage(response.data.reservations.current_page);
        setLastPage(response.data.reservations.last_page);
        setTotal(response.data.reservations.total);
        setSummary(response.data.summary);
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "تعذر تحميل الحجوزات."
        );
      } finally {
        setLoading(false);
      }
    },
    [page, projectFilter, search, statusFilter, token]
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadReservations();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [loadReservations]);

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

  const hasFilters = Boolean(
    search || statusFilter !== "all" || projectFilter !== "all"
  );

  const resetFilters = (): void => {
    setSearch("");
    setStatusFilter("all");
    setProjectFilter("all");
    setPage(1);
  };

  return (
    <AppShell>
      <CrudPageLayout>
        <CrudPageHeader
          icon={CalendarCheck2}
          title="الحجوزات"
          description="متابعة حجوزات الوحدات وحالتها"
        />

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard title="إجمالي الحجوزات" value={summary.total} icon={CalendarCheck2} />
          <SummaryCard title="الحجوزات النشطة" value={summary.active} icon={CalendarCheck2} tone="success" />
          <SummaryCard title="الحجوزات الملغاة" value={summary.cancelled} icon={CalendarCheck2} tone="info" />
          <SummaryCard title="الحجوزات المنتهية" value={summary.expired} icon={CalendarCheck2} />
        </section>

        <CrudSection>
          <FilterBar
            title="الفلاتر"
            icon={<Filter size={17} className="text-[var(--brand-gold-strong)]" />}
          >
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_180px_180px_auto_auto]">
              <div className="relative">
                <Search size={17} className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => changeFilter(() => setSearch(event.target.value))}
                  placeholder="البحث برقم الوحدة أو اسم العميل"
                  className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] ps-11 pe-4 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--brand-gold)]"
                />
              </div>

              <select
                value={projectFilter}
                onChange={(event) => changeFilter(() => setProjectFilter(event.target.value))}
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 text-sm"
              >
                <option value="all">كل المشاريع</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.project_number} — {project.name}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(event) => changeFilter(() => setStatusFilter(event.target.value as ReservationStatus | "all"))}
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 text-sm"
              >
                <option value="all">كل الحالات</option>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>

              <Button type="button" variant="secondary" onClick={() => void loadReservations()} disabled={isLoading} className="gap-2">
                <RefreshCw size={17} className={isLoading ? "animate-spin" : ""} />
                تحديث
              </Button>

              {hasFilters ? (
                <Button type="button" variant="ghost" onClick={resetFilters}>
                  إعادة تعيين الفلاتر
                </Button>
              ) : null}
            </div>
          </FilterBar>
        </CrudSection>

        <CrudSection className="p-4 sm:p-5">
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm font-bold text-[var(--text-primary)]">النتائج: {total}</p>
          </div>

          {isLoading ? (
            <ListLoadingState label="جارٍ تحميل الحجوزات..." />
          ) : error ? (
            <ListErrorState
              message={error}
              action={<Button type="button" variant="secondary" size="sm" onClick={() => void loadReservations()}>إعادة المحاولة</Button>}
            />
          ) : reservations.length === 0 ? (
            <ListEmptyState
              icon={CalendarCheck2}
              title="لا توجد حجوزات"
              description={hasFilters ? "لا توجد حجوزات مطابقة للفلاتر الحالية." : "لا توجد حجوزات مسجلة حتى الآن."}
              action={hasFilters ? <Button type="button" variant="secondary" onClick={resetFilters}>مسح الفلاتر</Button> : undefined}
            />
          ) : (
            <DataTable minWidth="950px">
              <thead className="border-b border-[var(--border)] text-xs text-[var(--text-secondary)]">
                <tr>
                  <th className="px-3 py-3">رقم الوحدة</th>
                  <th className="px-3 py-3">المشروع</th>
                  <th className="px-3 py-3">العميل</th>
                  <th className="px-3 py-3">الحالة</th>
                  <th className="px-3 py-3">تاريخ الحجز</th>
                  <th className="px-3 py-3">ينتهي في</th>
                  <th className="px-3 py-3">ملاحظات</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => (
                  <tr key={reservation.id} className="border-b border-[var(--border)] last:border-0">
                    <td className="px-3 py-4 font-bold text-[var(--text-primary)]">{reservation.unit?.unit_number ?? "—"}</td>
                    <td className="px-3 py-4 text-sm text-[var(--text-secondary)]">{reservation.unit?.project ? `${reservation.unit.project.project_number} — ${reservation.unit.project.name}` : "—"}</td>
                    <td className="px-3 py-4 text-sm text-[var(--text-secondary)]">{reservation.customer?.name ?? "—"}</td>
                    <td className="px-3 py-4"><span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClasses[reservation.status]}`}>{statusLabels[reservation.status]}</span></td>
                    <td className="px-3 py-4 text-sm text-[var(--text-secondary)]">{formatDate(reservation.reserved_at)}</td>
                    <td className="px-3 py-4 text-sm text-[var(--text-secondary)]">{formatDate(reservation.expires_at)}</td>
                    <td className="max-w-56 px-3 py-4 text-sm text-[var(--text-secondary)]"><span className="line-clamp-2">{reservation.notes || "—"}</span></td>
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
    </AppShell>
  );
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("ar-SA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
