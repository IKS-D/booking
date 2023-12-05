import ProfileCard from "@/components/profile/ProfileCard";
import OwnerProfileCard from "@/components/profile/OwnerProfileCard";
import ProfileDeleteForm from "@/components/profile/delete/DeleteProfileForm"
import getCurrentUser, { getUserProfileById } from "@/actions/users/usersQueries";
import { getReservations } from "@/actions/reservations/reservationsQueries";

export default async function ProfileDeletePage() {
  const user = await getCurrentUser();
  // const { data: userProfile, error } = await getUserProfileById(user!.id);
  const { data: reservations, error } = await getReservations(user!.id);
  const reservationCount = reservations?.length;
  const listingCount = 0
  // TODO: Implement listing check


  return (
    <div className="flex flex-col items-center justify-center gap-4 text-foreground">
      <div className="text-2xl font-bold mb-2">
        Delete your profile
      </div>
      <ProfileDeleteForm user={user!} reservationCount={reservationCount!} listingCount={listingCount!}/>
    </div>
  );
}
