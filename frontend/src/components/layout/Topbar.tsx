"use client";

import {
  Bell,
  ChevronDown,
  Menu,
  Search,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { LanguageToggle } from "@/components/language/LanguageToggle";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { getPageTitle } from "@/config/page-titles";
import { useTranslation } from "@/hooks/useTranslation";
import { useAppShell } from "@/providers/AppShellProvider";
import { useAuth } from "@/providers/AuthProvider";

const roleTranslationKeys = {
  system_owner: "roles.systemOwner",
  administrator: "roles.administrator",
  project_manager: "roles.projectManager",
  sales: "roles.sales",
  accountant: "roles.accountant",
  employee: "roles.employee",
} as const;

export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();

  const {
    t,
  } = useTranslation();

  const {
    user,
    logout,
  } = useAuth();

  const {
    openMobileSidebar,
  } = useAppShell();

  const page = getPageTitle(pathname);

  const userInitial =
    user?.name.trim().slice(0, 1).toUpperCase() || "U";

  const userRoleLabel = user
    ? t(
        roleTranslationKeys[
          user.role as keyof typeof roleTranslationKeys
        ] ?? "roles.employee"
      )
    : "";

  const handleLogout = async (): Promise<void> => {
    await logout();
    router.replace("/login/");
  };

  return (
    <>
      <header
        className={[
          "sticky top-0 z-30 border-b",
          "border-[var(--border)] bg-[color:var(--surface)]/95",
          "backdrop-blur-xl",
        ].join(" ")}
      >
        <div className="flex h-[76px] items-center gap-4 px-4 sm:px-6 lg:px-7">
          <button
            type="button"
            onClick={openMobileSidebar}
            className={[
              "motion-ui inline-flex h-10 w-10 shrink-0 items-center justify-center",
              "rounded-xl border border-[var(--border)]",
              "text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]",
              "lg:hidden",
            ].join(" ")}
            aria-label={t("navigation.openSidebar")}
          >
            <Menu size={20} />
          </button>

          <div className="hidden min-w-0 flex-1 md:block">
            <div className="relative mx-auto max-w-xl">
              <Search
                size={17}
                className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              />

              <input
                type="search"
                placeholder={t("common.search")}
                className={[
                  "h-11 w-full rounded-xl border border-[var(--border)]",
                  "bg-[var(--surface-soft)] ps-11 pe-16",
                  "text-sm text-[var(--text-primary)] outline-none",
                  "placeholder:text-[var(--text-muted)]",
                  "focus:border-[var(--brand-gold)]",
                ].join(" ")}
              />

              <kbd className="absolute end-3 top-1/2 -translate-y-1/2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-[10px] text-[var(--text-muted)]">
                ⌘ K
              </kbd>
            </div>
          </div>

          <div className="ms-auto flex items-center gap-2">
            <button
              type="button"
              className={[
                "motion-ui relative inline-flex h-10 w-10 items-center justify-center",
                "rounded-xl border border-[var(--border)]",
                "text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]",
              ].join(" ")}
              aria-label="Notifications"
            >
              <Bell size={18} strokeWidth={1.8} />

              <span className="absolute -start-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[var(--surface)] bg-[var(--brand-gold)] px-1 text-[9px] font-bold text-white">
                0
              </span>
            </button>

            <LanguageToggle compact />

            <ThemeToggle />

            <div className="mx-1 hidden h-8 w-px bg-[var(--border)] sm:block" />

            <div className="group relative">
              <button
                type="button"
                className={[
                  "motion-ui flex items-center gap-3 rounded-xl px-2 py-1.5",
                  "hover:bg-[var(--surface-muted)]",
                ].join(" ")}
              >
                <div className="hidden text-start sm:block">
                  <p className="max-w-36 truncate text-sm font-bold text-[var(--text-primary)]">
                    {user?.name ?? ""}
                  </p>
                  <p className="mt-0.5 text-[10px] font-medium text-[var(--text-secondary)]">
                    {userRoleLabel}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-muted)] text-sm font-bold text-[var(--text-primary)]">
                  {userInitial}
                </div>

                <ChevronDown
                  size={14}
                  className="hidden text-[var(--text-muted)] sm:block"
                />
              </button>

              <div
                className={[
                  "invisible absolute end-0 top-full z-50 mt-2 w-48",
                  "translate-y-1 rounded-xl border border-[var(--border)]",
                  "bg-[var(--surface)] p-2 opacity-0 shadow-[var(--shadow-md)]",
                  "transition-all duration-150",
                  "group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100",
                  "group-hover:visible group-hover:translate-y-0 group-hover:opacity-100",
                ].join(" ")}
              >
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-lg px-3 py-2 text-start text-sm font-semibold text-[var(--danger)] hover:bg-[var(--danger-soft)]"
                >
                  {t("common.logout")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="border-b border-[var(--border)] bg-[var(--surface)] px-4 py-4 sm:px-6 lg:px-7">
        <h1 className="text-xl font-bold text-[var(--text-primary)]">
          {t(page.titleKey)}
        </h1>

        <p className="mt-1 text-xs text-[var(--text-secondary)]">
          {t(page.descriptionKey)}
        </p>
      </div>
    </>
  );
}
