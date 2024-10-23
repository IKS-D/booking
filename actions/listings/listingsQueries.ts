import { revalidate } from "@/components/TopNavbar";
import supabase from "@/supabase/supabase";
import { QueryData, QueryResult } from "@supabase/supabase-js";
import { nanoid } from "nanoid";
import { unstable_noStore as noStore, revalidatePath } from 'next/cache';

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


  console.log(error);

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

export function getFilenameFromUrl(url: string): string {
  try {
    const urlObj = new URL(url); // Ensure it's a valid URL
    const urlParts = urlObj.pathname.split('/').filter(Boolean); // Split and remove empty parts
    
    if (urlParts.length >= 2) {
      return `${urlParts[urlParts.length - 2]}/${urlParts[urlParts.length - 1]}`;
    }
    
    return urlParts[0];
  } catch (error) {
    // If the URL is invalid, return it as-is
    return url;
  }
}

export async function getPersonalListings(userId: string) {
  const { data, error } = await supabase.from("listings").select('*, category: listing_category (name), services: services (*), images: photos (url)').eq("host_id",userId!);

  return { data, error };
}

export async function deleteListing({
  listing_id,
}: {
  listing_id: number;
}) {
  const currentDate = new Date();
  currentDate.setUTCHours(0, 0, 0, 0); // Set the time to midnight in UTC
  
  const { data: reservations, error: reservationsError } = await supabase
    .from('reservations')
    .select('id')
    .eq('listing_id', listing_id)
    .eq('status', 2)
    .gt('end_date', currentDate.toISOString());

  if (reservationsError) {
    return { error: reservationsError };
  }

  if (reservations && reservations.length > 0) {
    const errorMessage = 'Cannot delete listing with active reservations';
    return { error: errorMessage };
  }

  // Retrieve the list of photo URLs associated with the listing
  const { data: photos, error: photosError } = await supabase
    .from('photos')
    .select('url')
    .eq('listing_id', listing_id);

  if (photosError) {
    return { error: photosError };
  }

  // Delete the listing
  const { error: listingDeleteError } = await supabase
    .from('listings')
    .delete()
    .eq('id', listing_id);

  if (listingDeleteError) {
    return { error: listingDeleteError };
  }

  /* v8 ignore next 14 */
  if (photos && photos.length > 0) {
    console.log('Photos found:', photos);
    for (const photo of photos) {
        const filename = getFilenameFromUrl(photo.url);
        const { data: removed, error: photoDeleteError } = await supabase.storage
            .from('images')
            .remove([filename]);
          
        if (photoDeleteError) {
            return { error: photoDeleteError };
        }
    }
  }
  console.log('All photos deleted successfully');
  return { error: null };
}

export type PartialListingUpdate = Partial<{
  title: string;
  description: string;
  number_of_places: number;
  day_price: number;
}>;

export async function updateListing({
  editedListing,
  files,
  listing_id,
}: {
  editedListing: PartialListingUpdate;
  files: FileList;
  listing_id: number;
}) {

  const priceInCents = Math.round(editedListing.day_price! * 100);
  editedListing.day_price = priceInCents;

  const { error: updateError } = await supabase
    .from('listings')
    .update(editedListing)
    .eq('id', listing_id);

  const folderName = `listing_${listing_id}`;

  /* v8 ignore next 23 */
  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    const uniqueFileName = `${Date.now()}_${nanoid()}_${file.name}`;
    
    const { data: fileData, error: fileError } = await supabase.storage
      .from('images')
      .upload(`${folderName}/${uniqueFileName}`, file);

    if (fileError) {
      console.error('Error uploading file:', fileError);
    } else {
      // Get the public URL of the uploaded file
      const fileURL = supabase.storage.from('images').getPublicUrl(fileData.path);
   
      await supabase.from("photos").insert({
        listing_id: listing_id,
        url: fileURL.data.publicUrl,
      });
    }
  }
  return { updateError };
}

export async function insertListing({
  listing,
  user_id,
  files,
  services,
}: {
  listing: Partial<Listing>;
  user_id: string;
  files: FileList;
  services: ServiceInput[];
}) {
  const priceInCents = Math.round(listing.day_price! * 100);
  listing.day_price = priceInCents;

  // Insert the listing into the database
  let { data: addedListing, error } = await supabase
    .from("listings")
    .insert({
      address: listing.address!,
      category_id: listing.category_id!,
      city: listing.city!,
      country: listing.country!,
      creation_date: new Date().toISOString(),
      day_price: listing.day_price!,
      description: listing.description!,
      host_id: user_id,
      number_of_places: listing.number_of_places!,
      suspension_status: false,
      title: listing.title!,
    })
    .select()
    .single();

  // Return error if there is one
  if (error) {
    return { data: null, error };
  }

  // Handle file uploads
  const folderName = `listing_${addedListing!.id}`;
  /* v8 ignore next 23 */
  if (files && files.length !== 0) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const uniqueFileName = `${Date.now()}_${nanoid()}_${file.name}`;

      const { data: fileData, error: fileError } = await supabase.storage
        .from('images')
        .upload(`${folderName}/${uniqueFileName}`, file);

      if (fileError) {
        return { data: null, error: fileError };
      } else {
        // Get the public URL of the uploaded file
        const fileURL = supabase.storage.from('images').getPublicUrl(fileData.path);

        await supabase.from("photos").insert({
          listing_id: addedListing!.id,
          url: fileURL.data.publicUrl,
        });
      }
    }
  }

  // Handle services insertion
  if (!services || services.length === 0) {
    return { data: addedListing, error: null };
  }

  for (let i = 0; i < services.length; i++) {

    const service = services[i];
  
    const priceInCents = Math.round(Number(service.price) * 100);
  
    // Correct placement of closing curly brace
    const { error } = await supabase.from("services").insert({
      title: service.title,
      description: service.description,
      price: priceInCents,
      listing_id: addedListing!.id,
    }); // Close the insert object here
  
    // Error handling happens outside the insert object
    if (error) {
      return { data: addedListing, error };
    }
  }

  // Return the inserted listing and no errors
  return { data: addedListing, error: null };
}

function getListingsBase() {
  return supabase.from("listings").select('*, category: listing_category (name), services: services (*), images: photos (url)');
}

export type Categories = QueryData<ReturnType<typeof getListingCategories>>;

export async function getListingCategories(){
  let { data: categories, error } = await supabase.from("listing_category").select('*');                                       

  return { data: categories, error };
}

export type ServiceInput = {
  title: string;
  description: string;
  price: number;
};