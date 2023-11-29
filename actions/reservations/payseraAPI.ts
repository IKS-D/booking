import { TableInserts, TableRows } from "@/supabase/database.types";
import * as crypto from "crypto";
import { TypeOnlyCompatibleAliasDeclaration } from "typescript";
export const md5 = (contents: string) =>
  crypto.createHash("md5").update(contents).digest("hex");

type PayseraAPIParams = {
  projectid: string;
  orderid: string;
  accepturl: string;
  cancelurl: string;
  callbackurl: string;
  version: string;
  p_firstname?: string;
  p_lastname?: string;
  lang?: string;
  amount?: string;
  currency?: string;
  test: string;
};

const defaultParams: PayseraAPIParams = {
  projectid: "240080",
  orderid: "0",
  accepturl: "https://iksd.vercel.app/payment/success",
  cancelurl: "https://iksd.vercel.app/payment/cancel",
  callbackurl: "https://iksd.vercel.app/payment/callback",
  version: "1.6",
  test: "1",
  lang: "LIT",
  currency: "EUR",
};

type PayseraParams = Partial<PayseraAPIParams>;

export const buildPayseraPaymentLink = (params: PayseraParams) => {
  const base_url = "https://www.paysera.com/pay/";
  const password = process.env.NEXT_PUBLIC_PAYSERA_PASSWORD;

  if (!password) {
    throw new Error("Paysera Project Password not found");
  }

  params = { ...defaultParams, ...params };

  const newParams = new URLSearchParams(params);
  const paramsString = newParams.toString();

  // base64 encoding
  const base64Params = Buffer.from(paramsString).toString("base64");

  // replace + with - and / with _
  const data = base64Params.replace(/\+/g, "-").replace(/\//g, "_");
  const sign = md5(data + password);

  return `${base_url}?data=${data}&sign=${sign}`;
};

export const decodePayseraData = (data: string, ss1: string, _ss2: string) => {
  const password = process.env.NEXT_PUBLIC_PAYSERA_PASSWORD;

  if (!password) {
    throw new Error("Paysera Project Password not found");
  }

  let replacedData = data.replace(/-/g, "+").replace(/_/g, "/");

  let decodedData = Buffer.from(replacedData, "base64").toString("utf-8");
  decodedData = decodeURIComponent(decodedData).replace(/\+/g, " ");

  const local_ss1 = md5(data + password);
  if (local_ss1 !== ss1) {
    throw new Error("ss1 does not match. Possible data corruption");
  }

  const values = decodedData.split("&");
  const params: Record<string, string> = {};
  values.forEach((value) => {
    const [key, val] = value.split("=");
    params[key] = val;
  });

  const payment: TableInserts<"payments"> = {
    amount: parseInt(params.amount),
    date: new Date().toISOString(),
    first_name: params.p_firstname,
    last_name: params.p_lastname,
    payer_email: params.p_email,
    payment_method: params.payment,
    payment_number: params.requestid,
    reservation_id: parseInt(params.orderid),
    status: parseInt(params.status),
  };

  return payment;
};
