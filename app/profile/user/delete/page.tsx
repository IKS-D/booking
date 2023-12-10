import UserProfileDeleteForm from "@/components/profile/user/delete/UserProfileDeleteForm";
import getCurrentUser, {
  getUserProfileById,
} from "@/actions/users/usersQueries";
import { getReservations } from "@/actions/reservations/reservationsQueries";
import { toast } from "sonner";
import { getPersonalListings } from "@/actions/listings/listingsQueries";

export default async function UserProfileDeletePage() {
  const user = await getCurrentUser();

  const { data: reservations, error: reservationsError } =
    await getReservations(user!.id);
  if (reservationsError) {
    console.error(reservationsError);
    toast.error(reservationsError.message);
  }
  const reservationCount = reservations ? reservations?.length : 0;

  const { data: listings, error: listingsError } = await getPersonalListings(
    user!.id
  );
  if (listingsError) {
    console.error(listingsError);
    toast.error(listingsError.message);
  }
  const listingCount = listings ? listings?.length : 0;

  return (
    <div className="flex flex-col items-center justify-center gap-4 text-foreground">
      <div className="text-2xl font-bold mb-2">Delete your profile</div>
      <UserProfileDeleteForm
        user={user!}
        reservationCount={reservationCount}
        listingCount={listingCount}
      />
    </div>
  );
}
