import { cn } from "@/lib/cn";

export function ProgressBar({
  value,
  total,
  className,
}: {
  value: number;
  total: number;
  className?: string;
}) {
  const pct = total === 0 ? 0 : Math.min(100, (value / total) * 100);
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={value}
      className={cn("h-[3px] w-full overflow-hidden rounded-full bg-border-strong", className)}
    >
      <div className="h-full bg-accent transition-[width] duration-300" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </header>
  );
}

export function SectionLabel({ children, count }: { children: React.ReactNode; count?: number }) {
  return (
    <h2 className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-faint">
      {children}
      {count !== undefined && <span className="tabular-nums text-muted-foreground">{count}</span>}
    </h2>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-dashed border-border-strong px-4 py-10 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}

export function ListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="animate-pulse space-y-px" aria-hidden>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 border-b border-border py-3.5">
          <div className="size-[18px] rounded-[4px] bg-surface" />
          <div className="h-3 rounded bg-surface" style={{ width: `${40 + ((i * 17) % 40)}%` }} />
        </div>
      ))}
    </div>
  );
}

export const btn = {
  base: "inline-flex h-8 items-center justify-center gap-2 rounded-md px-3 text-xs font-medium transition-colors disabled:opacity-50",
  primary: "bg-accent text-accent-foreground hover:opacity-90",
  outline: "border border-border-strong text-foreground hover:bg-surface",
  danger: "border border-danger/50 text-danger hover:bg-danger/10",
};
