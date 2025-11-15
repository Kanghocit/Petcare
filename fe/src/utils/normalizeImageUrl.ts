/**
 * Convert localhost:8000 URLs to relative paths để tránh lỗi private IP
 * Có thể dùng cho cả client và server components
 */
export const normalizeImageUrl = (url?: string | null): string => {
  if (!url) return "";

  // Nếu là URL localhost:8000, convert thành relative path
  if (url.includes("localhost:8000") || url.includes("127.0.0.1:8000")) {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname + urlObj.search;
    } catch {
      // Nếu không parse được URL, thử extract path bằng regex
      const match = url.match(/\/images\/.*/);
      return match ? match[0] : url;
    }
  }

  // Nếu là absolute URL khác (https://...), giữ nguyên
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Nếu đã là relative path, đảm bảo có leading slash
  return url.startsWith("/") ? url : `/${url}`;
};

export default normalizeImageUrl;

