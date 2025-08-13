"use server"

import { getAllUser, getUserById, updateUser } from "@/libs/users";
import { Customer } from '@/interface/Customer'

//user
export const GetAllUsersAction = async(page: number) => {
    const data = await getAllUser(page);
    return data
}

export const UpdateUserAction = async(id: string , newData: Partial<Customer>) => {
    const data = await updateUser(id, newData);
    return data
}

export const GetUserByIdAction = async(id: string) => {
    const data = await getUserById(id);
    return data
}