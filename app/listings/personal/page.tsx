import getCurrentUser from "@/actions/users/usersQueries";
import { getPersonalListings } from "@/actions/listings/getListings";
import PersonalListingsContent from "../../../components/listings/PersonalListingsContent";
import CreateNewListingButton from "../../../components/listings/CreateNewListingButton";

const PersonalListingsPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <label className="text-lg font-semibold">
        Please sign in to continue
      </label>
    );
  }

  const { data: personalListings, error } = await getPersonalListings({});

  if (!personalListings || personalListings.length === 0) {
    return (
      <div>
        <label className="flex justify-center text-xl font-semibold">
          No personal listings found
        </label>
        <div className="flex justify-center mt-10">
          <CreateNewListingButton />
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
      <PersonalListingsContent
        listings={personalListings}
        currentUser={currentUser}
      />
    </div>
  );
};

export default PersonalListingsPage;
