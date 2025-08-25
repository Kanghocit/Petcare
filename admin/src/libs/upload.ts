export const uploadMultipleImages = async (
  formData: FormData,
): Promise<Response> => {
  const apiBase =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  const url = `${apiBase.replace(/\/$/, "")}/upload-multiple-images`;
  return fetch(url, {
    method: "POST",
    body: formData,
    credentials: "include",
    // Do NOT set Content-Type when sending FormData; browser will set with boundary
  });
};
