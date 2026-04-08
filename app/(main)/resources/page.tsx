"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Search,
  Folder,
  FolderOpen,
  ChevronRight,
  FileText,
  Eye,
  Download,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MOCK_DOCUMENTS,
  MOCK_CATEGORY_TREE,
  MOCK_POPULAR_DOCUMENTS,
} from "@/constants/mock-documents";
import type { CategoryNode, Document } from "@/types/api/document";

const PAGE_SIZE = 10;

// ──────────────────────────────────────────────
// 카테고리 트리 노드
// ──────────────────────────────────────────────

interface CategoryTreeNodeProps {
  node: CategoryNode;
  expandedNodes: Set<string>;
  selectedCategoryId: string | null;
  onToggleNode: (id: string) => void;
  onSelectCategory: (id: string | null) => void;
  depth?: number;
}

function CategoryTreeNode({
  node,
  expandedNodes,
  selectedCategoryId,
  onToggleNode,
  onSelectCategory,
  depth = 0,
}: CategoryTreeNodeProps) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedNodes.has(node.categoryId);
  const isSelected = selectedCategoryId === node.categoryId;

  const handleClick = () => {
    if (hasChildren) onToggleNode(node.categoryId);
    onSelectCategory(isSelected ? null : node.categoryId);
  };

  return (
    <div>
      <button
        onClick={handleClick}
        style={{ paddingLeft: `${depth * 20 + 12}px` }}
        className={cn(
          "flex w-full items-center gap-2 py-2.5 pr-3 text-sm transition-colors rounded-lg",
          isSelected
            ? "bg-accent text-primary font-medium"
            : "text-foreground hover:bg-secondary/50"
        )}
      >
        {hasChildren ? (
          <ChevronRight
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
              isExpanded && "rotate-90"
            )}
          />
        ) : (
          <span className="size-4 shrink-0" />
        )}
        {hasChildren ? (
          isExpanded ? (
            <FolderOpen className="size-4 shrink-0 text-primary" />
          ) : (
            <Folder className="size-4 shrink-0 text-muted-foreground" />
          )
        ) : (
          <Folder className="size-4 shrink-0 text-muted-foreground" />
        )}
        <span className="flex-1 text-left">{node.name}</span>
        {node.documentCount !== undefined && (
          <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
            {node.documentCount}
          </span>
        )}
      </button>
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <CategoryTreeNode
              key={child.categoryId}
              node={child}
              expandedNodes={expandedNodes}
              selectedCategoryId={selectedCategoryId}
              onToggleNode={onToggleNode}
              onSelectCategory={onSelectCategory}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// 문서 행 (renderDocRow 패턴)
// ──────────────────────────────────────────────

interface DocRowProps {
  document: Document;
  onClick: () => void;
}

