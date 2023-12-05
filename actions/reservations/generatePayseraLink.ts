"use server";

import { buildPayseraPaymentLink } from "@/actions/reservations/payseraAPI";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getUserProfileById } from "../users/usersQueries";

export async function createPayment(
  totalPrice: number,
  reservation_id: number,
  user_id: string
) {
  const header = headers();
  const host = header.get("host");

  const callbackUrl = process.env.NEXT_PUBLIC_PAYSERA_CALLBACK_URL;

  if (!callbackUrl) {
    throw new Error("NEXT_PUBLIC_PAYSERA_CALLBACK_URL not found");
  }

  const { data: userProfile, error } = await getUserProfileById(user_id);

  const link = buildPayseraPaymentLink({
    orderid: reservation_id?.toString(),
    amount: totalPrice?.toString(),
    p_firstname: userProfile?.first_name,
    p_lastname: userProfile?.last_name,
    accepturl: `http://${host}/payment/success`,
    cancelurl: `http://${host}/payment/cancel`,
    callbackurl: callbackUrl,
  });

  redirect(link);
}
