export function LoadingSpinner({ label = 'Loading...' }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="inline-flex items-center gap-2 text-sm text-ink/50 dark:text-white/50">
      <span aria-hidden="true" className="h-5 w-5 animate-spin rounded-full border-2 border-primary/25 border-t-primary dark:border-primary-light/25 dark:border-t-primary-light" />
      <span>{label}</span>
    </div>
  );
}
