import type {
  FormHTMLAttributes,
  ReactNode,
  RefObject,
} from "react";

import { FormErrorBanner } from "@/components/ui/FormErrorBanner";

type FormShellProps = FormHTMLAttributes<HTMLFormElement> & {
  formRef: RefObject<HTMLFormElement | null>;
  error?: string | null;
  children: ReactNode;
  footer?: ReactNode;
  bodyClassName?: string;
};

export function FormShell({
  formRef,
  error = null,
  children,
  footer,
  bodyClassName = "",
  className = "",
  ...props
}: FormShellProps) {
  return (
    <form
      ref={formRef}
      className={[
        "min-h-0 flex-1 overflow-y-auto",
        className,
      ].join(" ")}
      {...props}
    >
      <div
        className={[
          "space-y-5 px-5 py-6 sm:px-7",
          bodyClassName,
        ].join(" ")}
      >
        <FormErrorBanner message={error} />
        {children}
      </div>
      {footer}
    </form>
  );
}
