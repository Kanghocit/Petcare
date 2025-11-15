import { useState, useCallback } from "react";

/**
 * Hook để quản lý loading state
 */
export const useLoading = (initialState: boolean = false) => {
  const [loading, setLoading] = useState(initialState);

  const startLoading = useCallback(() => setLoading(true), []);
  const stopLoading = useCallback(() => setLoading(false), []);
  const toggleLoading = useCallback(() => setLoading((prev) => !prev), []);

  return {
    loading,
    setLoading,
    startLoading,
    stopLoading,
    toggleLoading,
  };
};

/**
 * Hook để wrap async function với loading state
 */
export const useAsyncLoading = <T extends (...args: any[]) => Promise<any>>(
  asyncFn: T
): [T, boolean] => {
  const [loading, setLoading] = useState(false);

  const wrappedFn = useCallback(
    async (...args: Parameters<T>) => {
      setLoading(true);
      try {
        const result = await asyncFn(...args);
        return result;
      } finally {
        setLoading(false);
      }
    },
    [asyncFn]
  ) as T;

  return [wrappedFn, loading];
};

export default useLoading;

