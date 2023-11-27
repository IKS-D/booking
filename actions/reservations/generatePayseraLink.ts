"use server";

import { buildPayseraPaymentLink } from "@/lib/payseraAPI";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function createPayment(
  totalPrice: number,
  reservation_id: number
) {
  const header = headers();
  const host = header.get("host");

  const link = buildPayseraPaymentLink({
    orderid: reservation_id?.toString(),
    amount: totalPrice?.toString(),
    currency: "EUR",
    test: "1",
    accepturl: `http://${host}/payment/success`,
    cancelurl: `http://${host}/payment/cancel`,
    callbackurl: `http://${host}/payment/callback`,
  });

  redirect(link);
}

export async function createPaymentAction(formData: FormData) {
  const header = headers();
  const host = header.get("host");

  const totalPrice = formData.get("totalPrice");
  const reservation_id = formData.get("reservation_id");

  const link = buildPayseraPaymentLink({
    orderid: reservation_id?.toString(),
    amount: totalPrice?.toString(),
    currency: "EUR",
    test: "1",
    accepturl: `http://${host}/payment/success`,
    cancelurl: `http://${host}/payment/cancel`,
    callbackurl: `http://${host}/payment/callback`,
  });

  redirect(link);
}
