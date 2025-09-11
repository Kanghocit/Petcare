import { fetchData } from "@/utils/fetchData";
import { Address } from "@/interface/Address";

export const getAllAddress = async (page: number, limit: number) => {
  const data = await fetchData(`/address?page=${page}&limit=${limit}`);
  return data;
};

export const createAddress = async (address: Address) => {
  const data = await fetchData("/address", "POST", address);
  return data;
};

export const updateAddress = async (id: string, address: Address) => {
  const data = await fetchData(`/address/${id}`, "PUT", address);
  return data;
};

export const deleteAddress = async (id: string) => {
  const data = await fetchData(`/address/${id}`, "DELETE");
  return data;
};
