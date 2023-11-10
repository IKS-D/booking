import { CookieOptions, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  console.log("Payment callback route");
  console.log("request", request);

  return new Response("OK", {
    headers: {
      "content-type": "text/plain",
    },
    status: 200,
  });
}
