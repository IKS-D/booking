"use client";

import ReservationCard from "@/components/reservations/ReservationCard";
import { User } from "@supabase/supabase-js";
import { subtitle, title } from "@/components/primitives";
import { ReservationWithDetails } from "@/actions/getReservations";

interface ReservationsContentProps {
  reservations: ReservationWithDetails[];
  currentUser?: User | null;
}

const ReservationsContent: React.FC<ReservationsContentProps> = ({
  reservations,
  currentUser,
}) => {
  return (
    <div className="max-w-full items-center">
      <label className={title({ size: "sm" })}>Reservations</label>
      <label className={subtitle({})}>All your reservations</label>
      <div
        className="
          grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5
          gap-8  
          mt-10
          justify-center
        "
      >
        {reservations.map((reservation) => (
          <ReservationCard
            key={reservation.id}
            reservation={reservation}
            onAction={() => {}}
            disabled={false}
            actionLabel="Cancel reservation"
            currentUser={currentUser}
          />
        ))}
      </div>
    </div>
  );
};

export default ReservationsContent;
