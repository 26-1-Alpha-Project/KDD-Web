"use client";

import { useState, useCallback, useEffect } from "react";
import {
  getCategoryTree,
  getDocuments,
  getDocumentsByCategory,
} from "@/lib/api/services/document.service";
import type { CategoryTreeResponse, DocumentByCategoryResponse } from "@/types/api/document";

export interface DocumentItem {
  documentId: string;
  title: string;
  category: string;
  updatedAt: string;
}

export interface CategoryNodeItem {
  categoryId: string;
  name: string;
  children?: CategoryNodeItem[];
}

export function useDocuments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<"latest" | "popular">("latest");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"list" | "tree">("list");
  const [page, setPage] = useState(1);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const [categoryTree, setCategoryTree] = useState<CategoryNodeItem[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [categoryDocuments, setCategoryDocuments] = useState<DocumentItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // 카테고리 트리 변환 헬퍼
  const mapTree = useCallback((nodes: CategoryTreeResponse[]): CategoryNodeItem[] =>
    nodes.map((n) => ({
      categoryId: String(n.categoryId),
      name: n.name,
      children: n.children.length > 0 ? mapTree(n.children) : undefined,
    })), []);

  // 카테고리 트리 로드
  useEffect(() => {
    getCategoryTree()
      .then((res) => {
        setCategoryTree(mapTree(res.categories));
      })
      .catch(() => {
        setCategoryTree([]);
      });
  }, [mapTree]);

  // 문서 목록 로드 (list 탭)
  useEffect(() => {
    if (activeTab !== "list") return;
    setIsLoading(true);
    getDocuments({
      categoryId: selectedCategoryId ? Number(selectedCategoryId) : undefined,
      keyword: searchQuery || undefined,
      sort,
      page: page - 1, // 백엔드는 0-based
      pageSize: 20,
    })
      .then((res) => {
        setDocuments(
          res.data.map((d) => ({
            documentId: String(d.documentId),
            title: d.title,
            category: d.category,
            updatedAt: d.updatedAt,
          }))
        );
        setTotalCount(res.totalCount);
        setTotalPages(res.totalPages);
      })
      .catch(() => {
        setDocuments([]);
        setTotalCount(0);
        setTotalPages(0);
      })
      .finally(() => setIsLoading(false));
  }, [activeTab, selectedCategoryId, searchQuery, sort, page]);

  // 카테고리별 문서 로드 (tree 탭에서 선택 시)
  useEffect(() => {
    if (!selectedCategoryId || activeTab !== "tree") {
      setCategoryDocuments([]);
      return;
    }
    getDocumentsByCategory(Number(selectedCategoryId), { page: 0, pageSize: 50 })
      .then((res) => {
        setCategoryDocuments(
          res.data.map((d: DocumentByCategoryResponse) => ({
            documentId: String(d.documentId),
            title: d.title,
            category: d.category,
            updatedAt: d.updatedAt,
          }))
        );
      })
      .catch(() => {
        setCategoryDocuments([]);
      });
  }, [selectedCategoryId, activeTab]);

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

  const handleSetSelectedCategoryId = useCallback((id: string | null) => {
    setSelectedCategoryId(id);
    setPage(1);
  }, []);

  const handleSetSort = useCallback((value: "latest" | "popular") => {
    setSort(value);
    setPage(1);
  }, []);

  const handleSetSearchQuery = useCallback((value: string) => {
    setSearchQuery(value);
    setPage(1);
  }, []);

  return {
    searchQuery,
    setSearchQuery: handleSetSearchQuery,
    sort,
    setSort: handleSetSort,
    selectedCategoryId,
    setSelectedCategoryId: handleSetSelectedCategoryId,
    activeTab,
    setActiveTab,
    page,
    setPage,
    expandedNodes,
    toggleNode,
    documents,
    categoryDocuments,
    categoryTree,
    totalCount,
    totalPages,
    isLoading,
  };
}
