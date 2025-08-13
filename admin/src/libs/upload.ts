export const uploadMultipleImages = async (
  formData: FormData,
): Promise<Response> => {
  return fetch("http://localhost:8000/api/upload-multiple-images", {
    method: "POST",
    body: formData,
  });
};
