import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface InfoIconBadgeProps {
  icon: ReactNode;
  label: string;
  className?: string;
}

export function InfoIconBadge({
  className,
  icon,
  label,
}: InfoIconBadgeProps) {
  return (
    <div className={cn("flex w-12 flex-col items-center gap-3", className)}>
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-background-blue text-kmu-blue">
        <span className="inline-flex h-5 w-5 items-center justify-center">{icon}</span>
      </div>
      <span className="text-center text-xs leading-[18px] text-text-secondary">
        {label}
      </span>
    </div>
  );
}
