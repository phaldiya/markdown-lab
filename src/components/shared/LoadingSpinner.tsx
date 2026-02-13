export default function LoadingSpinner({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8">
      <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[var(--color-border)] border-t-[var(--color-primary)]" />
      <span className="text-[var(--color-text-secondary)] text-sm">{message}</span>
    </div>
  );
}
