import getCurrentUser from "@/actions/users/usersQueries";
import CreateListingForm from "../../../../components/listings/CreateListingForm";

const PersonalListingsPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <label className="text-lg font-semibold">
        Please sign in to continue
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
      <CreateListingForm />
    </div>
  );
};

export default PersonalListingsPage;
