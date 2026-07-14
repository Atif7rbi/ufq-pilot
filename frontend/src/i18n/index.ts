import { arSA } from "@/i18n/ar-SA";
import { enUS } from "@/i18n/en-US";
import type {
  AppLocale,
  TextDirection,
  TranslationDictionary,
} from "@/i18n/types";

export const DEFAULT_LOCALE: AppLocale = "ar-SA";

export const dictionaries: Record<
  AppLocale,
  TranslationDictionary
> = {
  "ar-SA": arSA,
  "en-US": enUS,
};

export function getDirection(
  locale: AppLocale
): TextDirection {
  return locale === "ar-SA" ? "rtl" : "ltr";
}
