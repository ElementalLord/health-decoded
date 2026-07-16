import { cn } from "@/lib/utils";

type ProgressBarProps = {
  value: number;
  label: string;
  className?: string;
  disabled?: boolean;
};

function ProgressBar({ value, label, className, disabled = false }: ProgressBarProps) {
  const normalizedValue = Math.min(100, Math.max(0, value));

  return (
    <div
      aria-label={label}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={normalizedValue}
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-muted data-[disabled=true]:opacity-50",
        className,
      )}
      role="progressbar"
      data-disabled={disabled}
    >
      <div
        className="h-full rounded-full bg-accent-warm transition-[width] duration-[var(--duration-progress)] ease-[var(--ease-standard)]"
        style={{ width: `${normalizedValue}%` }}
      />
    </div>
  );
}

export { ProgressBar };
