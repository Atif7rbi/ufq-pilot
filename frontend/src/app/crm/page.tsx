"use client";

import { UsersRound } from "lucide-react";

import { ModulePlaceholder } from "@/components/layout/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      titleKey="pages.crm.title"
      descriptionKey="pages.crm.description"
      icon={UsersRound}
    />
  );
}
