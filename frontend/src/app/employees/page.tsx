"use client";

import { BriefcaseBusiness } from "lucide-react";

import { ModulePlaceholder } from "@/components/layout/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      titleKey="pages.employees.title"
      descriptionKey="pages.employees.description"
      icon={BriefcaseBusiness}
    />
  );
}
