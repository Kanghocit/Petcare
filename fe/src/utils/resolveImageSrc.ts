export const resolveImageSrc = (source?: string): string | undefined => {
  if (!source) return undefined;

  // Convert localhost:8000 URLs to relative paths để tránh lỗi private IP
  if (source.includes("localhost:8000") || source.includes("127.0.0.1:8000")) {
    const url = new URL(source);
    return url.pathname + url.search;
  }

  // Absolute URLs (non-localhost) pass through
  if (source.startsWith("http://") || source.startsWith("https://")) {
    return source;
  }

  // Ensure source begins with a single leading slash
  const normalizedSource = source.startsWith("/") ? source : `/${source}`;

  // Nếu đã là relative path (bắt đầu bằng /images), return luôn
  // Vì đã có rewrite trong next.config.ts để proxy đến backend
  if (normalizedSource.startsWith("/images/")) {
    return normalizedSource;
  }

  // Prefer env API URL and strip optional /api suffix to get asset base
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
  let assetBase = apiBase;
  if (apiBase) {
    try {
      const url = new URL(apiBase);
      url.pathname = url.pathname.replace(/\/?api\/?$/, "");
      assetBase = `${url.origin}${url.pathname}`.replace(/\/$/, "");
      
      // Nếu là localhost, convert thành relative path
      if (assetBase.includes("localhost:8000") || assetBase.includes("127.0.0.1:8000")) {
        return normalizedSource;
      }
    } catch {
      assetBase = apiBase.replace(/\/?api\/?$/, "").replace(/\/$/, "");
      if (assetBase.includes("localhost:8000") || assetBase.includes("127.0.0.1:8000")) {
        return normalizedSource;
      }
    }
  }

  // If still no base (e.g., pointing to FE public), just return normalized path
  if (!assetBase) {
    return normalizedSource;
  }

  return `${assetBase}${normalizedSource}`;
};

export default resolveImageSrc;
