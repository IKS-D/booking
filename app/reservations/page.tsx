import getCurrentUser from "@/actions/users/usersQueries";
import { getReservations } from "@/actions/reservations/reservationsQueries";
import ReservationsContent from "../../components/reservations/ReservationsContent";
import { notFound } from "next/navigation";
import NotFoundComponent from "@/components/NotFoundComponent";
import { unstable_SuspenseList } from "react";
import { unstable_noStore as noStore } from "next/cache";

const ReservationsPage = async () => {
  noStore();
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <label className="text-lg font-semibold">
        Please sign in to continue
      </label>
    );
  }

  const { data: reservations, error } = await getReservations(currentUser.id);

  if (!reservations || reservations.length === 0) {
    return (
      <NotFoundComponent
        title="No reservations found"
        subtitle="You have no reservations yet."
      />
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
