"use client";

import { HandCoins } from "lucide-react";

import { ModulePlaceholder } from "@/components/layout/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      titleKey="pages.collections.title"
      descriptionKey="pages.collections.description"
      icon={HandCoins}
    />
  );
}
