import { fetchData } from "@/utils/fetchData";
import {Customer} from '@/interface/Customer'

//Get
export const getAllUser = async (page: number) => {
    const data = await fetchData(`/user?page=${page}`);
    return data;   
};
export const getUserById = async(id: string) => {
  const data = await fetchData(`/user/${id}`)
  return data
}

//Path or PUT
export const updateUser = async(id: string, newData: Partial<Customer>)=> {
  const data = await fetchData(`/user/${id}`, "PATCH", newData)
  return data
}
