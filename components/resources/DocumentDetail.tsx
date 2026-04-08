import { Shield, Download, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { DocumentDetail as DocumentDetailType } from "@/types/api/document";

interface DocumentDetailProps {
  document: DocumentDetailType;
}

export function DocumentDetail({ document }: DocumentDetailProps) {
  const hasFile = !!document.fileUrl;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <FileText className="mt-0.5 size-6 shrink-0 text-muted-foreground" />
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-semibold text-foreground">
            {document.title}
          </h1>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary">{document.category}</Badge>
            <span>업데이트: {document.updatedAt}</span>
            {document.fileSize && <span>{document.fileSize}</span>}
            {document.pages && <span>{document.pages}페이지</span>}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-lg bg-primary/5 px-4 py-3 text-sm text-primary">
        <Shield className="size-4 shrink-0" />
        <span>본 문서는 국민대학교 공식 규정 문서입니다.</span>
      </div>

      {hasFile ? (
        <div className="min-h-[60vh] overflow-hidden rounded-lg border border-border">
          <iframe
            src={document.fileUrl}
            className="h-full min-h-[60vh] w-full border-none"
            title={document.title}
          />
        </div>
      ) : (
        <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
          <FileText className="mb-3 size-12" />
          <p className="text-sm">문서 미리보기를 사용할 수 없습니다</p>
          <p className="mt-1 text-xs">API 연동 후 PDF 뷰어가 표시됩니다</p>
        </div>
      )}

      <a
        href={hasFile ? document.fileUrl : "#"}
        download={hasFile || undefined}
        className="flex w-fit items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
      >
        <Download className="size-4" />
        다운로드
      </a>
    </div>
  );
}
