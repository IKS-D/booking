import { insertPayment } from "@/actions/reservations/reservationsQueries";
import { decodePayseraData } from "@/lib/payseraAPI";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  console.info("Payment callback route");
  console.info("request", request);

  const requestUrl = new URL(request.url);
  const data = requestUrl.searchParams.get("data");
  const ss1 = requestUrl.searchParams.get("ss1");
  const ss2 = requestUrl.searchParams.get("ss2");

  if (!data || !ss1 || !ss2) {
    // get body from request
    const body = await request.text();
    console.info("body", body);

    return new Response("OK", {
      headers: {
        "content-type": "text/plain",
      },
      status: 200,
    });
  }

  const payment = decodePayseraData(data, ss1, ss2);
  const { error } = await insertPayment(payment);

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

// export async function GET(request: Request) {
//   console.info("Payment callback route");
//   console.info("request", request);

//   const data = await request.json();

//   const { error } = await insertPayment({
//     amount: data.amount,
//     date: new Date().toISOString(),
//     first_name: data.name,
//     last_name: data.surename,
//     payer_email: data.p_email,
//     payment_method: data.payment,
//     payment_number: data.requestid,
//     reservation_id: data.orderid,
//     status: data.status,
//   });

//   if (error) {
//     console.error(error);
//   }

//   return new Response("OK", {
//     headers: {
//       "content-type": "text/plain",
//     },
//     status: 200,
//   });
// }
