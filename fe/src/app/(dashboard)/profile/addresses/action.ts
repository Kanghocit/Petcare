"use server"

import { addAddress, updateAddress, deleteAddress, setDefaultAddress, getUserProfile } from "@/libs/user";
import { Address } from "@/interface/address";
import { revalidatePath } from "next/cache";

export const addAddressAction = async (address: Address) => {
    const response = await addAddress(address);
    revalidatePath("/profile/addresses");
    return response;
};
export const updateAddressAction = async (address: Address) => {
    const response = await updateAddress(address);
    revalidatePath("/profile/addresses");
    return response;
};
export const deleteAddressAction = async (addressId: string) => {
    const response = await deleteAddress(addressId);
    revalidatePath("/profile/addresses");
    return response;
};
export const setDefaultAddressAction = async (addressId: string) => {
    const response = await setDefaultAddress(addressId);
    revalidatePath("/profile/addresses");
    return response;
};

export const getUserProfileAction = async () => {
    const response = await getUserProfile();
    return response;
};

