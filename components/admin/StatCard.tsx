import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
}

export function StatCard({ title, value, icon: Icon, description }: StatCardProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">{title}</span>
          <span className="text-2xl font-bold text-foreground">
            {typeof value === "number" ? value.toLocaleString() : value}
          </span>
          {description && (
            <span className="text-xs text-muted-foreground">{description}</span>
          )}
        </div>
        <div className="rounded-lg bg-primary/10 p-2 text-primary">
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
}
