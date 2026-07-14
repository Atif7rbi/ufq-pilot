"use client";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";
import {
  useEffect,
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";

import { CompanyBrand } from "@/components/brand/CompanyBrand";
import { LanguageToggle } from "@/components/language/LanguageToggle";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/providers/AuthProvider";
import { useSystemSettings } from "@/providers/SystemSettingsProvider";

export default function LoginPage() {
  const router = useRouter();
  const settings = useSystemSettings();

  const {
    t,
    isArabic,
  } = useTranslation();

  const {
    login,
    isAuthenticated,
    isLoading,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/");
    }
  }, [
    isAuthenticated,
    isLoading,
    router,
  ]);

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
          : t("auth.loginFailed")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--app-bg)]">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--brand-gold)]" />
      </main>
    );
  }

  const companyName = isArabic
    ? settings.company_name_ar
    : settings.company_name_en ??
      settings.company_name_ar;

  const companyTagline = isArabic
    ? settings.company_tagline_ar
    : settings.company_tagline_en;

  const featureLabels = [
    t("navigation.projects"),
    t("navigation.contracts"),
    t("navigation.collections"),
  ];

  return (
    <main className="relative min-h-screen bg-[var(--app-bg)]">
      <div className="absolute end-5 top-5 z-20 flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-[#0c1728] lg:flex lg:items-center lg:justify-center">
          <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,#d2a23b_0,transparent_24%),radial-gradient(circle_at_80%_70%,#42658f_0,transparent_32%)]" />

          <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:48px_48px]" />

          <div className="relative max-w-xl px-12 text-white">
            <div className="inline-flex rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <CompanyBrand variant="inverse" />
            </div>

            <p className="mt-14 text-sm font-bold text-[#e1b44f]">
              {t("auth.platformLabel")}
            </p>

            <h1 className="mt-5 text-5xl font-bold leading-[1.3]">
              {t("auth.heroTitleLine1")}
              <br />
              {t("auth.heroTitleLine2")}
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-white/65">
              {t("auth.heroDescription")}
            </p>

            <div className="mt-12 flex flex-wrap gap-3">
              {featureLabels.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/70"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-12 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-10 lg:hidden">
              <CompanyBrand />
            </div>

            <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-lg)] sm:p-9">
              <div>
                <p className="text-xs font-bold text-[var(--brand-gold-strong)]">
                  {t("auth.welcomeBack")}
                </p>

                <h2 className="mt-3 text-3xl font-bold text-[var(--text-primary)]">
                  {t("auth.login")}
                </h2>

                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                  {t("auth.loginDescription")}
                </p>
              </div>

              <form
                className="mt-8 space-y-5"
                onSubmit={handleSubmit}
              >
                <Input
                  label={t("auth.email")}
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder={t(
                    "auth.emailPlaceholder"
                  )}
                  leading={<Mail size={18} />}
                  required
                />

                <div className="relative">
                  <Input
                    label={t("auth.password")}
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder={t(
                      "auth.passwordPlaceholder"
                    )}
                    leading={
                      <LockKeyhole size={18} />
                    }
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current
                      )
                    }
                    className="absolute bottom-3 end-4 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    aria-label={t(
                      "auth.showOrHidePassword"
                    )}
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {error ? (
                  <div className="rounded-xl border border-[var(--danger)]/25 bg-[var(--danger-soft)] px-4 py-3 text-sm font-semibold text-[var(--danger)]">
                    {error}
                  </div>
                ) : null}

                <Button
                  type="submit"
                  fullWidth
                  disabled={isSubmitting}
                  className="!bg-[var(--brand-gold)] !text-white hover:!bg-[var(--brand-gold-strong)]"
                >
                  {isSubmitting
                    ? t("auth.submitting")
                    : t("auth.submit")}
                </Button>
              </form>
            </div>

            <p className="mt-7 text-center text-xs text-[var(--text-muted)]">
              {companyName}
              {companyTagline
                ? ` — ${companyTagline}`
                : ""}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
