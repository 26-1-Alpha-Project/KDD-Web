"use client";

import { useState, useEffect } from "react";
import { getStatistics } from "@/lib/api/services/admin.service";
import type { AdminStatistics } from "@/types/api/admin";

export function useAdminStats() {
  const [statistics, setStatistics] = useState<AdminStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getStatistics()
      .then((res) => setStatistics(res))
      .catch(() => setStatistics(null))
      .finally(() => setIsLoading(false));
  }, []);

  return { statistics, isLoading };
}
