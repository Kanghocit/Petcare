import { Voicher } from "@/interface/Voicher";
import { fetchData } from "@/utils/fetchData";

//Get
export const getAllVoichers = async (page: string, search: string) => {
  const data = await fetchData(`/voicher?page=${page}&search=${search}`);
  return data;
};
//Post
export const createVoicher = async (dataVoicher: Partial<Voicher>) => {
  const data = await fetchData("/voicher", "POST", dataVoicher);
  return data;
};
export const updateVoicher = async (
  id: string,
  dataVoicher: Partial<Voicher>,
) => {
  const data = await fetchData(`/voicher/${id}`, "PUT", dataVoicher);
  return data;
};
export const deleteVoicher = async (id: string) => {
  const data = await fetchData(`/voicher/${id}`, "DELETE");
  return data;
};
export const useVoicher = async (id: string, userId: string) => {
  const data = await fetchData(`/voicher/${id}/use`, "POST", { userId });
  return data;
};
