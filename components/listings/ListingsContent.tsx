import { Listing, Listings } from "@/actions/listings/listingsQueries";
import ListingCard from "@/components/listings/ListingCard";
import { subtitle, title } from "@/components/primitives";

interface ListingsContentProps {
  listings: Listings;
}

const ListingsContent: React.FC<ListingsContentProps> = ({ listings }) => {
  return (
    <div className="max-w-full items-center">
      <label className={title({ size: "sm" })}>Listings</label>
      <label className={subtitle({})}>
        All listings that are on the website
      </label>
      <div
        className="
          grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5
          gap-8  
          mt-10
          pb-10
          justify-center
        "
      >
        {listings.map((listing: Listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
};

export default ListingsContent;
