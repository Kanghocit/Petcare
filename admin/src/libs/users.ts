import { fetchData } from "@/utils/fetchData";
import { Customer } from '@/interface/Customer'

//Get
export const getAllUser = async (role: string, page: number, search?: string) => {
  const params = new URLSearchParams({ role, page: String(page) });
  if (search && search.trim()) params.set("search", search.trim());
  const data = await fetchData(`/user?${params.toString()}`);
  return data;
};
export const getUserById = async (id: string) => {
  const data = await fetchData(`/user/${id}`)
  return data
}

//Path or PUT
export const updateUser = async (id: string, newData: Partial<Customer>) => {
  const data = await fetchData(`/user/${id}`, "PATCH", newData)
  return data
}

//Post - Admin create staff
export interface CreateStaffPayload {
  name: string;
  email: string;
  username: string;
  password: string;
}

export const createStaff = async (payload: CreateStaffPayload) => {
  const data = await fetchData(`/auth/admin/create-staff`, "POST", payload);
  return data;
}