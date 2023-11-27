import { getListing } from "@/actions/listings/getListings";
import ListingContent from "../../../components/listings/ListingContent";

export default async function ListingPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id; // Extract the 'id' from the URL

  const { date: listing, error } = await getListing({
    listingId: id as string,
  });

  if (error) {
    return (
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
      <ListingContent listing={listing} />
    </div>
  );
}
