import { insertPayment } from "@/actions/reservations/reservationsQueries";
import { CookieOptions, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  console.info("Payment callback route");
  console.info("request", request);

  const data = await request.json();

  const { error } = await insertPayment({
    amount: data.amount,
    date: new Date().toISOString(),
    first_name: data.name,
    last_name: data.surename,
    payer_email: data.p_email,
    payment_method: data.payment,
    payment_number: data.requestid,
    reservation_id: data.orderid,
    status: data.status,
  });

  if (error) {
    console.error(error);
  }

  return new Response("OK", {
    headers: {
      "content-type": "text/plain",
    },
    status: 200,
  });
}

export async function POST(request: Request) {
  console.info("Payment callback route");
  console.info("request", request);

  const data = await request.json();

  const { error } = await insertPayment({
    amount: data.amount,
    date: new Date().toISOString(),
    first_name: data.name,
    last_name: data.surename,
    payer_email: data.p_email,
    payment_method: data.payment,
    payment_number: data.requestid,
    reservation_id: data.orderid,
    status: data.status,
  });

  if (error) {
    console.error(error);
  }

  return new Response("OK", {
    headers: {
      "content-type": "text/plain",
    },
    status: 200,
  });
}
