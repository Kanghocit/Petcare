"use server";

import { getAllVoichers } from "@/libs/voicher";
import { Voicher } from "@/interface/Voicher";
import { createVoicher, updateVoicher } from "@/libs/voicher";
import { deleteVoicher } from "@/libs/voicher";

export const getAllVoichersAction = async (page: string, search: string) => {
  const data = await getAllVoichers(page, search);
  return data;
};
export const createVoicherAction = async (voicher: Partial<Voicher>) => {
  const data = await createVoicher(voicher);
  return data;
};
export const updateVoicherAction = async (
  id: string,
  voicher: Partial<Voicher>,
) => {
  const data = await updateVoicher(id, voicher);
  return data;
};
export const deleteVoicherAction = async (id: string) => {
  const data = await deleteVoicher(id);
  return data;
};
