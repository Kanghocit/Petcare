export const fetchData = async (
  url: string,
  method: string = "GET",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any = null,
) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Include cookies for authentication
    body: data ? JSON.stringify(data) : null,
  });

  if (!response.ok) {
    console.log("respone", response);
    try {
      const text = await response.text();
      try {
        const errorData = JSON.parse(text);
        const message =
          (errorData && (errorData.message || errorData.error || errorData?.errors?.[0]?.msg)) ||
          `HTTP error! status: ${response.status}`;
        throw new Error(message);
      } catch {
        // Not JSON, return raw text for visibility
        throw new Error(text || `HTTP error! status: ${response.status}`);
      }
    } catch {
      // Fallback if response body can't be read
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  return await response.json();
};
