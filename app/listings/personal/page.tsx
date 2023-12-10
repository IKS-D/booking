import getCurrentUser from "@/actions/users/usersQueries";
import { getPersonalListings } from "@/actions/listings/listingsQueries";
import PersonalListingsContent from "../../../components/listings/PersonalListingsContent";
import NotFoundComponent from "@/components/NotFoundComponent";
import { Button } from "@nextui-org/react";
import Link from "next/link";

const PersonalListingsPage = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return (
      <label className="text-lg font-semibold">
        Please sign in to continue
      </label>
    );
  }

  const { data: personalListings } = await getPersonalListings(currentUser.id);

  if (!personalListings || personalListings.length === 0) {
    return (
      <div className="h-full flex flex-col justify-center items-center">
        <div className="flex flex-col justify-center items-center">
          <NotFoundComponent
            title="No personal listings found"
            subtitle="Create a new listing to get started"
          />
          <Button variant="flat">
            <Link href="/listings/personal/create">Create new listing</Link>
          </Button>
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
