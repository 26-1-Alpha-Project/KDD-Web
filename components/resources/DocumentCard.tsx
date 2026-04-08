"use client";

import { FileText, Eye, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Document } from "@/types/api/document";

interface DocumentCardProps {
  document: Document;
  onClick?: () => void;
}

export function DocumentCard({ document, onClick }: DocumentCardProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 border-b border-border px-2 py-4",
        onClick && "cursor-pointer hover:bg-secondary/30"
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") onClick();
            }
          : undefined
      }
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <FileText className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">
              {document.title}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              {document.categoryPath && (
                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-primary">
                  {document.categoryPath}
                </span>
              )}
              {document.department && <span>{document.department}</span>}
              {document.department && document.updatedAt && (
                <span>·</span>
              )}
              <span>{document.updatedAt}</span>
              {document.fileSize && (
                <>
                  <span>·</span>
                  <span>{document.fileSize}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
        {document.viewCount !== undefined && (
          <span className="flex items-center gap-1">
            <Eye className="size-3.5" />
            {document.viewCount.toLocaleString()}
          </span>
        )}
        <button
          className="rounded p-1 transition-colors hover:bg-secondary"
          onClick={(e) => e.stopPropagation()}
          aria-label="다운로드"
        >
          <Download className="size-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
