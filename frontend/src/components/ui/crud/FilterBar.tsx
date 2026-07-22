import type { ReactNode } from "react";

type FilterBarProps = {
  title: string;
  icon: ReactNode;
  children: ReactNode;
};

export function FilterBar({
  title,
  icon,
  children,
}: FilterBarProps) {
  return (
    <div className="p-4 sm:p-5">
      <div className="mb-4 flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-bold text-[var(--text-primary)]">
          {title}
        </h3>
      </div>

      {children}
    </div>
  );
}
