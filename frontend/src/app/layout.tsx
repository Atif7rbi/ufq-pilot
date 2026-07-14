import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

import { AuthProvider } from "@/providers/AuthProvider";
import { SystemSettingsProvider } from "@/providers/SystemSettingsProvider";

export const metadata: Metadata = {
  title: "نظام إدارة الأعمال",
  description: "نظام تشغيل وإدارة الأعمال",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <SystemSettingsProvider>
          <AuthProvider>{children}</AuthProvider>
        </SystemSettingsProvider>
      </body>
    </html>
  );
}
