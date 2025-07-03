import { cookies } from "next/headers";

export const fetchWithToken = async (
  path: string,
  options: RequestInit = {}
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

  // Gọi API chính
  let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(cookieHeader && { Cookie: cookieHeader }),
    },
    credentials: "include",
  });

  // Nếu access token hết hạn → gọi refresh
  if (response.status == 401 && refreshToken) {
    const refreshRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(refreshToken && { Cookie: `refreshToken=${refreshToken}` }),
        },
        credentials: "include",
      }
    );

    if (refreshRes.status === 200) {
      // Lấy accessToken mới từ response
      const data = await refreshRes.json();
      const newAccessToken = data.accessToken;
      const newCookieHeader = [
        newAccessToken ? `accessToken=${newAccessToken}` : null,
        refreshToken ? `refreshToken=${refreshToken}` : null,
      ]
        .filter(Boolean)
        .join("; ");

      // Gọi lại API ban đầu với accessToken mới
      response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
          ...(newCookieHeader && { Cookie: newCookieHeader }),
        },
        credentials: "include",
      });
    }
  }

  return response;
};
