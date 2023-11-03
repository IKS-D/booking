import { Listing } from "@/types";
import Link from "next/link";
import Image from "next/image";

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
//   const detailsModal = useDisclosure();

  return (
    <>
      {/* <ReservationDetailsModal
        listing={listing}
        isOpen={detailsModal.isOpen}
        onOpenChange={detailsModal.onOpenChange}
      /> */}
        <Link href={`/listings/[id]`} as={`/listings/${listing.id}`} className="cursor-pointer group" passHref>
                <div className="flex flex-col gap-2 w-full">
                    <div
                        className="
                        aspect-square 
                        w-full 
                        relative 
                        overflow-hidden 
                        rounded-xl
                    "
                    >
                        <Image
                        fill
                        className="
                        object-cover 
                        h-full 
                        w-full 
                        group-hover:scale-110 
                        transition
                        "
                        src={listing.images[0]}
                        alt="Listing"
                        />

                        {/* Can be used to add icons on top of the image
                        <div
                        className="
                        absolute
                        top-3
                        right-3
                        "
                        >
                        <HeartButton listingId={listing.id} currentUser={currentUser} />
                        </div> */}
                    </div>

                    <div className="font-semibold text-lg">{listing.title}</div>
                    <div className="text-default-600 font-ligth">
                        {listing.category.charAt(0).toUpperCase() +
                        listing.category.slice(1)}
                    </div>
                </div>
        </Link>
    </>
  );
};

export default ListingCard;
