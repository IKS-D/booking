"use client";

import { User } from "@supabase/supabase-js";
import { subtitle, title } from "@/components/primitives";
import HostReservationTable from "./HostReservationTable";
import { toast } from "sonner";
import {
  ReservationWithDetails,
  rejectReservation,
  confirmReservation,
} from "@/actions/reservations/reservationsQueries";

interface HostReservationsContentProps {
  reservations: ReservationWithDetails[];
  currentUser?: User | null;
}

const HostReservationsContent: React.FC<HostReservationsContentProps> = ({
  reservations,
  currentUser,
}) => {
  return (
    <div className="max-w-full items-center">
      <label className={title({ size: "sm" })}>Listings reservations</label>
      <label className={subtitle({})}>All your listings reservations</label>

      <HostReservationTable
        hostReservations={reservations}
        onConfirm={(res) => {
          toast.success(`Reservation ${res.id} confirmed!`);
          confirmReservation(res.id.toString());
        }}
        onReject={(res) => {
          toast.error(`Reservation ${res.id} canceled!`);
          rejectReservation(res.id.toString());
        }}
      />
    </div>
  );
};

export default HostReservationsContent;
