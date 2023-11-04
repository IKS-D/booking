import { getListing } from "@/actions/getListings";
import ListingContent from "../../../components/listings/ListingContent";
import { redirect } from 'next/navigation'

export default async function ListingPage({
    params,
  }: {
    params: { id: string }
  }) {
    const id = params.id // Extract the 'id' from the URL

    const listing = await getListing({ listingId: id as string });

    if (listing.error) {
        return(
            <label className="text-lg font-semibold">
                Such listing does not exist
            </label>
        );
    }
    
    return (
        <div
            className="
                mx-auto
                xl:px-20 
                md:px-10
                sm:px-2
                px-4
                justify-center
            "
        >
            <ListingContent
                listing={listing}
            />
        </div>
    );
};
