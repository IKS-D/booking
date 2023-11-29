import { insertPayment } from "@/actions/reservations/reservationsQueries";
import { decodePayseraData } from "@/actions/reservations/payseraAPI";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  console.info("Payment callback route");
  console.info("request", request);

  const body = await request.text();
  const params = new URLSearchParams(body);

  const data = params.get("data");
  const ss1 = params.get("ss1");
  const ss2 = params.get("ss2");

  if (!data || !ss1 || !ss2) {
    return new Response("Bad request", {
      headers: {
        "content-type": "text/plain",
      },
      status: 400,
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
