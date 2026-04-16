"use client";

import { useState, useCallback, useEffect } from "react";
import {
  getAdminDocuments,
  deleteDocument,
  reprocessDocument,
} from "@/lib/api/services/admin.service";
import type { AdminDocument } from "@/types/api/admin";

export function useAdminDocuments() {
  const [documents, setDocuments] = useState<AdminDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    isLoading,
    reload: loadDocuments,
  };
}
