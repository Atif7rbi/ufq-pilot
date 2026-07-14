"use client";

import { ReceiptText } from "lucide-react";

import { ModulePlaceholder } from "@/components/layout/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      titleKey="pages.expenses.title"
      descriptionKey="pages.expenses.description"
      icon={ReceiptText}
    />
  );
}
