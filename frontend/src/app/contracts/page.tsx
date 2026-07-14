"use client";

import { FileSignature } from "lucide-react";

import { ModulePlaceholder } from "@/components/layout/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      titleKey="pages.contracts.title"
      descriptionKey="pages.contracts.description"
      icon={FileSignature}
    />
  );
}
