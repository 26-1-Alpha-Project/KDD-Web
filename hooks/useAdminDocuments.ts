"use client";

import { useState, useCallback } from "react";
import { MOCK_ADMIN_DOCUMENTS } from "@/constants/mock-admin";
import type { AdminDocument } from "@/types/api/admin";

export function useAdminDocuments() {
  const [documents, setDocuments] =
    useState<AdminDocument[]>(MOCK_ADMIN_DOCUMENTS);
  const [searchQuery, setSearchQuery] = useState("");

  const deleteDocument = useCallback((id: number) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  }, []);

  const reprocessDocument = useCallback((id: number) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, status: "reprocessing" as const } : doc
      )
    );
  }, []);

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
    deleteDocument,
    reprocessDocument,
  };
}
