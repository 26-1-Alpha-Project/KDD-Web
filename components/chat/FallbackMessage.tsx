import { AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { SuggestedQuestions } from "./SuggestedQuestions";

interface FallbackMessageProps {
  message: string;
  suggestedQuestions?: string[];
  onSelectQuestion?: (q: string) => void;
  type: "fallback" | "error";
}

export function FallbackMessage({
  message,
  suggestedQuestions,
  onSelectQuestion,
  type,
}: FallbackMessageProps) {
  const isFallback = type === "fallback";

  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3",
        isFallback
          ? "border-border bg-muted"
          : "border-destructive/30 bg-destructive/10"
      )}
    >
      <div className="flex items-start gap-2.5">
        {isFallback ? (
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-foreground/60" />
        ) : (
          <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
        )}
        <p className="text-sm leading-relaxed text-foreground">{message}</p>
      </div>

      {isFallback && suggestedQuestions && suggestedQuestions.length > 0 && onSelectQuestion && (
        <div className="mt-3">
          <SuggestedQuestions
            questions={suggestedQuestions}
            onSelect={onSelectQuestion}
          />
        </div>
      )}
    </div>
  );
}
