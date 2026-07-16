"use client";

import { useRouter } from "next/navigation";
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

import { NexusBrand } from "@/components/brand/NexusBrand";
import { NexusLoginHero } from "@/components/brand/NexusLoginHero";
import { LanguageToggle } from "@/components/language/LanguageToggle";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/providers/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { t, isArabic } = useTranslation();

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
      <main className="flex min-h-screen items-center justify-center bg-[#07021b]">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/15 border-t-violet-500" />
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07021b] text-white">
      {/* Unified full-page background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_28%,rgba(126,34,206,0.34),transparent_33%),radial-gradient(circle_at_77%_42%,rgba(37,99,235,0.12),transparent_34%),radial-gradient(circle_at_50%_100%,rgba(192,38,211,0.32),transparent_38%),linear-gradient(145deg,#07021b_0%,#14042f_48%,#071225_100%)]" />

      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(103,53,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(103,53,255,0.07)_1px,transparent_1px)] [background-size:52px_52px] [mask-image:linear-gradient(to_bottom,transparent_0%,black_48%,black_100%)]" />

      {/* Full-width neon floor */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[28%] overflow-hidden">
        <div className="absolute inset-x-[-12%] bottom-[-50%] h-[122%] rounded-[50%] border border-fuchsia-500/60 bg-[radial-gradient(ellipse_at_center,rgba(212,0,255,0.32)_0%,rgba(92,24,255,0.12)_34%,transparent_68%)] shadow-[0_-20px_95px_rgba(177,0,255,0.48)]" />

        <div className="absolute inset-x-0 bottom-0 h-full origin-bottom [background-image:linear-gradient(rgba(132,49,255,0.26)_1px,transparent_1px),linear-gradient(90deg,rgba(132,49,255,0.26)_1px,transparent_1px)] [background-size:54px_32px] [transform:perspective(430px)_rotateX(63deg)_scale(1.35)]" />

        <div className="absolute bottom-[24%] left-1/2 h-1.5 w-64 -translate-x-1/2 rounded-full bg-fuchsia-300 shadow-[0_0_20px_8px_rgba(217,70,239,0.78),0_0_90px_34px_rgba(126,34,206,0.58)]" />
      </div>

      {/* Controls */}
      <div className="absolute start-5 top-5 z-40 flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      {/* Page content */}
      <div className="relative z-10 grid min-h-screen lg:grid-cols-[1.15fr_0.85fr]">
        <section className="hidden min-h-screen lg:block">
          <NexusLoginHero isArabic={isArabic} />
        </section>

        <section className="flex min-h-screen items-center justify-center px-5 py-24 sm:px-8 lg:px-12">
          <div className="nexus-login-card-enter w-full max-w-[470px] pb-24">
            <div className="mb-8 flex justify-center lg:hidden">
              <NexusBrand centered inverse />
            </div>

            <div
              className={[
                "relative overflow-hidden rounded-[34px] p-7 sm:p-10",
                "border border-violet-300/25",
                "bg-[#10152b]/68",
                "shadow-[0_34px_110px_rgba(76,29,149,0.40)]",
                "backdrop-blur-2xl",
              ].join(" ")}
            >
              <div className="pointer-events-none absolute -start-20 -top-24 h-52 w-52 rounded-full bg-violet-500/14 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -end-16 h-52 w-52 rounded-full bg-blue-500/12 blur-3xl" />

              <div className="relative">
                <div className="mb-9 flex justify-center">
                  <div className="origin-center scale-[1.18]">
                    <NexusBrand centered inverse />
                  </div>
                </div>

                <p className="text-xs font-bold text-fuchsia-400">
                  {t("auth.welcomeBack")}
                </p>

                <h1 className="mt-3 text-3xl font-bold text-white">
                  {t("auth.login")}
                </h1>

                <p className="mt-3 text-sm leading-7 text-white/60">
                  {t("auth.loginDescription")}
                </p>

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
                    className="!border-violet-300/20 !bg-[#202b49]/88 !text-white shadow-inner shadow-black/10 placeholder:!text-white/35 hover:!border-violet-300/35 focus:!border-violet-400 focus:!ring-2 focus:!ring-violet-500/20"
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
                      className="!border-violet-300/20 !bg-[#202b49]/88 !text-white shadow-inner shadow-black/10 placeholder:!text-white/35 hover:!border-violet-300/35 focus:!border-violet-400 focus:!ring-2 focus:!ring-violet-500/20"
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (current) => !current
                        )
                      }
                      className="absolute bottom-3 end-4 text-white/45 transition-colors hover:text-fuchsia-400"
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
                    <div className="rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300">
                      {error}
                    </div>
                  ) : null}

                  <Button
                    type="submit"
                    fullWidth
                    disabled={isSubmitting}
                    className={[
                      "!border-0 !text-white",
                      "!bg-gradient-to-r !from-fuchsia-600 !via-violet-600 !to-blue-600",
                      "shadow-[0_14px_38px_rgba(126,34,206,0.42)]",
                      "transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-[0_20px_52px_rgba(126,34,206,0.58)]",
                      "active:translate-y-0",
                    ].join(" ")}
                  >
                    {isSubmitting
                      ? t("auth.submitting")
                      : t("auth.submit")}
                  </Button>
                </form>
              </div>
            </div>

            <div className="mt-7 text-center" dir="ltr">
              <p className="text-xs font-semibold text-white/65">
                © {new Date().getFullYear()} NexusOS
              </p>

              <p className="mt-1 text-[10px] text-white/35">
                Business Operating System
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
