"use client";

import { ClipboardList } from "lucide-react";

import { ModulePlaceholder } from "@/components/layout/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      titleKey="pages.contractorStatements.title"
      descriptionKey="pages.contractorStatements.description"
      icon={ClipboardList}
    />
  );
}
