import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";

const summaryCards = [
  {
    label: "المشاريع",
    value: "0",
    description: "لا توجد مشاريع مسجلة",
  },
  {
    label: "العملاء",
    value: "0",
    description: "لا يوجد عملاء حتى الآن",
  },
  {
    label: "الوحدات",
    value: "0",
    description: "لا توجد وحدات عقارية",
  },
  {
    label: "العقود",
    value: "0",
    description: "لا توجد عقود مسجلة",
  },
];

export default function HomePage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">
              مرحبًا بك في نظام أفق
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              ستظهر هنا مؤشرات الشركة الفعلية بعد إدخال المشاريع والعملاء
              والوحدات والعقود.
            </p>
          </div>

          <Button>إنشاء مشروع جديد</Button>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <Card key={card.label}>
              <CardContent>
                <p className="text-sm font-medium text-slate-500">
                  {card.label}
                </p>

                <p className="mt-3 text-3xl font-bold text-slate-950">
                  {card.value}
                </p>

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <Card>
            <CardHeader
              title="المشاريع الأخيرة"
              description="آخر المشاريع المسجلة في النظام"
            />

            <CardContent>
              <EmptyState
                title="لا توجد مشاريع بعد"
                description="ابدأ بإنشاء أول مشروع عقاري، ثم أضف الوحدات والميزانية وبيانات التنفيذ."
                action={<Button variant="secondary">إضافة مشروع</Button>}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              title="آخر النشاطات"
              description="سجل العمليات الأخيرة داخل النظام"
            />

            <CardContent>
              <EmptyState
                title="لا توجد نشاطات"
                description="سيظهر هنا سجل الإضافات والتعديلات والعمليات التي ينفذها المستخدمون."
              />
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader
            title="المؤشرات المالية"
            description="ملخص التحصيلات والمصروفات والإيرادات"
          />

          <CardContent>
            <EmptyState
              title="لا توجد بيانات مالية"
              description="ستُحسب المؤشرات المالية مباشرة من الأقساط والتحصيلات والمصروفات المسجلة."
            />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
