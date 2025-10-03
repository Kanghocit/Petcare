"use server";

import { getUser } from "@/actions";
import { createOrder } from "@/libs/order";
import { CreateOrderPayload } from "@/libs/order";
import { createPayment } from "@/libs/payment";
import { postValidateVoicher, postUseVoicher } from "@/libs/voicher";

//get
export const getUserAction = async () => {
  const data = await getUser();
  return data;
};
//post
export const createOrderAction = async (payload: CreateOrderPayload) => {
  const res = await createOrder(payload);
  const body = await res.json();
  return { ok: res.ok, status: res.status, body } as {
    ok: boolean;
    status: number;
    body: unknown;
  };
};

export const createPaymentAction = async (
  orderCode: string,
  amount: number
) => {
  const data = await createPayment(orderCode, amount);
  return data;
};

export const postValidateVoicherAction = async (
  code: string,
  userId: string,
  orderTotal: number
) => {
  const data = await postValidateVoicher(code, userId, orderTotal);
  return data;
};

export const postUseVoicherAction = async (
  code: string,
  userId: string,
  orderTotal: number
) => {
  const data = await postUseVoicher(code, userId, orderTotal);
  return data;
};
