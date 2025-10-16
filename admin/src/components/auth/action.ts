"use server";

import { createStaff, getAdminAccount, loginAdmin, logoutAdmin } from "@/libs/auth";

export const loginAdminAction = async (email: string, password: string) => {
    const res = await loginAdmin(email, password);
    return res;
}

export const createStaffAction = async (username: string, password: string) => {
    const res = await createStaff(username, password);
    return res;
}

export const getAdminAccountAction = async () => {
    const res = await getAdminAccount();
    return res;
}

export const logoutAdminAction = async () => {
    const res = await logoutAdmin();
    return res;
}