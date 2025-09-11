"use server";

import { Address } from "@/interface/Address";
import {
  createAddress,
  deleteAddress,
  getAllAddress,
  updateAddress,
} from "@/libs/address";

export const getAllAddressAction = async (page: number, limit: number) => {
  const data = await getAllAddress(page, limit);
  return data;
};

export const createAddressAction = async (address: Address) => {
  const data = await createAddress(address);
  return data;
};

export const updateAddressAction = async (id: string, address: Address) => {
  const data = await updateAddress(id, address);
  return data;
};

export const deleteAddressAction = async (id: string) => {
  const data = await deleteAddress(id);
  return data;
};
