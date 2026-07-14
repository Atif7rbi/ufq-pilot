"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  X,
} from "lucide-react";

import { CompanyBrand } from "@/components/brand/CompanyBrand";
import { navigationGroups } from "@/config/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { useAppShell } from "@/providers/AppShellProvider";

function normalizePath(path: string): string {
  if (path === "/") {
    return "/";
  }

  return path.endsWith("/")
    ? path.slice(0, -1)
    : path;
}

function isCurrentPath(
  pathname: string,
  href: string
): boolean {
  return normalizePath(pathname) === normalizePath(href);
}

type SidebarContentProps = {
  mobile?: boolean;
};

function SidebarContent({
  mobile = false,
}: SidebarContentProps) {
  const pathname = usePathname();

  const {
    isArabic,
    t,
  } = useTranslation();

  const {
    isSidebarCollapsed,
    toggleSidebar,
    closeMobileSidebar,
  } = useAppShell();

  const collapsed =
    !mobile && isSidebarCollapsed;

  const ActiveChevron = isArabic
    ? ChevronLeft
    : ChevronRight;

  const CollapseIcon = isArabic
    ? PanelRightClose
    : PanelLeftClose;

  const ExpandIcon = isArabic
    ? PanelRightOpen
    : PanelLeftOpen;

  return (
    <>
      <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-[var(--border)] px-4">
        <CompanyBrand
          compact={collapsed}
          hideText={collapsed}
        />

        {mobile ? (
          <button
            type="button"
            onClick={closeMobileSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]"
            aria-label={t("navigation.closeSidebar")}
          >
            <X size={19} />
          </button>
        ) : null}
      </div>

      <nav className="sidebar-scroll flex-1 overflow-y-auto px-3 py-5">
        <div className="space-y-6">
          {navigationGroups.map((group) => (
            <section key={group.labelKey}>
              {!collapsed ? (
                <p className="mb-2 px-3 text-[10px] font-bold text-[var(--sidebar-heading)]">
                  {t(group.labelKey)}
                </p>
              ) : null}

              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = isCurrentPath(
                    pathname,
                    item.href
                  );

                  const Icon = item.icon;
                  const label = t(item.labelKey);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={collapsed ? label : undefined}
                      onClick={
                        mobile
                          ? closeMobileSidebar
                          : undefined
                      }
                      className={[
                        "motion-ui group relative flex min-h-10 items-center rounded-xl",
                        collapsed
                          ? "justify-center px-2"
                          : "gap-3 px-3",
                        "text-[13px] font-semibold",
                        active
                          ? "bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)]"
                          : "text-[var(--sidebar-text)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]",
                      ].join(" ")}
                    >
                      {active ? (
                        <span
                          className={[
                            "absolute h-6 w-[3px] bg-[var(--brand-gold)]",
                            isArabic
                              ? "-right-3 rounded-l-full"
                              : "-left-3 rounded-r-full",
                          ].join(" ")}
                        />
                      ) : null}

                      <Icon
                        size={18}
                        strokeWidth={active ? 2 : 1.7}
                        className={
                          active
                            ? "shrink-0 text-[var(--brand-gold-strong)]"
                            : "shrink-0 text-[var(--text-muted)] group-hover:text-[var(--text-primary)]"
                        }
                      />

                      {!collapsed ? (
                        <>
                          <span className="min-w-0 flex-1 truncate">
                            {label}
                          </span>

                          {active ? (
                            <ActiveChevron
                              size={14}
                              className="text-[var(--brand-gold)]"
                            />
                          ) : null}
                        </>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </nav>

      {!mobile ? (
        <div className="shrink-0 border-t border-[var(--border)] px-3 py-4">
          <button
            type="button"
            onClick={toggleSidebar}
            title={
              collapsed
                ? t("navigation.expandSidebar")
                : t("navigation.collapseSidebar")
            }
            className={[
              "motion-ui flex h-10 w-full items-center rounded-xl",
              collapsed
                ? "justify-center"
                : "gap-3 px-3",
              "text-xs font-semibold text-[var(--text-secondary)]",
              "hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]",
            ].join(" ")}
          >
            {collapsed ? (
              <ExpandIcon size={18} />
            ) : (
              <>
                <CollapseIcon size={18} />
                <span>
                  {t("navigation.collapseSidebar")}
                </span>
              </>
            )}
          </button>
        </div>
      ) : null}
    </>
  );
}

export function Sidebar() {
  const {
    isArabic,
  } = useTranslation();

  const {
    isSidebarCollapsed,
    isMobileSidebarOpen,
    closeMobileSidebar,
  } = useAppShell();

  return (
    <>
      <aside
        className={[
          "hidden h-screen shrink-0 flex-col",
          "border-[var(--border)] bg-[var(--sidebar-bg)]",
          "transition-[width] duration-200",
          "lg:sticky lg:top-0 lg:flex",
          isArabic ? "border-l" : "border-r",
          isSidebarCollapsed
            ? "w-[82px]"
            : "w-[252px]",
        ].join(" ")}
      >
        <SidebarContent />
      </aside>

      {isMobileSidebarOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={closeMobileSidebar}
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]"
          />

          <aside
            className={[
              "absolute inset-y-0 flex w-[286px] flex-col",
              "border-[var(--border)] bg-[var(--sidebar-bg)]",
              "shadow-[var(--shadow-lg)]",
              isArabic
                ? "right-0 border-l"
                : "left-0 border-r",
            ].join(" ")}
          >
            <SidebarContent mobile />
          </aside>
        </div>
      ) : null}
    </>
  );
}
