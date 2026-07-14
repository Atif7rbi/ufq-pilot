import type {
  InputHTMLAttributes,
  ReactNode,
} from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string | null;
  leading?: ReactNode;
};

export function Input({
  label,
  error,
  leading,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id ?? props.name;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <div className="relative">
        {leading ? (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400">
            {leading}
          </div>
        ) : null}

        <input
          id={inputId}
          className={[
            "h-12 w-full rounded-xl border bg-white px-4 text-sm",
            "text-slate-950 outline-none transition",
            "placeholder:text-slate-400",
            "focus:border-slate-500 focus:ring-2 focus:ring-slate-200",
            error
              ? "border-red-400"
              : "border-slate-300",
            leading ? "pr-11" : "",
            className,
          ].join(" ")}
          {...props}
        />
      </div>

      {error ? (
        <p className="mt-2 text-xs font-medium text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
