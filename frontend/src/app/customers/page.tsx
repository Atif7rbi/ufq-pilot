"use client";

import { Users } from "lucide-react";

import { ModulePlaceholder } from "@/components/layout/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      titleKey="pages.customers.title"
      descriptionKey="pages.customers.description"
      icon={Users}
    />
  );
}
