import getCurrentUser from "@/actions/users/getCurrentUser";
import { getHostPendingReservations } from "@/actions/reservations/getReservations";
import PendingReservationsContent from "@/components/reservations/PendingReservationsContent";

export const revalidate = 0;

const ReservationsPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <label className="text-lg font-semibold">
        Please sign in to continue
      </label>
    );
  }

  const { data: pendingReservations, error } = await getHostPendingReservations(
    currentUser.id
  );

  if (pendingReservations && pendingReservations.length === 0) {
    return (
      <label className="text-lg font-semibold">
        No pending reservations found.
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
      <PendingReservationsContent
        reservations={pendingReservations!}
        currentUser={currentUser}
      />
    </div>
  );
};

export default ReservationsPage;
