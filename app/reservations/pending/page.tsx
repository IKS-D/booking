import getCurrentUser from "@/actions/getCurrentUser";
import { getPendingReservations } from "@/actions/getReservations";
import PendingReservationsContent from "@/components/reservations/PendingReservationsContent";

const ReservationsPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <label className="text-lg font-semibold">
        Please sign in to continue
      </label>
    );
  }

  const pendingReservations = await getPendingReservations({});

  if (pendingReservations.length === 0) {
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
        reservations={pendingReservations}
        currentUser={currentUser}
      />
    </div>
  );
};

export default ReservationsPage;
