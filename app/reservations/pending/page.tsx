import getCurrentUser from "@/actions/users/usersQueries";
import { getHostPendingReservations } from "@/actions/reservations/reservationsQueries";
import PendingReservationsContent from "@/components/reservations/PendingReservationsContent";
import { title } from "@/components/primitives";

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

  const { data: pendingReservations } = await getHostPendingReservations(
    currentUser.id
  );

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
