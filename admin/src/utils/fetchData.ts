export const fetchData = async (
  url: string,
  method: string = "GET",
  data: any = null,
) => {
  const baseHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Forward cookies on the server (SSR) so backend can read session
  if (typeof window === "undefined") {
    try {

      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const cookieHeader = cookieStore.toString()

      if (cookieHeader) {
        baseHeaders["cookie"] = cookieHeader;
      }
    } catch {
      // noop: not in a Next.js server context
    }
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    method,
    headers: baseHeaders,
    credentials: "include", // keep cookies on client-side requests
    body: data ? JSON.stringify(data) : null,
  });

  let json;

  try {
    json = await response.json(); // cố parse JSON trước
  } catch {
    json = null; // nếu không parse được
  }

  if (!response.ok) {
    // Nếu backend có message => throw Error đó
    const message =
      json?.message ||
      json?.error ||
      json?.errors?.[0]?.msg ||
      `HTTP error! status: ${response.status}`;
    throw new Error(message);
  }

  return json;
};
