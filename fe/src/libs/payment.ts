import { fetchWithoutToken } from "@/utils/fetchWithoutToken";

export const createPayment = async (orderCode: string, amount: number) => {
  const data = await fetchWithoutToken(`/payment/create`, "POST", {
    orderCode,
    amount,
  });
  return data;
};
