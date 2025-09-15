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

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${url}`,
    options
  );

  // Nếu BE có message thì log rõ ra
  if (!response.ok) {
    let errorMessage = response.statusText;

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // fallback nếu backend không trả JSON mà trả plain text
      const errorText = await response.text();
      errorMessage = errorText || errorMessage;
    }

    throw new Error(`${errorMessage}`);
  }

  return await response.json();
};
