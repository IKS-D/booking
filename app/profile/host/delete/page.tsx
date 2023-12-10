import HostProfileDeleteForm from "@/components/profile/host/delete/HostProfileDeleteForm"
import getCurrentUser, { getUserProfileById } from "@/actions/users/usersQueries";
import { toast } from "sonner";
import { getPersonalListings } from "@/actions/listings/getListings";

export default async function HostProfileDeletePage() {
  const user = await getCurrentUser();
  const { data: listings, error: listingsError } = await getPersonalListings(user!.id);
  if(listingsError){
    console.error(listingsError);
    toast.error(listingsError.message);
  }
  const listingCount = listings ? listings?.length : 0;

  return (
    <div className="flex flex-col items-center justify-center gap-4 text-foreground">
      <div className="text-2xl font-bold mb-2">
        Delete your host profile
      </div>
      <HostProfileDeleteForm user={user!} listingCount={listingCount!}/>
    </div>
  );
}
