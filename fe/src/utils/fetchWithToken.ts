import { cookies } from "next/headers";

export const fetchWithToken = async (
  path: string,
  options: RequestInit = {},
  cacheConfig?: { next?: { revalidate?: number; tags?: string[] } }
): Promise<Response> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const cookieHeader = [
    accessToken ? `accessToken=${accessToken}` : null,
    refreshToken ? `refreshToken=${refreshToken}` : null,
  ]
    .filter(Boolean)
    .join("; ");

  // Add cache configuration for GET requests
  const fetchOptions: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(cookieHeader && { Cookie: cookieHeader }),
    },
    credentials: "include",
  };

  // Only cache GET requests
  if (!options.method || options.method === "GET") {
    if (cacheConfig?.next) {
      fetchOptions.next = cacheConfig.next;
    } else {
      // Default: cache for 60 seconds
      fetchOptions.next = { revalidate: 60 };
    }
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, fetchOptions);

  return response;
};
