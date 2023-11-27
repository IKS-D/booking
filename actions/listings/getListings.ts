import { DbResultOk } from "@/supabase/database.types";
import supabase from "@/supabase/supabase";
import { Listing } from "@/types";

interface Params {
  listingId?: string;
  userId?: string;
  authorId?: string;
}

// If making changes to this code, make sure it doesn't break create reservation page
export type ListingWithDetails = DbResultOk<ReturnType<typeof getListingById>>;

export async function getListingById(listingId: number) {
  const { data, error } = await supabase
    .from("listings")
    .select(
      `
    *,
    category: listing_category (name),
    services: services (*)
  `
    )
    .eq("id", listingId)
    .single();

  if (error) {
    console.error(error);
  }

  return { data, error };
}

export async function getListing(params: Params) {
  const { listingId, userId, authorId } = params;

  const listings = Array(20).fill(mockListing);

  const specificListing = listings.find((listing) => listing.id === listingId);

  if (!specificListing) {
    return { error: "Listing not found" };
  }

  return specificListing;
}

export async function getListings(params: Params) {
  const { listingId, userId, authorId } = params;

  const listings = Array(20).fill(mockListing);

  return listings;
}

export async function getPersonalListings(params: Params) {
  const { listingId, userId, authorId } = params;

  const listings = Array(20).fill(mockListing);

  return listings;
}

const mockListing: Listing = {
  id: "1",
  title: "Grand Apartment in Center of London",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  city: "London",
  address: "Baker Street 221b",
  created_at: new Date("2020-01-01"),
  category: "apartment",
  max_guests: 15,
  day_price: 459.99,
  images: [
    "https://t4.ftcdn.net/jpg/01/57/39/19/360_F_157391956_UrG0WMZiXiG2UKktQeaKTVgaLNSa8hIT.jpg",
    "https://cf.bstatic.com/xdata/images/hotel/max1024x768/430666399.jpg?k=3ec09fe5fe134a2c1a20215861ab31f64f209ea9bfa1ba526fd0438abef3a17b&o=&hp=1",
    "https://t4.ftcdn.net/jpg/01/57/39/19/360_F_157391956_UrG0WMZiXiG2UKktQeaKTVgaLNSa8hIT.jpg",
    "https://cf.bstatic.com/xdata/images/hotel/max1024x768/430666399.jpg?k=3ec09fe5fe134a2c1a20215861ab31f64f209ea9bfa1ba526fd0438abef3a17b&o=&hp=1",
  ],
};
