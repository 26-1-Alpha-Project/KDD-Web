"use client";

import { useRef, useState, useCallback } from "react";
import {
  Search,
  Upload,
  RefreshCw,
  Trash2,
  Edit2,
  Check,
  X,
  ChevronDown,
  FileText,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminDocuments } from "@/hooks/useAdminDocuments";
import { DOCUMENT_CATEGORIES } from "@/constants/categories";
import type { AdminDocument } from "@/types/api/admin";

// ─── 상수 ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  AdminDocument["status"],
  { label: string; bg: string; fg: string; icon: React.ReactNode }
> = {
  uploaded: {
    label: "업로드 완료",
    bg: "bg-status-uploaded-bg",
    fg: "text-status-uploaded-fg",
    icon: <Clock size={11} />,
  },
  processing: {
    label: "처리 중",
    bg: "bg-status-processing-bg",
    fg: "text-status-processing-fg",
    icon: <Loader2 size={11} className="animate-spin" />,
  },
  completed: {
    label: "완료",
    bg: "bg-status-completed-bg",
    fg: "text-status-completed-fg",
    icon: <CheckCircle2 size={11} />,
  },
  failed: {
    label: "실패",
    bg: "bg-status-failed-bg",
    fg: "text-status-failed-fg",
    icon: <XCircle size={11} />,
  },
  reprocessing: {
    label: "재처리 중",
    bg: "bg-status-reprocessing-bg",
    fg: "text-status-reprocessing-fg",
    icon: <RotateCcw size={11} className="animate-spin" />,
  },
};

const CATEGORY_STYLE: Record<string, { bg: string; fg: string }> = {
  "SW 학사공지": { bg: "bg-topic-academic-bg", fg: "text-topic-academic-fg" },
  "SW 취업공지": { bg: "bg-topic-career-bg", fg: "text-topic-career-fg" },
  "SW 장학공지": { bg: "bg-topic-scholarship-bg", fg: "text-topic-scholarship-fg" },
  "SW 특강 및 행사": { bg: "bg-topic-event-bg", fg: "text-topic-event-fg" },
  "SW 졸업요건": { bg: "bg-topic-graduation-bg", fg: "text-topic-graduation-fg" },
  "국민대학교 공지": { bg: "bg-topic-major-bg", fg: "text-topic-major-fg" },
};

const DEFAULT_CAT_STYLE = { bg: "bg-muted", fg: "text-muted-foreground" };

const STATUS_OPTIONS = [
  { value: "all", label: "전체 상태" },
  { value: "uploaded", label: "업로드 완료" },
  { value: "processing", label: "처리 중" },
  { value: "completed", label: "완료" },
  { value: "failed", label: "실패" },
  { value: "reprocessing", label: "재처리 중" },
] as const;

// ─── 헬퍼 ───────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

// ─── SectionTitle ───────────────────────────────────────────────────────────

function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="text-base font-bold text-foreground">{title}</h3>
    </div>
  );
}

// ─── 업로드 모달 ─────────────────────────────────────────────────────────────

interface UploadModalProps {
  onClose: () => void;
}

