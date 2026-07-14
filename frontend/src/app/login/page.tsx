"use client";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/providers/AuthProvider";
import { useSystemSettings } from "@/providers/SystemSettingsProvider";

export default function LoginPage() {
  const router = useRouter();
  const settings = useSystemSettings();
  const {
    login,
    isAuthenticated,
    isLoading,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    setError(null);
    setIsSubmitting(true);

    try {
      await login({
        email: email.trim(),
        password,
      });

      router.replace("/");
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "تعذر تسجيل الدخول."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">
          جارٍ التحقق من الحساب...
        </p>
      </main>
    );
  }

  return (
    <main className="grid min-h-screen bg-slate-50 lg:grid-cols-2">
      <section className="flex items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl text-xl font-bold text-white"
              style={{
                backgroundColor: settings.primary_color,
              }}
            >
              {settings.short_name_ar.slice(0, 1)}
            </div>

            <div>
              <p className="text-xl font-bold text-slate-950">
                {settings.short_name_ar}
              </p>
              <p className="text-xs text-slate-500">
                نظام إدارة الأعمال
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-7">
              <h1 className="text-2xl font-bold text-slate-950">
                تسجيل الدخول
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                أدخل بيانات حسابك للوصول إلى لوحة التحكم.
              </p>
            </div>

            <form
              className="space-y-5"
              onSubmit={handleSubmit}
            >
              <Input
                label="البريد الإلكتروني"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="name@company.com"
                required
              />

              <Input
                label="كلمة المرور"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="••••••••••••"
                required
              />

              {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              ) : null}

              <Button
                type="submit"
                fullWidth
                disabled={isSubmitting}
                style={{
                  backgroundColor: settings.primary_color,
                }}
              >
                {isSubmitting
                  ? "جارٍ تسجيل الدخول..."
                  : "دخول"}
              </Button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs leading-5 text-slate-400">
            {settings.company_name_ar}
          </p>
        </div>
      </section>

      <section
        className="hidden items-center justify-center px-12 lg:flex"
        style={{
          backgroundColor: settings.primary_color,
        }}
      >
        <div className="max-w-lg text-white">
          <p className="text-sm font-semibold text-white/70">
            منصة التشغيل المؤسسي
          </p>

          <h2 className="mt-4 text-4xl font-bold leading-tight">
            إدارة أعمال الشركة من مكان واحد
          </h2>

          <p className="mt-5 text-base leading-8 text-white/75">
            المشاريع والعملاء والوحدات والعقود والتحصيلات
            والمصروفات ضمن نظام تشغيلي موحد.
          </p>
        </div>
      </section>
    </main>
  );
}
