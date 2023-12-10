import Link from "next/link";
import Image from "next/image";
import { Listing } from "@/actions/listings/listingsQueries";
import { defaultListingImage } from "@/config/constants";

interface ListingCardProps {
  listing: Listing;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
}

const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onAction,
  disabled,
  actionLabel,
  actionId = "",
}) => {
  return (
    <Link href={`/listings/[id]`} as={`/listings/${listing.id}`} passHref>
      <div className="cursor-pointer group flex flex-col gap-2 w-full">
        {listing.images && listing.images.length > 0 ? (
          <div className="aspect-square relative overflow-hidden rounded-xl">
            <Image
              fill
              className="object-cover h-full w-full group-hover:scale-110 transition"
              src={listing.images[0].url}
              alt="Listing"
            />

            {/* Can be used to add icons on top of the image
            <div className="absolute top-3 right-3">
              <HeartButton listingId={listing.id} currentUser={currentUser} />
            </div> */}
          </div>
        ) : (
          // Display default image if there are no images
          <div className="aspect-square relative overflow-hidden rounded-xl">
            <Image
              fill
              className="object-cover h-full w-full group-hover:scale-110 transition"
              src={defaultListingImage}
              alt="Default Listing"
            />
          </div>
        )}

        <div className="font-semibold text-lg">{listing.title}</div>
        <div className="text-default-600 font-light">
          {listing.category?.name &&
            `${listing.category.name
              .charAt(0)
              .toUpperCase()}${listing.category.name.slice(1)}`}
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
