import { fetchWithToken } from "@/utils/fetchWithToken";
import { Address } from "@/interface/address";

export const getUserProfile = async () => {
    const response = await fetchWithToken(`/user/profile`, {
        method: "GET",
    });
    return response.json();
};

export const addAddress = async (address: Address) => {
    const response = await fetchWithToken("/user/address", {
        method: "POST",
        body: JSON.stringify(address),
    });
    return response.json();
};

export const updateAddress = async (address: Address) => {
    const response = await fetchWithToken(`/user/address/${address._id}`, {
        method: "PUT",
        body: JSON.stringify(address),
    });
    return response.json();
};

export const deleteAddress = async (addressId: string) => {
    const response = await fetchWithToken(`/user/address/${addressId}`, {
        method: "DELETE",
    });
    return response.json();
};

export const setDefaultAddress = async (addressId: string) => {
    const response = await fetchWithToken(`/user/address/${addressId}/default`, {
        method: "PATCH",
    });
    return response.json();
};