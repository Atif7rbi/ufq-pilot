"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AppShellContextValue = {
  isSidebarCollapsed: boolean;
  isMobileSidebarOpen: boolean;
  toggleSidebar: () => void;
  openMobileSidebar: () => void;
  closeMobileSidebar: () => void;
};

const AppShellContext =
  createContext<AppShellContextValue | null>(null);

export function AppShellProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isSidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const [isMobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((current) => !current);
  }, []);

  const openMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(true);
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      isSidebarCollapsed,
      isMobileSidebarOpen,
      toggleSidebar,
      openMobileSidebar,
      closeMobileSidebar,
    }),
    [
      isSidebarCollapsed,
      isMobileSidebarOpen,
      toggleSidebar,
      openMobileSidebar,
      closeMobileSidebar,
    ]
  );

  return (
    <AppShellContext.Provider value={value}>
      {children}
    </AppShellContext.Provider>
  );
}

export function useAppShell(): AppShellContextValue {
  const context = useContext(AppShellContext);

  if (!context) {
    throw new Error(
      "useAppShell must be used within AppShellProvider."
    );
  }

  return context;
}
