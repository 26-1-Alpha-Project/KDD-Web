"use client";

import { useState, useEffect } from "react";
import { MOCK_ADMIN_STATISTICS } from "@/constants/mock-admin";
import type { AdminStatistics } from "@/types/api/admin";

export function useAdminStats() {
  const [statistics, setStatistics] = useState<AdminStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: 실제 API 연동 시 교체
    const timer = setTimeout(() => {
      setStatistics(MOCK_ADMIN_STATISTICS);
      setIsLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return { statistics, isLoading };
}
