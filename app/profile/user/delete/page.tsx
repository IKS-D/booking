import UserProfileDeleteForm from "@/components/profile/user/delete/UserProfileDeleteForm";
import getCurrentUser from "@/actions/users/usersQueries";
import { getReservations } from "@/actions/reservations/reservationsQueries";
import { toast } from "sonner";
import { getPersonalListings } from "@/actions/listings/listingsQueries";

export default async function UserProfileDeletePage() {
  const user = await getCurrentUser();

  const { data: reservations, error: reservationsError } =
    await getReservations(user!.id);
  if (reservationsError) {
    toast.error(reservationsError.message);
  }
  let reservationCount = 0;
  if(reservations && reservations?.length > 0){
    // Check for active reservations
    const today = new Date();
    for(const reservation of reservations){
      if(reservation.status === 1 || reservation.status === 2){
        const startDate = new Date(reservation.start_date);
        const endDate = new Date(reservation.end_date);
        if(startDate > today || endDate > today){
          reservationCount++;
        }
      }
    }
  }

  const { data: listings, error: listingsError } = await getPersonalListings(
    user!.id
  );
  if (listingsError) {
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
