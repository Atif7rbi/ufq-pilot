import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

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
          {children}
        </SystemSettingsProvider>
      </body>
    </html>
  );
}
