"use client";

import { ChevronLeft, ChevronRight, FileText, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

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
  // 백엔드가 내려주는 fileUrl 형식을 iframe에서 로드 가능한 URL로 해석한다.
  // - 절대 URL(http/https/blob/data): 그대로 사용
  // - 백엔드 상대경로(예: "/documents/3/file"): Next.js rewrites 프록시 prefix 부착
  //   (그대로 두면 브라우저가 프론트 origin 기준으로 해석해 우리 사이트가 iframe 안에
  //   다시 로드되거나 404 발생)
  // - 그 외: 안내 메시지 표시
  const resolvedUrl = resolveBackendUrl(fileUrl);
  const isLoadable = resolvedUrl !== null;
  const iframeSrc = isLoadable
    ? initialPage
      ? `${resolvedUrl}#page=${initialPage}`
      : resolvedUrl
    : "about:blank";
  const pageLabel = initialPage ?? 1;

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
                <p className="text-[11px] text-[#717182]">{pageLabel}페이지</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="flex size-8 items-center justify-center rounded-lg text-[#717182] transition-colors hover:bg-[#f3f3f5]"
                  aria-label="이전 페이지"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="px-1 text-[12px] text-[#4a5565]">
                  p.{pageLabel}
                </span>
                <button
                  type="button"
                  className="flex size-8 items-center justify-center rounded-lg text-[#717182] transition-colors hover:bg-[#f3f3f5]"
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
                <span className="text-[#0a0a0a]">{pageLabel}페이지</span>
              </p>
            </div>

            {/* PDF body */}
            <div className="min-h-0 flex-1 bg-[#F5F5F0]">
              {isLoadable ? (
                <iframe
                  src={iframeSrc}
                  className="size-full border-none"
                  title={title}
                />
              ) : (
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
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
