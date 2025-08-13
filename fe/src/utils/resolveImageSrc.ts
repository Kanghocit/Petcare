export const resolveImageSrc = (source?: string): string | undefined => {
  if (!source) return undefined;

  // Absolute URLs pass through
  if (source.startsWith("http://") || source.startsWith("https://")) {
    return source;
  }

  // Ensure source begins with a single leading slash
  const normalizedSource = source.startsWith("/") ? source : `/${source}`;

  // Prefer env API URL and strip optional /api suffix to get asset base
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
  let assetBase = apiBase;
  if (apiBase) {
    try {
      const url = new URL(apiBase);
      url.pathname = url.pathname.replace(/\/?api\/?$/, "");
      assetBase = `${url.origin}${url.pathname}`.replace(/\/$/, "");
    } catch {
      assetBase = apiBase.replace(/\/?api\/?$/, "").replace(/\/$/, "");
    }
  }

  // If env missing and looks like backend-served path, fall back to localhost:8000
  if (!assetBase && normalizedSource.startsWith("/images/")) {
    assetBase = "http://localhost:8000";
  }

  // If still no base (e.g., pointing to FE public), just return normalized path
  if (!assetBase) {
    return normalizedSource;
  }

  return `${assetBase}${normalizedSource}`;
};

export default resolveImageSrc;
