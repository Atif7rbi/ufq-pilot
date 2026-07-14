import type { TranslationKey } from "@/i18n/types";

export type PageTitleDefinition = {
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
};

export const pageTitles: Record<
  string,
  PageTitleDefinition
> = {
  "/": {
    titleKey: "dashboard.title",
    descriptionKey: "dashboard.description",
  },
  "/crm": {
    titleKey: "pages.crm.title",
    descriptionKey: "pages.crm.description",
  },
  "/customers": {
    titleKey: "pages.customers.title",
    descriptionKey: "pages.customers.description",
  },
  "/reservations": {
    titleKey: "pages.reservations.title",
    descriptionKey: "pages.reservations.description",
  },
  "/contracts": {
    titleKey: "pages.contracts.title",
    descriptionKey: "pages.contracts.description",
  },
  "/projects": {
    titleKey: "pages.projects.title",
    descriptionKey: "pages.projects.description",
  },
  "/units": {
    titleKey: "pages.units.title",
    descriptionKey: "pages.units.description",
  },
  "/contractors": {
    titleKey: "pages.contractors.title",
    descriptionKey: "pages.contractors.description",
  },
  "/contractor-statements": {
    titleKey: "pages.contractorStatements.title",
    descriptionKey: "pages.contractorStatements.description",
  },
  "/collections": {
    titleKey: "pages.collections.title",
    descriptionKey: "pages.collections.description",
  },
  "/expenses": {
    titleKey: "pages.expenses.title",
    descriptionKey: "pages.expenses.description",
  },
  "/financial-reports": {
    titleKey: "pages.financialReports.title",
    descriptionKey: "pages.financialReports.description",
  },
  "/employees": {
    titleKey: "pages.employees.title",
    descriptionKey: "pages.employees.description",
  },
  "/users": {
    titleKey: "pages.users.title",
    descriptionKey: "pages.users.description",
  },
  "/reports": {
    titleKey: "pages.reports.title",
    descriptionKey: "pages.reports.description",
  },
  "/settings": {
    titleKey: "pages.settings.title",
    descriptionKey: "pages.settings.description",
  },
};

export function getPageTitle(
  pathname: string
): PageTitleDefinition {
  const normalizedPath =
    pathname !== "/" && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;

  return (
    pageTitles[normalizedPath] ?? {
      titleKey: "dashboard.title",
      descriptionKey: "dashboard.description",
    }
  );
}
