import { fetchData } from "@/utils/fetchData";

export const loginAdmin = async (email: string, password: string) => {
    const res = await fetchData("/auth/admin/login", "POST", { email, password });
    return res;
}

export const createStaff = async (email: string, password: string) => {
    const res = await fetchData("/auth/admin/create-staff", "POST", { email, password });
    return res;
}

export const getAdminAccount = async () => {
    const res = await fetchData("/auth/admin/me", "GET");
    return res;
}

export const logoutAdmin = async () => {
    const res = await fetchData("/auth/admin/logout", "POST");
    return res;
}
