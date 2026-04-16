'use client';

import { useState, useCallback } from 'react';
import { ApiError, ERROR_MESSAGES } from '@/lib/api/errors';

interface UseApiRequestReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  execute: (fn: () => Promise<T>) => Promise<T | null>;
  reset: () => void;
}

export function useApiRequest<T = unknown>(): UseApiRequestReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setData(null);
    setIsLoading(false);
    setError(null);
  }, []);

  const execute = useCallback(async (fn: () => Promise<T>): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fn();
      setData(result);
      return result;
    } catch (err) {
      if (err instanceof ApiError) {
        const message = ERROR_MESSAGES[err.code] ?? err.message;
        setError(message);
      } else {
        setError('알 수 없는 오류가 발생했습니다.');
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading, error, execute, reset };
}