function UploadModal({ onClose }: UploadModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState<string>(
    DOCUMENT_CATEGORIES[0].name
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-[420px] rounded-2xl bg-background p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground">문서 업로드</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        {/* 드롭존 */}
        <div
          onClick={() => inputRef.current?.click()}
          className={cn(
            "cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors",
            uploadFile
              ? "border-primary bg-accent"
              : "border-border hover:border-primary hover:bg-accent/50"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
          />
          {uploadFile ? (
            <>
              <FileText size={28} className="mx-auto mb-2 text-primary" />
              <p className="text-[13px] font-semibold text-primary">
                {uploadFile.name}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {(uploadFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </>
          ) : (
            <>
              <Upload
                size={28}
                className="mx-auto mb-2 text-muted-foreground/50"
              />
              <p className="text-[13px] text-muted-foreground">
                PDF 파일을 선택하거나 여기에 드래그하세요
              </p>
              <p className="mt-1 text-xs text-muted-foreground/70">
                PDF 파일만 지원됩니다
              </p>
            </>
          )}
        </div>

        {/* 카테고리 */}
        <div className="mt-4">
          <label className="mb-1.5 block text-[13px] font-semibold text-muted-foreground">
            카테고리
          </label>
          <div className="relative">
            <select
              className="w-full appearance-none rounded-xl border border-border bg-secondary px-3 py-2.5 pr-8 text-[13px] text-foreground outline-none focus:ring-2 focus:ring-ring"
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
            >
              {DOCUMENT_CATEGORIES.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-border py-2.5 text-[13px] text-muted-foreground transition-colors hover:bg-secondary"
          >
            취소
          </button>
          <button
            type="button"
            disabled={!uploadFile}
            onClick={() => {
              /* TODO: 실제 업로드 API 연동 */
              onClose();
            }}
            className="flex-1 rounded-xl bg-primary py-2.5 text-[13px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            업로드
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── DocsTab 메인 ────────────────────────────────────────────────────────────

export function DocsTab() {
  const {
    documents,
    searchQuery,
    setSearchQuery,
    deleteDocument,
    reprocessDocument,
  } = useAdminDocuments();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showDeleted, setShowDeleted] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const handleCategoryEdit = useCallback((id: number) => {
    setEditCategoryId((prev) => (prev === id ? null : id));
  }, []);

  const filteredDocs = documents.filter((doc) => {
    if (statusFilter !== "all" && doc.status !== statusFilter) return false;
    if (categoryFilter !== "all" && String(doc.categoryId) !== categoryFilter)
      return false;
    return true;
  });

  return (
    <div className="px-4 py-6">
      <div className="mx-auto max-w-4xl">
        {/* 헤더 */}
        <div className="mb-4 flex items-center justify-between">
          <SectionTitle
            icon={<FileText className="size-4" />}
            title="문서 관리"
          />
          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Upload size={14} />
            문서 업로드
          </button>
        </div>

        {/* 필터 */}
        <div className="mb-4 flex flex-wrap gap-2">
          {/* 검색 */}
          <div className="flex min-w-[160px] flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
            <Search
              size={14}
              className="shrink-0 text-muted-foreground"
            />
            <input
              className="flex-1 bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground/60"
              placeholder="문서명 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* 상태 필터 */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none rounded-xl border border-border bg-card px-3 py-2 pr-8 text-[13px] text-foreground outline-none focus:ring-2 focus:ring-ring"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={12}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
          </div>

          {/* 카테고리 필터 */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none rounded-xl border border-border bg-card px-3 py-2 pr-8 text-[13px] text-foreground outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">전체 카테고리</option>
              {DOCUMENT_CATEGORIES.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={12}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
          </div>

          {/* 삭제된 문서 토글 */}
          <button
            type="button"
            onClick={() => setShowDeleted((v) => !v)}
            className={cn(
              "flex items-center gap-1.5 rounded-xl border px-3 py-2 text-[13px] transition-colors",
              showDeleted
                ? "border-destructive/30 bg-destructive/5 text-destructive"
                : "border-border text-muted-foreground"
            )}
          >
            <Trash2 size={13} />
            삭제된 문서 {showDeleted ? "숨기기" : "보기"}
          </button>
        </div>

        {/* 문서 목록 */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          {/* 테이블 헤더 */}
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-3 border-b border-border bg-secondary px-4 py-2.5 text-xs font-semibold text-muted-foreground">
            <span>문서명</span>
            <span className="w-[110px] text-center">카테고리</span>
            <span className="w-[90px] text-center">상태</span>
            <span className="w-[90px] text-center">업로드일</span>
            <span className="w-[80px] text-center">작업</span>
          </div>

          {filteredDocs.length === 0 ? (
            <div className="py-16 text-center text-[13px] text-muted-foreground">
              <FileText
                size={32}
                className="mx-auto mb-2 text-muted-foreground/30"
              />
              조건에 맞는 문서가 없습니다.
            </div>
          ) : (
            filteredDocs.map((doc, i) => {
              const statusCfg = STATUS_CONFIG[doc.status];
              const catStyle =
                CATEGORY_STYLE[doc.categoryName] ?? DEFAULT_CAT_STYLE;

              return (
                <div
                  key={doc.id}
                  className={cn(
                    "grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-3 px-4 py-3 transition-colors hover:bg-secondary/50",
                    i < filteredDocs.length - 1 &&
                      "border-b border-border/40"
                  )}
                >
                  {/* 문서명 */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <FileText
                        size={14}
                        className="shrink-0 text-muted-foreground"
                      />
                      <p className="truncate text-[13px] font-medium text-foreground">
                        {doc.title}
                      </p>
                    </div>
                    {doc.size && (
                      <p className="ml-5 mt-0.5 text-[11px] text-muted-foreground">
                        {doc.size}
                      </p>
                    )}
                  </div>

                  {/* 카테고리 */}
                  <div className="flex w-[110px] justify-center">
                    {editCategoryId === doc.id ? (
                      <select
                        autoFocus
                        className="appearance-none rounded-full border border-primary bg-background px-2 py-0.5 text-[11px] outline-none"
                        defaultValue={doc.categoryId}
                        onBlur={() => setEditCategoryId(null)}
                        onChange={() => setEditCategoryId(null)}
                      >
                        {DOCUMENT_CATEGORIES.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleCategoryEdit(doc.id)}
                        className={cn(
                          "flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold transition-all hover:ring-2 hover:ring-primary/20",
                          catStyle.bg,
                          catStyle.fg
                        )}
                        title="카테고리 수정"
                      >
                        {doc.categoryName}
                        <Edit2 size={9} />
                      </button>
                    )}
                  </div>

                  {/* 상태 */}
                  <div className="flex w-[90px] justify-center">
                    <span
                      className={cn(
                        "flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                        statusCfg.bg,
                        statusCfg.fg
                      )}
                    >
                      {statusCfg.icon}
                      {statusCfg.label}
                    </span>
                  </div>

                  {/* 업로드일 */}
                  <div className="w-[90px] text-center">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(doc.createdAt)}
                    </span>
                  </div>

                  {/* 작업 */}
                  <div className="flex w-[80px] items-center justify-center gap-1.5">
                    {(doc.status === "failed" ||
                      doc.status === "completed") && (
                      <button
                        type="button"
                        onClick={() => reprocessDocument(doc.id)}
                        className="flex size-7 items-center justify-center rounded-lg bg-accent text-primary transition-colors hover:bg-accent/80"
                        title="재처리"
                      >
                        <RefreshCw size={13} />
                      </button>
                    )}
                    {confirmDeleteId === doc.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            deleteDocument(doc.id);
                            setConfirmDeleteId(null);
                          }}
                          className="flex size-6 items-center justify-center rounded-lg bg-destructive/10 text-destructive transition-colors hover:bg-destructive/20"
                          title="삭제 확인"
                        >
                          <Check size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="flex size-6 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors hover:bg-secondary/80"
                          title="취소"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(doc.id)}
                        className="flex size-7 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        title="삭제"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 카운트 */}
        <p className="mt-3 text-right text-xs text-muted-foreground">
          {filteredDocs.length}개 문서 표시 중 · 완료:{" "}
          {documents.filter((d) => d.status === "completed").length}개
        </p>
      </div>

      {showUploadModal && (
        <UploadModal onClose={() => setShowUploadModal(false)} />
      )}
    </div>
  );
}
