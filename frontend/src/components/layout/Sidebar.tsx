import { brand } from "@/config/brand";

const navigation = [
  { label: "لوحة التحكم", href: "#", active: true },
  { label: "إدارة العملاء", href: "#", active: false },
  { label: "المشاريع", href: "#", active: false },
  { label: "الوحدات العقارية", href: "#", active: false },
  { label: "الحجوزات", href: "#", active: false },
  { label: "العقود", href: "#", active: false },
  { label: "الأقساط والتحصيلات", href: "#", active: false },
  { label: "المصروفات", href: "#", active: false },
  { label: "المقاولين", href: "#", active: false },
  { label: "الموظفين والمهام", href: "#", active: false },
  { label: "التقارير", href: "#", active: false },
  { label: "الإعدادات", href: "#", active: false },
];

export function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-l border-slate-200 bg-white lg:block">
      <div className="sticky top-0 flex min-h-screen flex-col">
        <div className="border-b border-slate-100 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-lg font-bold text-white">
              أ
            </div>

            <div>
              <p className="text-lg font-bold text-slate-950">
                {brand.applicationName}
              </p>
              <p className="text-xs text-slate-500">
                التطوير العقاري
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5">
          {navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={[
                "flex min-h-11 items-center rounded-xl px-4 text-sm font-medium",
                "transition-colors",
                item.active
                  ? "bg-slate-950 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
              ].join(" ")}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="border-t border-slate-100 px-5 py-4">
          <p className="text-xs leading-5 text-slate-400">
            {brand.companyNameAr}
          </p>
        </div>
      </div>
    </aside>
  );
}