function DocRow({ document, onClick }: DocRowProps) {
  return (
    <div
      className="flex cursor-pointer items-start gap-3 border-b border-border px-4 py-3.5 transition-colors last:border-b-0 hover:bg-secondary/30"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
    >
      <FileText className="mt-0.5 size-4 shrink-0 text-primary" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{document.title}</p>
        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          {document.category && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">
              {document.category}
            </span>
          )}
          {document.department && <span>{document.department}</span>}
          {document.department && document.updatedAt && <span>·</span>}
          <span>{document.updatedAt}</span>
          {document.fileSize && (
            <>
              <span>·</span>
              <span>{document.fileSize}</span>
            </>
          )}
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

// ──────────────────────────────────────────────
// 메인 페이지
// ──────────────────────────────────────────────

export default function ResourcesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"tree" | "list">("tree");

  // 카테고리 탐색 탭 상태
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // 문서 목록 탭 상태
  const [searchQuery, setSearchQuery] = useState("");
  const [listCategory, setListCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<"latest" | "popular">("latest");
  const [page, setPage] = useState(1);

  const handleDocumentClick = (documentId: string) => {
    router.push(`/resources/${documentId}`);
  };

  const toggleNode = useCallback((categoryId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  }, []);

  const handleSelectCategory = useCallback((id: string | null) => {
    setSelectedCategoryId(id);
  }, []);

  // 선택된 카테고리 이름 조회
  const selectedCategoryName = useMemo(() => {
    if (!selectedCategoryId) return null;
    for (const node of MOCK_CATEGORY_TREE) {
      if (node.categoryId === selectedCategoryId) return node.name;
      if (node.children) {
        for (const child of node.children) {
          if (child.categoryId === selectedCategoryId) return child.name;
        }
      }
    }
    return null;
  }, [selectedCategoryId]);

  // 선택된 카테고리 문서 목록
  const selectedCategoryDocuments = useMemo<Document[]>(() => {
    if (!selectedCategoryName) return [];
    return MOCK_DOCUMENTS.filter(
      (doc) =>
        doc.category === selectedCategoryName ||
        doc.categoryPath?.includes(selectedCategoryName)
    );
  }, [selectedCategoryName]);

  // 문서 목록 탭 필터링
  const rootCategoryNames = useMemo(
    () => MOCK_CATEGORY_TREE.map((n) => n.name),
    []
  );

  const listFilteredDocuments = useMemo<Document[]>(() => {
    let result = MOCK_DOCUMENTS.filter((doc) => {
      const matchesCategory = !listCategory || doc.category === listCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (sort === "latest") {
      result = [...result].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    } else {
      result = [...result].sort(
        (a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0)
      );
    }

    return result;
  }, [searchQuery, listCategory, sort]);

  const totalPages = Math.ceil(listFilteredDocuments.length / PAGE_SIZE);
  const pagedDocuments = listFilteredDocuments.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handleListCategoryChange = (cat: string | null) => {
    setListCategory(cat);
    setPage(1);
  };

  const handleSortChange = (value: "latest" | "popular") => {
    setSort(value);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  return (
    <div className="flex h-dvh flex-col bg-background">
      {/* 상단 헤더 바 */}
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background px-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="뒤로 가기"
        >
          <ArrowLeft className="size-5" />
        </button>
        <span className="text-[18px] font-semibold text-foreground">자료</span>
      </header>

      {/* 탭 바 */}
      <div className="flex shrink-0 border-b border-border bg-background px-4">
        <button
          className={cn(
            "px-3 py-3 text-sm font-medium transition-colors",
            activeTab === "tree"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
          onClick={() => setActiveTab("tree")}
        >
          카테고리 탐색
        </button>
        <button
          className={cn(
            "px-3 py-3 text-sm font-medium transition-colors",
            activeTab === "list"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
          onClick={() => setActiveTab("list")}
        >
          문서 목록
        </button>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-4 py-4">
          {/* ── 카테고리 탐색 탭 ── */}
          {activeTab === "tree" && (
            <div>
              <p className="mb-4 text-sm text-muted-foreground">
                카테고리를 선택하면 해당 카테고리에 속한 문서를 확인할 수 있습니다.
              </p>

              {/* 카테고리 트리 */}
              <div className="flex flex-col gap-0.5">
                {MOCK_CATEGORY_TREE.map((node) => (
                  <CategoryTreeNode
                    key={node.categoryId}
                    node={node}
                    expandedNodes={expandedNodes}
                    selectedCategoryId={selectedCategoryId}
                    onToggleNode={toggleNode}
                    onSelectCategory={handleSelectCategory}
                  />
                ))}
              </div>

              {/* 선택된 카테고리 문서 목록 */}
              {selectedCategoryId && selectedCategoryName ? (
                <div className="mt-6 rounded-xl border border-border">
                  <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                    <span className="text-sm font-medium text-foreground">
                      {selectedCategoryName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({selectedCategoryDocuments.length}개)
                    </span>
                  </div>
                  {selectedCategoryDocuments.length === 0 ? (
                    <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
                      이 카테고리에 문서가 없습니다
                    </div>
                  ) : (
                    <div>
                      {selectedCategoryDocuments.map((doc) => (
                        <DocRow
                          key={doc.documentId}
                          document={doc}
                          onClick={() => handleDocumentClick(doc.documentId)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* 인기 문서 (카테고리 미선택 시) */
                <div className="mt-6 rounded-xl border border-border">
                  <div className="flex items-center gap-2 rounded-t-xl bg-popular-bg px-4 py-3 border-b border-border">
                    <Flame className="size-4 text-popular-icon" />
                    <span className="text-sm font-medium text-popular-fg">인기 문서</span>
                  </div>
                  <div>
                    {MOCK_POPULAR_DOCUMENTS.map((pop) => {
                      const doc = MOCK_DOCUMENTS.find(
                        (d) => d.documentId === pop.documentId
                      );
                      if (!doc) return null;
                      return (
                        <DocRow
                          key={doc.documentId}
                          document={doc}
                          onClick={() => handleDocumentClick(doc.documentId)}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── 문서 목록 탭 ── */}
          {activeTab === "list" && (
            <div>
              {/* 검색바 */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="문서 제목으로 검색..."
                  className="w-full rounded-lg bg-muted py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              {/* 카테고리 필터 칩 + 정렬 */}
              <div className="mb-3 flex items-center gap-2">
                <div className="flex flex-1 flex-wrap gap-1.5">
                  <button
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                      !listCategory
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-secondary"
                    )}
                    onClick={() => handleListCategoryChange(null)}
                  >
                    전체
                  </button>
                  {rootCategoryNames.map((cat) => (
                    <button
                      key={cat}
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                        listCategory === cat
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-secondary"
                      )}
                      onClick={() => handleListCategoryChange(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <select
                  value={sort}
                  onChange={(e) =>
                    handleSortChange(e.target.value as "latest" | "popular")
                  }
                  className="shrink-0 rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="latest">최신순</option>
                  <option value="popular">인기순</option>
                </select>
              </div>

              {/* 문서 수 */}
              <p className="mb-2 text-xs text-muted-foreground">
                총 {listFilteredDocuments.length}개 문서
              </p>

              {/* 문서 리스트 */}
              {pagedDocuments.length === 0 ? (
                <div className="flex items-center justify-center rounded-xl border border-border py-16 text-sm text-muted-foreground">
                  검색 결과가 없습니다
                </div>
              ) : (
                <div className="rounded-xl border border-border">
                  {pagedDocuments.map((doc) => (
                    <DocRow
                      key={doc.documentId}
                      document={doc}
                      onClick={() => handleDocumentClick(doc.documentId)}
                    />
                  ))}
                </div>
              )}

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-center gap-1">
                  <button
                    className="rounded px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-40"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    이전
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        className={cn(
                          "size-7 rounded text-xs transition-colors",
                          p === page
                            ? "bg-primary text-primary-foreground font-medium"
                            : "text-muted-foreground hover:bg-secondary"
                        )}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </button>
                    )
                  )}
                  <button
                    className="rounded px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-40"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    다음
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
