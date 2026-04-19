"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, FileText, Loader2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { authManager } from "@/lib/api/auth";

// PDF.js worker — pdfjs-dist 패키지에 포함된 mjs를 번들러가 별도 청크로 처리
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const BACKEND_PROXY_PREFIX = "/api/backend";

function resolveBackendUrl(fileUrl: string): string | null {
  if (!fileUrl) return null;
  if (/^(https?:|blob:|data:)/i.test(fileUrl)) return fileUrl;
  if (fileUrl.startsWith("/")) return `${BACKEND_PROXY_PREFIX}${fileUrl}`;
  return null;
}

interface PDFViewerProps {
  open: boolean;
  onClose: () => void;
  fileUrl: string;
  title: string;
  initialPage?: number;
}

export function PDFViewer({
  open,
  onClose,
  fileUrl,
  title,
  initialPage,
}: PDFViewerProps) {
  const resolvedUrl = resolveBackendUrl(fileUrl);
  const isLoadable = resolvedUrl !== null;

  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(initialPage ?? 1);
  const [loadError, setLoadError] = useState<string | null>(null);

  // 모달이 새로 열릴 때 페이지/에러 상태 초기화
  useEffect(() => {
    if (open) {
      setCurrentPage(initialPage ?? 1);
      setNumPages(0);
      setLoadError(null);
    }
  }, [open, initialPage, fileUrl]);

  // file 객체는 매 렌더 새로 만들면 react-pdf가 매번 재요청한다 — useMemo로 안정화
  const fileSource = useMemo(() => {
    if (!resolvedUrl) return null;
    const token = authManager.getToken();
    return {
      url: resolvedUrl,
      httpHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: false,
    };
  }, [resolvedUrl]);

  const handleLoadSuccess = ({ numPages: n }: { numPages: number }) => {
    setNumPages(n);
    setLoadError(null);
  };

  const handleLoadError = (err: Error) => {
    setLoadError(err.message || "문서를 불러오지 못했습니다.");
  };

  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goNext = () => setCurrentPage((p) => Math.min(numPages || p, p + 1));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-stretch bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="my-4 mx-auto flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Toolbar */}
            <div className="flex h-14 shrink-0 items-center gap-3 border-b border-black/10 bg-[#f8f9fb] px-5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#004F9F]/10">
                <FileText size={16} className="text-[#004F9F]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold text-[#0a0a0a]">
                  {title}
                </p>
                <p className="text-[11px] text-[#717182]">
                  {numPages > 0
                    ? `${currentPage} / ${numPages}페이지`
                    : `${currentPage}페이지`}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={currentPage <= 1}
                  className="flex size-8 items-center justify-center rounded-lg text-[#717182] transition-colors hover:bg-[#f3f3f5] disabled:opacity-30 disabled:hover:bg-transparent"
                  aria-label="이전 페이지"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="px-1 text-[12px] text-[#4a5565]">
                  p.{currentPage}
                </span>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={numPages > 0 && currentPage >= numPages}
                  className="flex size-8 items-center justify-center rounded-lg text-[#717182] transition-colors hover:bg-[#f3f3f5] disabled:opacity-30 disabled:hover:bg-transparent"
                  aria-label="다음 페이지"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="ml-2 flex size-8 items-center justify-center rounded-lg text-[#717182] transition-colors hover:bg-[#f3f3f5]"
                aria-label="닫기"
              >
                <X size={18} />
              </button>
            </div>

            {/* Highlight banner */}
            <div className="flex shrink-0 items-center gap-2 border-b border-[#BFDBFE] bg-[#EFF6FF] px-5 py-2.5">
              <div className="size-2 animate-pulse rounded-full bg-[#004F9F]" />
              <p className="text-[12px] font-medium text-[#004F9F]">
                AI 답변의 근거 구절 —{" "}
                <span className="text-[#0a0a0a]">{initialPage ?? 1}페이지</span>
              </p>
            </div>

            {/* PDF body */}
            <div className="min-h-0 flex-1 overflow-y-auto bg-[#F5F5F0]">
              {!isLoadable ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
                  <FileText size={40} className="text-[#9ca3af]" />
                  <p className="text-[14px] font-medium text-[#0a0a0a]">
                    PDF 뷰어는 백엔드 연동 후 제공됩니다
                  </p>
                  <p className="max-w-md text-[12px] leading-relaxed text-[#717182]">
                    문서 파일을 다운로드/스트리밍할 API 엔드포인트가 추가되면
                    이 자리에서 PDF를 직접 확인할 수 있습니다.
                  </p>
                </div>
              ) : loadError ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
                  <p className="text-[14px] font-medium text-[#0a0a0a]">
                    문서를 불러올 수 없습니다
                  </p>
                  <p className="max-w-md text-[12px] text-[#717182]">{loadError}</p>
                </div>
              ) : (
                <div className="flex justify-center py-6">
                  <Document
                    file={fileSource}
                    onLoadSuccess={handleLoadSuccess}
                    onLoadError={handleLoadError}
                    loading={
                      <div className="flex items-center gap-2 py-12 text-sm text-[#717182]">
                        <Loader2 className="size-4 animate-spin" />
                        문서를 불러오는 중입니다...
                      </div>
                    }
                  >
                    <Page
                      pageNumber={currentPage}
                      width={760}
                      renderAnnotationLayer
                      renderTextLayer
                      className="shadow-lg"
                    />
                  </Document>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
