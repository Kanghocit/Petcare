export const fetchWithoutToken = async (
  url: string,
  method: string = "GET",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any = null
) => {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (data && method !== "GET") {
    options.body = JSON.stringify(data);
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  const response = await fetch(`${apiUrl}${url}`, options);

  // Nếu BE có message thì log rõ ra
  if (!response.ok) {
    let errorMessage = response.statusText;

    try {
      // Clone response để có thể đọc body nhiều lần
      const responseClone = response.clone();
      const errorData = await responseClone.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // fallback nếu backend không trả JSON mà trả plain text
      try {
        const errorText = await response.text();
        errorMessage = errorText || errorMessage;
      } catch {
        // Nếu không thể đọc text, giữ nguyên statusText
        console.warn("Could not read response body");
      }
    }

    throw new Error(`${errorMessage}`);
  }

  return await response.json();
};
