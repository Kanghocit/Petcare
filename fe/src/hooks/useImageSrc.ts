import { useMemo } from "react";
import { normalizeImageUrl } from "@/utils/normalizeImageUrl";

/**
 * Hook để normalize image URLs, convert localhost:8000 thành relative paths
 * Dùng cho client components
 */
export const useImageSrc = (url?: string | null): string => {
  return useMemo(() => normalizeImageUrl(url), [url]);
};

/**
 * Hook để normalize nhiều image URLs cùng lúc
 */
export const useImageSrcs = (urls?: (string | null)[]): string[] => {
  return useMemo(() => {
    if (!urls) return [];
    return urls.map((url) => normalizeImageUrl(url));
  }, [urls]);
};

export default useImageSrc;

