"use server";

import { buildPayseraPaymentLink } from "@/lib/payseraAPI";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function createPayment() {
  const header = headers();
  const host = header.get("host");

  console.log(host);

  const link = buildPayseraPaymentLink({
    orderid: "0",
    amount: "2499",
    currency: "EUR",
    test: "1",
    accepturl: `http://${host}/payment/success`,
    cancelurl: `http://${host}/payment/cancel`,
    callbackurl: `http://${host}/payment/callback`,
  });

  redirect(link);
}
