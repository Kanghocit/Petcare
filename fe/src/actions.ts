"use server";

import { fetchWithToken } from "@/utils/fetchWithToken";

export const getUser = async () => {
  const user = await fetchWithToken("/user/profile");
  const userData = await user.json();
  return userData;
};
