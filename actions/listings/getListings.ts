import supabase from "@/supabase/supabase";
import { QueryData, QueryResult } from "@supabase/supabase-js";

interface Params {
  listingId?: string;
  userId?: string;
  authorId?: string;
}

// If making changes to this code, make sure it doesn't break create reservation page
export type ListingWithDetails = QueryData<ReturnType<typeof getListingById>>;

export async function getListingById(listingId: number) {
  const { data, error } = await supabase
    .from("listings")
    .select(
      `
    *,
    category: listing_category (name),
    services: services (*),
    images: photos (url)
  `
    )
    .eq("id", listingId)
    .single();

  if (error) {
    console.error(error);
  }

  return { data, error };
}

export type Listings = QueryData<ReturnType<typeof getListingsBase>>;
export type Listing = Listings[0];

export async function getListings() {

  let { data: listings, error } = await getListingsBase();

  if (error) {
    console.error(error);
  }

  return { data: listings, error: error };
}

export type AverageData = QueryData<ReturnType<typeof getChartInformation>>;

export async function getChartInformation(listingId: number){
  const { data: listing, error: listingError } = await supabase
    .from("listings")
    .select("city")
    .eq("id", listingId)
    .single();

  if (listingError) {
    console.error(listingError);
    return { data: null, error: listingError };
  }

  const city = listing?.city;

  if (!city) {
    console.error("City not found for the listing");
    return { data: null, error: "City not found for the listing" };
  }

  const { data: listings, error } = await supabase
    .from("listings")
    .select("number_of_places, day_price")
    .eq("city", city);

    if (error) {
      console.error(error);
      return { data: null, error };
    }

    const groupedListings: Record<number, number[]> = {};
    listings?.forEach((listing) => {
    const numberOfPlaces = listing.number_of_places;
    const price = listing.day_price;

    if (numberOfPlaces in groupedListings) {
      groupedListings[numberOfPlaces].push(price);
    } else {
      groupedListings[numberOfPlaces] = [price];
    }
  });

  const averages: Record<number, number> = {};
  Object.entries(groupedListings).forEach(([numberOfPlaces, prices]) => {
    const averagePrice =
      prices.reduce((sum, price) => sum + price, 0) / prices.length;
    averages[parseInt(numberOfPlaces, 10)] = averagePrice;
  });

  return { data: averages, error: null };
}

export async function getPersonalListings(params: Params) {
  const { userId } = params;

  const { data, error } = await supabase.from("listings").select('*, category: listing_category (name), services: services (*), images: photos (url)').eq("host_id",userId!);

  if (error) {
    console.error(error);
  }

  return { data, error };
}

export async function insertListing({
  listing,
  user_id,
} : {
  listing: Partial<Listing>;
  user_id: string;
}){

  let { data: addedListing, error } = await supabase.from("listings")
                                               .insert({
                                                address: listing.address!,
                                                category_id: 1,
                                                city: listing.city!,
                                                country: listing.country!,
                                                creation_date: new Date().toISOString(),
                                                day_price: listing.day_price!,
                                                description: listing.description!,
                                                host_id: user_id,
                                                number_of_places: listing.number_of_places!,
                                                photos: "asdasd",
                                                suspension_status: false,
                                                title: listing.title!,
                                              })
                                              .select()
                                              .single();
  if (error) {
    console.error(error);
  }

  return { error };
}

function getListingsBase() {
  return supabase.from("listings").select('*, category: listing_category (name), services: services (*), images: photos (url)');
}

export type Categories = QueryData<ReturnType<typeof getListingCategories>>;

export async function getListingCategories(){
  let { data: categories, error } = await supabase.from("listing_category").select('*');
                                              
  if (error) {
    console.error(error);
  }

  return { data: categories, error };
}
