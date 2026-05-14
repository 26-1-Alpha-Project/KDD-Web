import { ShieldCheck, ShieldAlert, ShieldQuestion } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ConfidenceLevel } from "@/types/chat";

const CONFIG: Record<
  ConfidenceLevel,
  { label: string; icon: typeof ShieldCheck; className: string }
> = {
  high: {
    label: "높은 신뢰도",
    icon: ShieldCheck,
    className: "bg-emerald-50 text-emerald-700",
  },
  medium: {
    label: "보통 신뢰도",
    icon: ShieldAlert,
    className: "bg-amber-50 text-amber-700",
  },
  low: {
    label: "낮은 신뢰도",
    icon: ShieldQuestion,
    className: "bg-red-50 text-red-600",
  },
};

interface ConfidenceBadgeProps {
  level: ConfidenceLevel;
}

export function ConfidenceBadge({ level }: ConfidenceBadgeProps) {
  const { label, icon: Icon, className } = CONFIG[level];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        className
      )}
    >
      <Icon className="size-3" />
      {label}
    </span>
  );
}
