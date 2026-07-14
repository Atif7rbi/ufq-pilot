"use client";

import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/providers/AuthProvider";

const roleLabels: Record<string, string> = {
  system_owner: "مالك النظام",
  administrator: "مدير الشركة",
  project_manager: "مدير مشاريع",
  sales: "المبيعات",
  accountant: "محاسب",
  employee: "موظف",
};

export function Topbar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async (): Promise<void> => {
    await logout();
    router.replace("/login");
  };

  const userInitial = user?.name.trim().slice(0, 1) || "م";

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex min-h-18 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-medium text-slate-500">
            نظرة عامة
          </p>
          <h1 className="text-xl font-bold text-slate-950">
            لوحة التحكم
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="success">النظام يعمل</Badge>

          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold text-slate-900">
              {user?.name ?? "المستخدم"}
            </p>
            <p className="text-xs text-slate-500">
              {user
                ? roleLabels[user.role] ?? user.role
                : ""}
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-700">
            {userInitial}
          </div>

          <Button
            variant="ghost"
            onClick={handleLogout}
          >
            خروج
          </Button>
        </div>
      </div>
    </header>
  );
}
