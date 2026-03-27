import { FileText, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { Source } from "@/types/chat";

interface SourceCardProps {
  source: Source;
}

export function SourceCard({ source }: SourceCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="flex items-start gap-3 px-3 py-3">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-secondary">
          <FileText className="size-3.5 text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">{source.title}</p>
          <div className="mt-0.5 flex items-center gap-1.5">
            <span className="rounded bg-secondary px-1.5 py-0.5 text-xs text-muted-foreground">
              {source.category}
            </span>
            <span className="text-xs text-muted-foreground">{source.page}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-border bg-secondary/30 px-4 py-2.5">
        <p className="text-xs leading-relaxed text-muted-foreground">
          {source.excerpt}
        </p>
      </div>

      <Link
        href="/resources"
        className="flex items-center justify-center gap-1.5 border-t border-border py-2.5 text-xs font-medium text-primary transition-colors hover:bg-secondary/50"
      >
        <ExternalLink className="size-3" />
        자료에서 보기
      </Link>
    </div>
  );
}
