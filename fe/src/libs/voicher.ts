import { fetchWithoutToken } from "@/utils/fetchWithoutToken";

export const getAllVoichers = async () => {
  const data = fetchWithoutToken("/voicher");
  return data;
};

export const postValidateVoicher = async (code: string, userId: string) => {
  const data = fetchWithoutToken("/voicher/validate", "POST", { code, userId });
  return data;
};

export const postUseVoicher = async (code: string, userId: string) => {
  const data = fetchWithoutToken("/voicher/use", "POST", { code, userId });
  return data;
};
