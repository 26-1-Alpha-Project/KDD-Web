"use client";

import { useState, useCallback, useEffect } from "react";
import {
  getCategoryTree,
  getDocuments,
  getDocumentsByCategory,
  getPopularDocuments,
} from "@/lib/api/services/document.service";
import type {
  CategoryTreeResponse,
  DocumentByCategoryResponse,
  PopularDocumentItem,
} from "@/types/api/document";

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
  const [activeTab, setActiveTab] = useState<"list" | "tree" | "popular">("popular");
  const [page, setPage] = useState(1);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const [categoryTree, setCategoryTree] = useState<CategoryNodeItem[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  // categoryId → DocumentItem[] 맵. expand된 카테고리마다 별도 보관
  const [categoryDocumentsMap, setCategoryDocumentsMap] = useState<Map<string, DocumentItem[]>>(new Map());
  const [popularDocuments, setPopularDocuments] = useState<PopularDocumentItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isPopularLoading, setIsPopularLoading] = useState(false);

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
      .catch((err) => {
        console.error("[useDocuments] getCategoryTree 실패", err);
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
      page: page - 1,
      pageSize: 20,
    })
      .then((res) => {
        const data = Array.isArray(res?.data) ? res.data : [];
        setDocuments(
          data.map((d) => ({
            documentId: String(d.documentId),
            title: d.title,
            category: d.category,
            updatedAt: d.updatedAt,
          }))
        );
        setTotalCount(res?.totalCount ?? 0);
        setTotalPages(res?.totalPages ?? 0);
      })
      .catch((err) => {
        console.error("[useDocuments] getDocuments 실패", err);
        setDocuments([]);
        setTotalCount(0);
        setTotalPages(0);
      })
      .finally(() => setIsLoading(false));
  }, [activeTab, selectedCategoryId, searchQuery, sort, page]);

  // 인기 문서 로드 (popular 탭)
  useEffect(() => {
    if (activeTab !== "popular") return;
    setIsPopularLoading(true);
    getPopularDocuments()
      .then((res) => {
        setPopularDocuments(Array.isArray(res?.documents) ? res.documents : []);
      })
      .catch((err) => {
        console.error("[useDocuments] getPopularDocuments 실패", err);
        setPopularDocuments([]);
      })
      .finally(() => setIsPopularLoading(false));
  }, [activeTab]);

  // 카테고리별 문서 로드 (tree 탭에서 노드 expand 시)
  const loadCategoryDocuments = useCallback(async (categoryId: string) => {
    if (categoryDocumentsMap.has(categoryId)) return; // 이미 로드됨
    try {
      const res = await getDocumentsByCategory(Number(categoryId), { page: 0, pageSize: 50 });
      const items: DocumentItem[] = res.data.map((d: DocumentByCategoryResponse) => ({
        documentId: String(d.documentId),
        title: d.title,
        category: d.category,
        updatedAt: d.updatedAt,
      }));
      setCategoryDocumentsMap((prev) => {
        const next = new Map(prev);
        next.set(categoryId, items);
        return next;
      });
    } catch {
      setCategoryDocumentsMap((prev) => {
        const next = new Map(prev);
        next.set(categoryId, []);
        return next;
      });
    }
  }, [categoryDocumentsMap]);

  const toggleNode = useCallback((categoryId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
        // expand 시 해당 카테고리 문서 로드 트리거
        loadCategoryDocuments(categoryId);
      }
      return next;
    });
  }, [loadCategoryDocuments]);

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
    categoryDocumentsMap,
    categoryTree,
    popularDocuments,
    totalCount,
    totalPages,
    isLoading,
    isPopularLoading,
  };
}
