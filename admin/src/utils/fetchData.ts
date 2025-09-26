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
      const errorData = await response.json();
      const message =
        (errorData && (errorData.message || errorData.error)) ||
        `HTTP error! status: ${response.status}`;
      throw new Error(message);
    } catch {
      // Fallback if response has no JSON body
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  return await response.json();
};
