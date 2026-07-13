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
        "h-3 w-full overflow-hidden rounded-full bg-muted transition duration-[400ms] hover:bg-muted/70 focus-visible:ring-2 focus-visible:ring-ring data-[disabled=true]:opacity-50",
        className,
      )}
      role="progressbar"
      data-disabled={disabled}
      tabIndex={0}
    >
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-[400ms] ease-out"
        style={{ width: `${normalizedValue}%` }}
      />
    </div>
  );
}

export { ProgressBar };
