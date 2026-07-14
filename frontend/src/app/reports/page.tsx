"use client";

import { BarChart3 } from "lucide-react";

import { ModulePlaceholder } from "@/components/layout/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      titleKey="pages.reports.title"
      descriptionKey="pages.reports.description"
      icon={BarChart3}
    />
  );
}
