// src/proxy.ts
import { NextRequest, NextResponse } from "next/server";

function isJwtExpired(token: string | undefined): boolean {
  if (!token) return true;
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return true;
    const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "===".slice((normalized.length + 3) % 4);
    const json = atob(padded);
    const payload = JSON.parse(json) as { exp?: number };
    if (!payload.exp) return true;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

// Chú ý: export function named "proxy"
export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (!refreshToken) return NextResponse.next();

  if (!accessToken || isJwtExpired(accessToken)) {
    try {
      const refreshRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `refreshToken=${refreshToken}`,
          },
          credentials: "include",
        }
      );

      if (refreshRes.ok) {
        const data = await refreshRes.json();
        const newAccessToken = data.accessToken as string | undefined;
        if (newAccessToken) {
          const response = NextResponse.next();
          response.cookies.set("accessToken", newAccessToken, {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
          });
          return response;
        }
      } else {
        const response = NextResponse.next();
        response.cookies.set("accessToken", "", { path: "/", maxAge: 0 });
        return response;
      }
    } catch {
      // ignore network errors
    }
  }

  return NextResponse.next();
}

// Nếu muốn, có thể giữ matcher config như middleware
export const config = {
  matcher: ["/((?!_next|favicon.ico|api/auth).*)"],
};
