"use client";

import { CalendarCheck2 } from "lucide-react";

import { ModulePlaceholder } from "@/components/layout/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      titleKey="pages.reservations.title"
      descriptionKey="pages.reservations.description"
      icon={CalendarCheck2}
    />
  );
}
