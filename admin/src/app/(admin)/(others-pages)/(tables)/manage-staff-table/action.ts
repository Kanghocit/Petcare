"use server"

import { createStaff, CreateStaffPayload } from "@/libs/users";

export const CreateStaffAction = async (payload: CreateStaffPayload) => {
    const res = await createStaff(payload);
    return res;
}


