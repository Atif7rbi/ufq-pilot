"use client";

import { Settings } from "lucide-react";

import { ModulePlaceholder } from "@/components/layout/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      titleKey="pages.settings.title"
      descriptionKey="pages.settings.description"
      icon={Settings}
    />
  );
}
