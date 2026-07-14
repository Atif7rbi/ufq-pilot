import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CalendarCheck2,
  ChartNoAxesCombined,
  ClipboardList,
  FileSignature,
  FolderKanban,
  HandCoins,
  LayoutDashboard,
  ReceiptText,
  Settings,
  ShieldCheck,
  Users,
  UsersRound,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import type { TranslationKey } from "@/i18n/types";

export type NavigationItem = {
  labelKey: TranslationKey;
  href: string;
  icon: LucideIcon;
};

export type NavigationGroup = {
  labelKey: TranslationKey;
  items: NavigationItem[];
};

export const navigationGroups: NavigationGroup[] = [
  {
    labelKey: "navigation.home",
    items: [
      {
        labelKey: "navigation.dashboard",
        href: "/",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    labelKey: "navigation.salesAndCustomers",
    items: [
      {
        labelKey: "navigation.crm",
        href: "/crm/",
        icon: UsersRound,
      },
      {
        labelKey: "navigation.customers",
        href: "/customers/",
        icon: Users,
      },
      {
        labelKey: "navigation.reservations",
        href: "/reservations/",
        icon: CalendarCheck2,
      },
      {
        labelKey: "navigation.contracts",
        href: "/contracts/",
        icon: FileSignature,
      },
    ],
  },
  {
    labelKey: "navigation.realEstateDevelopment",
    items: [
      {
        labelKey: "navigation.projects",
        href: "/projects/",
        icon: FolderKanban,
      },
      {
        labelKey: "navigation.units",
        href: "/units/",
        icon: Building2,
      },
      {
        labelKey: "navigation.contractors",
        href: "/contractors/",
        icon: Wrench,
      },
      {
        labelKey: "navigation.contractorStatements",
        href: "/contractor-statements/",
        icon: ClipboardList,
      },
    ],
  },
  {
    labelKey: "navigation.finance",
    items: [
      {
        labelKey: "navigation.collections",
        href: "/collections/",
        icon: HandCoins,
      },
      {
        labelKey: "navigation.expenses",
        href: "/expenses/",
        icon: ReceiptText,
      },
      {
        labelKey: "navigation.financialReports",
        href: "/financial-reports/",
        icon: ChartNoAxesCombined,
      },
    ],
  },
  {
    labelKey: "navigation.administration",
    items: [
      {
        labelKey: "navigation.employeesAndTasks",
        href: "/employees/",
        icon: BriefcaseBusiness,
      },
      {
        labelKey: "navigation.usersAndPermissions",
        href: "/users/",
        icon: ShieldCheck,
      },
      {
        labelKey: "navigation.reports",
        href: "/reports/",
        icon: BarChart3,
      },
      {
        labelKey: "navigation.settings",
        href: "/settings/",
        icon: Settings,
      },
    ],
  },
];
