import { insertListing, Listing } from "@/actions/listings/listingsQueries";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const {
    listing,
    user_id,
  }: {
    listing: Partial<Listing>;
    user_id: string;
  } = await request.json();

  const { data, error } = await insertListing({
    user_id,
    listing,
    services: [],
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data: data });
}
