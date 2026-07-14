import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

import { AppShellProvider } from "@/providers/AppShellProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { LanguageProvider } from "@/providers/LanguageProvider";
import { SystemSettingsProvider } from "@/providers/SystemSettingsProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";

export const metadata: Metadata = {
  title: "شركة أفق السكنية",
  description: "نظام إدارة التطوير العقاري",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="ar-SA"
      dir="rtl"
      suppressHydrationWarning
    >
      <body>
        <SystemSettingsProvider>
          <LanguageProvider>
            <ThemeProvider>
              <AuthProvider>
                <AppShellProvider>
                  {children}
                </AppShellProvider>
              </AuthProvider>
            </ThemeProvider>
          </LanguageProvider>
        </SystemSettingsProvider>
      </body>
    </html>
  );
}
