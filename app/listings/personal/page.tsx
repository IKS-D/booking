import getCurrentUser from "@/actions/getCurrentUser";
import { getPersonalListings } from "@/actions/getListings";
import PersonalListingsContent from "../../../components/listings/PersonalListingsContent";

const PersonalListingsPage = async () => {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return (
        <label className="text-lg font-semibold">
            Please sign in to continue
        </label>
        );
    }
  
    const personalListings = await getPersonalListings({});

    if (personalListings.length === 0) {
      return (
        <div>
            <label className="text-lg font-semibold">No personal listings found</label>
            <label className="text-lg font-semibold">Create new listing</label>
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
        <PersonalListingsContent
            listings={personalListings}
            currentUser={currentUser}
        />
      </div>
    );
  };
  
  export default PersonalListingsPage;