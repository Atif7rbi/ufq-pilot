"use client";

import { Wrench } from "lucide-react";

import { ModulePlaceholder } from "@/components/layout/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      titleKey="pages.contractors.title"
      descriptionKey="pages.contractors.description"
      icon={Wrench}
    />
  );
}
