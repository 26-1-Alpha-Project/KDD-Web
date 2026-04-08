import { TrendingUp, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { PopularDocument } from "@/types/api/document";

interface PopularDocumentsProps {
  documents: PopularDocument[];
  onDocumentClick?: (documentId: string) => void;
}

export function PopularDocuments({
  documents,
  onDocumentClick,
}: PopularDocumentsProps) {
  return (
    <div className="mb-6">
      <div className="mb-3 flex items-center gap-2">
        <TrendingUp className="size-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">인기 문서</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {documents.map((doc) => (
          <button
            key={doc.documentId}
            onClick={() => onDocumentClick?.(doc.documentId)}
            className="flex shrink-0 cursor-pointer flex-col gap-1.5 rounded-lg border border-border bg-background p-3 text-left transition-colors hover:border-primary w-44"
          >
            <div className="flex items-start gap-2">
              <FileText className="size-4 shrink-0 text-muted-foreground mt-0.5" />
              <p className="line-clamp-2 text-xs font-medium text-foreground">
                {doc.title}
              </p>
            </div>
            <Badge variant="secondary" className="text-xs w-fit">
              {doc.category}
            </Badge>
          </button>
        ))}
      </div>
    </div>
  );
}
