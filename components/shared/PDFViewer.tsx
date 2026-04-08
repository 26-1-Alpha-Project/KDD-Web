"use client";

import { Download, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

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
  const iframeSrc = initialPage ? `${fileUrl}#page=${initialPage}` : fileUrl;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 z-50 flex flex-col bg-background"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="truncate text-sm font-semibold text-foreground">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="닫기"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="min-h-0 flex-1">
              <iframe
                src={iframeSrc}
                className="size-full border-none"
                title={title}
              />
            </div>

            <div className="border-t border-border px-4 py-3">
              <a
                href={fileUrl}
                download
                className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                <Download className="size-4" />
                다운로드
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
