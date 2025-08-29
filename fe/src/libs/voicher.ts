import { fetchWithoutToken } from "@/utils/fetchWithoutToken";

export const getAllVoichers = async () => {
  const data = fetchWithoutToken("/voicher");
  return data;
};
