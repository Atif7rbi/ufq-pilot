"use client";

import { ShieldCheck } from "lucide-react";

import { ModulePlaceholder } from "@/components/layout/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      titleKey="pages.users.title"
      descriptionKey="pages.users.description"
      icon={ShieldCheck}
    />
  );
}
