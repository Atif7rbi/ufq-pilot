"use client";

import { FolderKanban } from "lucide-react";

import { ModulePlaceholder } from "@/components/layout/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      titleKey="pages.projects.title"
      descriptionKey="pages.projects.description"
      icon={FolderKanban}
    />
  );
}
