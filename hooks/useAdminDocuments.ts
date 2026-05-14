"use client";

import { useState, useCallback, useEffect } from "react";
import {
  getAdminDocuments,
  deleteDocument,
  reprocessDocument,
  updateDocumentCategory,
} from "@/lib/api/services/admin.service";
import { ApiError, ERROR_MESSAGES } from "@/lib/api/errors";
import type { AdminDocument } from "@/types/api/admin";

export function useAdminDocuments() {
  const [documents, setDocuments] = useState<AdminDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const loadDocuments = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getAdminDocuments({ page: 0, pageSize: 100 });
      setDocuments(res.data);
    } catch {
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleDeleteDocument = useCallback(async (id: number) => {
    // 낙관적 업데이트
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    try {
      await deleteDocument(id);
    } catch {
      // 실패 시 목록 재로드
      loadDocuments();
    }
  }, [loadDocuments]);

  const handleUpdateCategory = useCallback(async (documentId: number, categoryId: number) => {
    setUpdateError(null);
    try {
      const res = await updateDocumentCategory(documentId, categoryId);
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === documentId
            ? { ...doc, categoryId: res.categoryId, categoryName: res.categoryName }
            : doc
        )
      );
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? (ERROR_MESSAGES[err.code] ?? err.message)
          : "카테고리 변경에 실패했습니다.";
      setUpdateError(msg);
      loadDocuments();
    }
  }, [loadDocuments]);

  const handleReprocessDocument = useCallback(async (id: number) => {
    // 낙관적 업데이트
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, status: "reprocessing" as const } : doc
      )
    );
    try {
      await reprocessDocument(id);
    } catch {
      loadDocuments();
    }
  }, [loadDocuments]);

  const filteredDocuments = documents.filter(
    (doc) =>
      searchQuery.trim() === "" ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    documents: filteredDocuments,
    searchQuery,
    setSearchQuery,
    deleteDocument: handleDeleteDocument,
    reprocessDocument: handleReprocessDocument,
    updateCategory: handleUpdateCategory,
    updateError,
    isLoading,
    reload: loadDocuments,
  };
}
