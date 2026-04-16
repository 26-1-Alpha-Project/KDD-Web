import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Source } from "@/types/chat";

interface SourceCardProps {
  source: Source;
  onOpenPDF?: (documentId: number, page: number) => void;
}

export function SourceCard({ source, onOpenPDF }: SourceCardProps) {
  const handleClick = () => {
    onOpenPDF?.(source.documentId, source.page);
  };

  return (
    <div
      className={cn("overflow-hidden rounded-xl border border-border", onOpenPDF && "cursor-pointer")}
      onClick={handleClick}
      role={onOpenPDF ? "button" : undefined}
      tabIndex={onOpenPDF ? 0 : undefined}
      onKeyDown={
        onOpenPDF
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") handleClick();
            }
          : undefined
      }
    >
      <div className="flex items-start gap-3 px-3 py-3 transition-colors hover:bg-secondary/40">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-secondary">
          <FileText className="size-3.5 text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">
            {source.documentTitle}
          </p>
          <div className="mt-0.5 flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">
              {source.page}페이지
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
