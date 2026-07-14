import { useLanguage } from "@/providers/LanguageProvider";

export function useTranslation() {
  const {
    locale,
    direction,
    isArabic,
    setLocale,
    toggleLocale,
    t,
  } = useLanguage();

  return {
    locale,
    direction,
    isArabic,
    setLocale,
    toggleLocale,
    t,
  };
}
