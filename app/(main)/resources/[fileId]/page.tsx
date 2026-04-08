import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Eye,
  Download,
  ExternalLink,
  Bot,
} from "lucide-react";
import { MOCK_DOCUMENTS } from "@/constants/mock-documents";
import type { Document } from "@/types/api/document";

export default async function ResourceFilePage({
  params,
}: {
  params: Promise<{ fileId: string }>;
}) {
  const { fileId } = await params;
  const found = MOCK_DOCUMENTS.find((doc) => doc.documentId === fileId);

  const document: Document = found ?? {
    documentId: fileId,
    title: "문서를 찾을 수 없습니다",
    category: "",
    updatedAt: "",
  };

  const hasFile = false; // TODO: API 연동 시 fileUrl 여부로 교체

  return (
    <div className="flex h-dvh flex-col bg-background">
      {/* 상단 헤더 바 */}
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background px-4">
        <Link
          href="/resources"
          className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="자료 목록으로"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <span className="text-[18px] font-semibold text-foreground">
          문서 상세
        </span>
      </header>

      {/* 본문 */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-4 py-6">
          {/* 카테고리 배지 */}
          {document.category && (
            <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {document.category}
            </span>
          )}

          {/* 제목 */}
          <h1 className="mb-3 text-xl font-bold leading-snug text-foreground">
            {document.title}
          </h1>

          {/* 메타 정보 */}
          <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {document.department && (
              <span className="font-medium text-foreground">
                {document.department}
              </span>
            )}
            {document.department && document.updatedAt && <span>·</span>}
            {document.updatedAt && <span>{document.updatedAt}</span>}
            {document.viewCount !== undefined && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Eye className="size-3.5" />
                  {document.viewCount.toLocaleString()}
                </span>
              </>
            )}
          </div>

          {/* 첨부파일 카드 */}
          <div className="mb-6 rounded-xl border border-border">
            <div className="border-b border-border px-4 py-3">
              <span className="text-sm font-medium text-foreground">
                첨부파일
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="size-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {document.title}
                  </p>
                  {document.fileSize && (
                    <p className="text-xs text-muted-foreground">
                      {document.fileSize}
                    </p>
                  )}
                </div>
              </div>
              <button
                className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
                aria-label="다운로드"
              >
                <Download className="size-3.5" />
                다운로드
              </button>
            </div>
          </div>

          {/* 본문 excerpt */}
          {document.excerpt && (
            <div className="mb-6 rounded-xl border border-border px-4 py-4">
              <p className="mb-3 text-sm font-medium text-foreground">내용 요약</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {document.excerpt}
              </p>
            </div>
          )}

          {/* 뷰어에서 열기 */}
          <div className="mb-6 flex items-center justify-between rounded-xl border border-border px-4 py-4">
            <p className="text-sm text-muted-foreground">
              {hasFile
                ? "문서를 전체 화면으로 확인하세요."
                : "API 연동 후 PDF 뷰어에서 열 수 있습니다."}
            </p>
            <button
              className="flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              disabled={!hasFile}
              aria-label="뷰어에서 열기"
            >
              <ExternalLink className="size-4" />
              뷰어에서 열기
            </button>
          </div>

          {/* 통계 푸터 */}
          <div className="flex flex-wrap items-center gap-6 rounded-xl border border-border px-4 py-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Eye className="size-4" />
              <span>조회수</span>
              <span className="font-medium text-foreground">
                {document.viewCount?.toLocaleString() ?? "0"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bot className="size-4" />
              <span>AI 참조 횟수</span>
              <span className="font-medium text-foreground">
                {document.refCount?.toLocaleString() ?? "0"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
