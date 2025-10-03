import { fetchWithoutToken } from "@/utils/fetchWithoutToken";

export const getAllVoichers = async (limit: number) => {
  const data = fetchWithoutToken(`/voicher?limit=${limit}`);
  return data;
};

export const postValidateVoicher = async (
  code: string,
  userId: string,
  orderTotal: number
) => {
  const data = fetchWithoutToken("/voicher/validate", "POST", {
    code,
    userId,
    orderTotal,
  });
  return data;
};

export const postUseVoicher = async (
  code: string,
  userId: string,
  orderTotal: number
) => {
  const data = fetchWithoutToken("/voicher/use", "POST", {
    code,
    userId,
    orderTotal,
  });
  return data;
};
