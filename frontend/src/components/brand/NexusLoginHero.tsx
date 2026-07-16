"use client";

import {
  BarChart3,
  Grid2X2,
  ReceiptText,
  Settings,
  UserRoundPlus,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

type NexusLoginHeroProps = {
  isArabic: boolean;
};

type Feature = {
  icon: LucideIcon;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
};

const features: Feature[] = [
  {
    icon: Grid2X2,
    titleAr: "إدارة المشاريع",
    titleEn: "Project Management",
    descriptionAr: "تخطيط ومتابعة جميع مشاريعك بسهولة وذكاء",
    descriptionEn: "Plan and track every project with clarity",
  },
  {
    icon: UsersRound,
    titleAr: "إدارة العملاء",
    titleEn: "Customer Management",
    descriptionAr: "علاقات أقوى مع عملائك من منصة واحدة",
    descriptionEn: "Stronger customer relationships in one place",
  },
  {
    icon: BarChart3,
    titleAr: "التقارير والتحليلات",
    titleEn: "Reports & Analytics",
    descriptionAr: "تقارير ذكية تساعدك على اتخاذ قرارات أفضل",
    descriptionEn: "Intelligent insights for better decisions",
  },
  {
    icon: ReceiptText,
    titleAr: "المحاسبة والمالية",
    titleEn: "Finance & Accounting",
    descriptionAr: "إدارة مالية متكاملة بدقة وسهولة",
    descriptionEn: "Accurate and integrated financial management",
  },
  {
    icon: UserRoundPlus,
    titleAr: "الموارد البشرية",
    titleEn: "Human Resources",
    descriptionAr: "إدارة فريقك وإنجازاته وأدائه بكفاءة",
    descriptionEn: "Manage your team and performance efficiently",
  },
  {
    icon: Settings,
    titleAr: "إعدادات متقدمة",
    titleEn: "Advanced Settings",
    descriptionAr: "نظام مرن وآمن يتكيف مع احتياجاتك",
    descriptionEn: "A secure system tailored to your needs",
  },
];

function NexusHeroLogo() {
  return (
    <svg
      viewBox="0 0 180 180"
      fill="none"
      aria-hidden="true"
      className="h-36 w-36 drop-shadow-[0_22px_48px_rgba(111,45,255,0.68)] xl:h-44 xl:w-44 2xl:h-48 2xl:w-48"
    >
      <defs>
        <linearGradient
          id="hero-nexus-a"
          x1="18"
          y1="12"
          x2="127"
          y2="166"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F046FF" />
          <stop offset="0.42" stopColor="#8B16F5" />
          <stop offset="1" stopColor="#315CFF" />
        </linearGradient>

        <linearGradient
          id="hero-nexus-b"
          x1="77"
          y1="36"
          x2="163"
          y2="153"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#D32BFF" />
          <stop offset="0.5" stopColor="#5C22FF" />
          <stop offset="1" stopColor="#08D9FF" />
        </linearGradient>

        <filter
          id="hero-glow"
          x="-40%"
          y="-40%"
          width="180%"
          height="180%"
        >
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter="url(#hero-glow)">
        <path
          d="M24 49L57 27L111 66V108L78 85V151L24 112V49Z"
          fill="url(#hero-nexus-a)"
        />
        <path
          d="M156 27V130L123 152L69 113V71L102 94V27L156 66V27Z"
          fill="url(#hero-nexus-b)"
        />
        <path
          d="M78 85L102 102V94L69 71V113L123 152V137L78 105V85Z"
          fill="#2344E8"
          fillOpacity="0.78"
        />
      </g>
    </svg>
  );
}

export function NexusLoginHero({
  isArabic,
}: NexusLoginHeroProps) {
  return (
    <div className="nexus-login-hero-enter flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-[940px] -translate-y-8 flex-col items-center px-8 pb-32 pt-10 text-center xl:px-12">
        <NexusHeroLogo />

        <h1
          className="mt-2 text-6xl font-black tracking-[-0.055em] text-white drop-shadow-[0_10px_32px_rgba(112,40,220,0.22)] xl:text-7xl 2xl:text-8xl"
          dir="ltr"
        >
          Nexus
          <span className="bg-gradient-to-r from-fuchsia-500 via-violet-500 to-blue-500 bg-clip-text text-transparent">
            OS
          </span>
        </h1>

        <p className="mt-3 text-xl font-medium text-white/75 xl:text-2xl 2xl:text-3xl">
          {isArabic
            ? "نظام تشغيل الأعمال المتكامل"
            : "Integrated Business Operating System"}
        </p>

        <p
          className="mt-3 text-xs font-semibold tracking-[0.32em] text-white/75 xl:text-sm"
          dir="ltr"
        >
          <span className="text-fuchsia-500">—•</span>
          {" CONNECT "}
          <span className="text-fuchsia-500">•</span>
          {" MANAGE "}
          <span className="text-fuchsia-500">•</span>
          {" GROW "}
          <span className="text-fuchsia-500">•—</span>
        </p>

        <div className="mt-10 grid w-full grid-cols-3 gap-y-8 xl:mt-12 xl:grid-cols-6 xl:gap-y-0">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.titleEn}
                className={[
                  "relative flex min-w-0 flex-col items-center px-3",
                  index > 0
                    ? "xl:border-s xl:border-violet-500/35"
                    : "",
                ].join(" ")}
              >
                <Icon
                  size={42}
                  strokeWidth={1.65}
                  className="text-fuchsia-500 drop-shadow-[0_0_12px_rgba(192,38,211,0.65)] 2xl:h-12 2xl:w-12"
                />

                <h2 className="mt-3 text-sm font-bold text-white xl:text-[13px] 2xl:text-sm">
                  {isArabic
                    ? feature.titleAr
                    : feature.titleEn}
                </h2>

                <p className="mt-2 hidden max-w-36 text-[10px] leading-5 text-white/55 2xl:block">
                  {isArabic
                    ? feature.descriptionAr
                    : feature.descriptionEn}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
