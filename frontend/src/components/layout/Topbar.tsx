import { Badge } from "@/components/ui/Badge";

export function Topbar() {
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
              مدير النظام
            </p>
            <p className="text-xs text-slate-500">
              Administrator
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-700">
            م
          </div>
        </div>
      </div>
    </header>
  );
}
