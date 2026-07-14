"use client";

import { Building2 } from "lucide-react";

import { ModulePlaceholder } from "@/components/layout/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      titleKey="pages.units.title"
      descriptionKey="pages.units.description"
      icon={Building2}
    />
  );
}
