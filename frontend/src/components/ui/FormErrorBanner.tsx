type FormErrorBannerProps = {
  message: string | null;
};

export function FormErrorBanner({
  message,
}: FormErrorBannerProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      role="alert"
      className="rounded-xl border border-[var(--danger)]/25 bg-[var(--danger-soft)] px-4 py-3 text-sm font-semibold text-[var(--danger)]"
    >
      {message}
    </div>
  );
}
