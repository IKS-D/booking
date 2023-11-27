import { getListings } from "@/actions/listings/getListings";
import ListingsContent from "../../components/listings/ListingsContent";

const ListingsPage = async () => {
  const listings = await getListings({});

  if (listings.length === 0) {
    return (
      <label className="text-lg font-semibold">No reservations found.</label>
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
      <ListingsContent listings={listings} />
    </div>
  );
};

export default ListingsPage;
