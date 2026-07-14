"use client";

import { ChartNoAxesCombined } from "lucide-react";

import { ModulePlaceholder } from "@/components/layout/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      titleKey="pages.financialReports.title"
      descriptionKey="pages.financialReports.description"
      icon={ChartNoAxesCombined}
    />
  );
}
