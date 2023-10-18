import getCurrentUser from "@/actions/getCurrentUser";
import TripsClient from "../../components/reservations/ReservationsContent";
import getReservations from "@/actions/getReservations";
import ReservationsContent from "../../components/reservations/ReservationsContent";

const ReservationsPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <label className="text-lg font-semibold">
        Please sign in to continue
      </label>
    );
  }

  const reservations = await getReservations({});

  if (reservations.length === 0) {
    return (
      <label className="text-lg font-semibold">No reservations found.</label>
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
      <ReservationsContent
        reservations={reservations}
        currentUser={currentUser}
      />
    </div>
  );
};

export default ReservationsPage;
