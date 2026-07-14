"use client";

import {
  Moon,
  Sun,
} from "lucide-react";

import { useTheme } from "@/providers/ThemeProvider";

export function ThemeToggle() {
  const {
    isDark,
    toggleTheme,
  } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        isDark
          ? "تفعيل الوضع الفاتح"
          : "تفعيل الوضع الداكن"
      }
      title={
        isDark
          ? "الوضع الفاتح"
          : "الوضع الداكن"
      }
      className={[
        "motion-ui inline-flex h-10 w-10 items-center justify-center",
        "rounded-xl border",
        "app-surface app-border app-text-secondary",
        "hover:-translate-y-0.5 hover:app-shadow-sm",
      ].join(" ")}
    >
      {isDark ? (
        <Sun size={18} strokeWidth={1.8} />
      ) : (
        <Moon size={18} strokeWidth={1.8} />
      )}
    </button>
  );
}
