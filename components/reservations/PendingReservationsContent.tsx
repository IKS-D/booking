"use client";

import { User } from "@supabase/supabase-js";
import { subtitle, title } from "@/components/primitives";
import PendingReservationTable from "./PendingReservationTable";
import { toast } from "sonner";
import { ReservationWithDetails } from "@/actions/getReservations";

interface PendingReservationsContentProps {
  reservations: ReservationWithDetails[];
  currentUser?: User | null;
}

const PendingReservationsContent: React.FC<PendingReservationsContentProps> = ({
  reservations,
  currentUser,
}) => {
  return (
    <div className="max-w-full items-center">
      <label className={title({ size: "sm" })}>Pending Reservations</label>
      <label className={subtitle({})}>
        All your listings pending reservations
      </label>

      <PendingReservationTable
        pendingReservations={reservations}
        onConfirm={(res) => {
          toast.success(`Reservation ${res.id} confirmed!`);
        }}
        onCancel={(res) => {
          toast.error(`Reservation ${res.id} canceled!`);
        }}
      />
    </div>
  );
};

export default PendingReservationsContent;
