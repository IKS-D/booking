import getCurrentUser from "@/actions/users/usersQueries";
import { getHostReservations } from "@/actions/reservations/reservationsQueries";
import HostReservationsContent from "@/components/reservations/HostReservationsContent";

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

  const { data: hostReservations } = await getHostReservations(
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
      <HostReservationsContent
        reservations={hostReservations!}
        currentUser={currentUser}
      />
    </div>
  );
};

export default ReservationsPage;
