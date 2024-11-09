import { getListings } from "@/actions/listings/listingsQueries";
import ListingsContent from "../../components/listings/ListingsContent";
import NotFoundComponent from "@/components/NotFoundComponent";

export const revalidate = 0;
export const dynamic = "force-dynamic";

const ListingsPage = async () => {
  const { data: listings } = await getListings();
  if (!listings || listings.length === 0) {
    return (
      <div className="h-full flex flex-col justify-center items-center">
        <div className="flex flex-col justify-center items-center">
          <NotFoundComponent
            title="No listings found"
            subtitle="Create a new listing to get started"
          />
        </div>
      </div>
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
