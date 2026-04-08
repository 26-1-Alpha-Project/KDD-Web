"use client";

import { useState, useCallback, useMemo } from "react";
import {
  MOCK_DOCUMENTS,
  MOCK_CATEGORY_TREE,
} from "@/constants/mock-documents";
import type { Document, CategoryNode } from "@/types/api/document";

export function useDocuments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<"latest" | "popular">("latest");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<"list" | "tree">("list");
  const [page, setPage] = useState(1);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const categoryTree: CategoryNode[] = MOCK_CATEGORY_TREE;

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

  const filteredDocuments: Document[] = useMemo(() => {
    let result = MOCK_DOCUMENTS.filter((doc) => {
      const matchesCategory =
        !selectedCategoryName || doc.category === selectedCategoryName;
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
    }

    return result;
  }, [searchQuery, sort, selectedCategoryName]);

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

  return {
    searchQuery,
    setSearchQuery,
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
    filteredDocuments,
    categoryTree,
  };
}
