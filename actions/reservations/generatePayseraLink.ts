"use server";

import { buildPayseraPaymentLink } from "@/lib/payseraAPI";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getUserProfileById } from "../users/getCurrentUser";

export async function createPayment(
  totalPrice: number,
  reservation_id: number,
  user_id: string
) {
  const header = headers();
  const host = header.get("host");

  const userProfile = await getUserProfileById(user_id);

  const link = buildPayseraPaymentLink({
    orderid: reservation_id?.toString(),
    amount: totalPrice?.toString(),
    currency: "EUR",
    test: "1",
    p_firstname: userProfile?.first_name,
    p_lastname: userProfile?.last_name,
    accepturl: `http://${host}/payment/success`,
    cancelurl: `http://${host}/payment/cancel`,
    callbackurl: `http://${host}/payment/callback`,
  });

  redirect(link);
}
